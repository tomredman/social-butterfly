import { v } from "convex/values";

import { internalQuery, query } from "../_generated/server";

export const getScheduledPostById = internalQuery({
  args: { id: v.id("scheduledPosts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getScheduledPostsByPageId = query({
  args: { pageId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("scheduledPosts")
      .filter((q) => q.eq(q.field("pageId"), args.pageId))
      .collect();
  },
});

export const getPendingScheduledPosts = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("scheduledPosts")
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();
  },
});
