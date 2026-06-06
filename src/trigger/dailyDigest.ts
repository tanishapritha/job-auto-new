import { task, schedules } from "@trigger.dev/sdk/v3";

export const dailyDigestTask = task({
    id: "daily-digest",
    run: async (payload: { timestamp: Date }) => {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const apiKey = process.env.TRIGGER_API_KEY;

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

        return await response.json();
    },
});

// Note: In v3, schedules are often created via the dashboard or CLI,
// but can also be defined in code using schedules.create or in the trigger.config.ts if supported.
// For now, we define the task.
