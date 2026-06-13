import { schedules } from "@trigger.dev/sdk/v3";

export const dailyDigestTask = schedules.task({
    id: "daily-job-digest",
    cron: "0 8 * * *", // 8:00 AM UTC
    run: async (payload) => {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const apiKey = process.env.TRIGGER_API_KEY;

        console.log(`Starting scheduled daily digest at ${payload.timestamp}`);

        if (!apiKey) {
            throw new Error("TRIGGER_API_KEY is not defined");
        }

        const response = await fetch(`${baseUrl}/api/campaign?key=${apiKey}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Campaign failed: ${response.status} ${JSON.stringify(errorData)}`);
        }

        const result = await response.json();
        console.log("Daily digest completed naturally:", result);
        return result;
    },
});
