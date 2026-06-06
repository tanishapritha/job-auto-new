import { client } from "@/trigger";
import { cronTrigger } from "@trigger.dev/sdk";

// This job runs every day at 8:00 AM UTC
client.defineJob({
    id: "daily-job-digest",
    name: "Daily Job Digest",
    version: "0.1.0",
    trigger: cronTrigger({
        cron: "0 8 * * *",
    }),
    run: async (payload, io, ctx) => {
        await io.runTask("send-digests", async () => {
            // We call the internal campaign API logic
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
            const response = await fetch(`${baseUrl}/api/campaign?key=${process.env.TRIGGER_API_KEY}`);

            if (!response.ok) {
                throw new Error(`Campaign failed with status ${response.status}`);
            }

            const result = await response.json();
            return result;
        });
    },
});
