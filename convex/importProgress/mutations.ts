import { v } from "convex/values";

import { internalMutation } from "../_generated/server";

export const completeProgress = internalMutation({
  args: { socialAccountId: v.id("socialAccounts") },
  handler: async (ctx, args) => {
    const progress = await ctx.db
      .query("importProgress")
      .withIndex("by_socialAccountId", (q) =>
        q.eq("socialAccountId", args.socialAccountId)
      )
      .first();
    if (progress) {
      await ctx.db.delete(progress._id);
    }
  },
});

export const initializeProgress = internalMutation({
  args: {
    pageName: v.string(),
    socialAccountId: v.id("socialAccounts"),
    totalPosts: v.number(),
  },
  handler: async (ctx, args) => {
    const existingProgress = await ctx.db
      .query("importProgress")
      .withIndex("by_socialAccountId", (q) =>
        q.eq("socialAccountId", args.socialAccountId)
      )
      .first();

    if (existingProgress) {
      await ctx.db.patch(existingProgress._id, {
        lastUpdated: new Date().toISOString(),
        pageName: args.pageName,
        socialAccountId: args.socialAccountId,
        status: "in_progress",
        totalPosts: args.totalPosts,
      });
    } else {
      await ctx.db.insert("importProgress", {
        lastUpdated: new Date().toISOString(),
        pageName: args.pageName,
        processedPosts: 0,
        socialAccountId: args.socialAccountId,
        status: "in_progress",
        totalPosts: args.totalPosts,
      });
    }
  },
});

export const updateProgress = internalMutation({
  args: { processedPosts: v.number(), socialAccountId: v.id("socialAccounts") },
  handler: async (ctx, args) => {
    const progress = await ctx.db
      .query("importProgress")
      .withIndex("by_socialAccountId", (q) =>
        q.eq("socialAccountId", args.socialAccountId)
      )
      .first();

    if (progress) {
      console.log("Processed, total", args.processedPosts, progress.totalPosts);

      await ctx.db.patch(progress._id, {
        lastUpdated: new Date().toISOString(),
        processedPosts: args.processedPosts,
        status:
          args.processedPosts === progress.totalPosts
            ? "completed"
            : "in_progress",
      });
    }
  },
});
