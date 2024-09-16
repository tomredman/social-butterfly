import { v } from "convex/values";

import { query } from "../_generated/server";

export const getProgress = query({
  args: { socialAccountId: v.id("socialAccounts") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("importProgress")
      .withIndex("by_socialAccountId", (q) =>
        q.eq("socialAccountId", args.socialAccountId)
      )
      .first();
  },
});

export const getScheduledJobStatus = query({
  args: { jobId: v.id("_scheduled_functions") },
  handler: async (ctx, args) => {
    const scheduledJob = await ctx.db.system.get(args.jobId);

    if (!scheduledJob) {
      return { status: "not_found" };
    }

    if (scheduledJob.completedTime) {
      return {
        completedTime: scheduledJob.completedTime,
        state: scheduledJob.state,
        status: "completed",
      };
    }

    return {
      scheduledTime: scheduledJob.scheduledTime,
      status: "pending",
    };
  },
});
