import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
})

export async function sendJobDigest(email: string, jobs: any[], isPreferencesSet: boolean = true) {
    const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    const preferencesUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/preferences`

    let html = ''
    let subject = ''

    if (!isPreferencesSet) {
        subject = '🚀 Action Required: Set your JobCrew preferences'
        html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #6366f1;">Welcome to JobCrew!</h2>
        <p>You haven't set your job preferences yet. To start receiving daily job matches, please tell us what you're looking for.</p>
        <div style="margin: 30px 0;">
          <a href="${preferencesUrl}" style="background-color: #6366f1; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">Set My Preferences</a>
        </div>
        <p style="color: #666; font-size: 14px;">Once set, we'll search for jobs starting tomorrow at 8:00 AM.</p>
      </div>
    `
    } else if (jobs.length === 0) {
        subject = '📅 Daily Update: No new matches today'
        html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #6366f1;">Daily Job Digest</h2>
        <p>We searched for jobs matching your preferences but didn't find any new listings today.</p>
        <p>We'll try again tomorrow morning!</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <a href="${dashboardUrl}" style="color: #6366f1; text-decoration: none;">View Dashboard</a>
      </div>
    `
    } else {
        subject = `🎯 ${jobs.length} New Job Matches for You`
        const jobListings = jobs.map(job => `
      <div style="padding: 15px; border: 1px solid #eee; border-radius: 8px; margin-bottom: 15px;">
        <h3 style="margin: 0 0 5px 0; color: #111;">${job.title}</h3>
        <p style="margin: 0; color: #666; font-size: 14px;">${job.company} • ${job.location}</p>
        <div style="margin-top: 10px;">
          <a href="${job.link}" style="color: #6366f1; text-decoration: none; font-size: 14px; font-weight: bold;">View Job Opening →</a>
        </div>
      </div>
    `).join('')

        html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px;">
        <h2 style="color: #6366f1; margin-bottom: 20px;">Your Daily Job Digest</h2>
        <p style="margin-bottom: 30px; color: #444;">Here are today's top picks based on your preferences:</p>
        
        ${jobListings}

        <div style="margin: 40px 0; text-align: center;">
          <a href="${dashboardUrl}" style="background-color: #6366f1; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">Open Full Dashboard</a>
        </div>
        
        <p style="color: #999; font-size: 12px; text-align: center;">
          To change your targets, visit your <a href="${preferencesUrl}" style="color: #6366f1;">preferences</a>.
        </p>
      </div>
    `
    }

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || '"JobCrew" <updates@yourdomain.com>',
            to: email,
            subject: subject,
            html: html,
        })
        console.log('Email sent successfully:', info.messageId)
        return info
    } catch (error) {
        console.error('Failed to send email via SMTP:', error)
        throw error
    }
}
