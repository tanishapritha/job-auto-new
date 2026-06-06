import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

export const sendJobDigest = async (to: string, jobs: any[]) => {
    const jobListHtml = jobs.map(job => `
    <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h3 style="margin: 0 0 5px 0; color: #3b82f6;">${job.title}</h3>
      <p style="margin: 0 0 10px 0; font-weight: bold;">${job.company}</p>
      <div style="font-size: 14px; color: #64748b;">
        <span>📍 ${job.location}</span> | 
        <span>💰 ${job.salary}</span> | 
        <span>🔗 <a href="${job.link}" style="color: #3b82f6;">View Job</a></span>
      </div>
    </div>
  `).join('')

    return resend.emails.send({
        from: process.env.EMAIL_FROM || 'JobCrew <updates@resend.dev>',
        to: to,
        subject: `Daily Job Digest: ${jobs.length} new matches`,
        html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0f172a;">Your Crew Found Matches!</h1>
        <p style="color: #64748b;">Here are your top ${jobs.length} job matches for today based on your preferences.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        ${jobListHtml}
        <p style="font-size: 12px; color: #94a3b8; margin-top: 40px;">
          You are receiving this because you signed up for Job Automation Crew. 
          To change your preferences, visit your <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/preferences">Dashboard</a>.
        </p>
      </div>
    `
    })
}
