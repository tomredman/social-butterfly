import { v } from "convex/values";

import { query } from "../_generated/server";

export const getInstagramPostsBySocialAccountId = query({
  args: { socialAccountId: v.id("socialAccounts") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("instagramPosts")
      .filter((q) => q.eq(q.field("socialAccountId"), args.socialAccountId))
      .collect();
  },
});

export const getInstagramPostById = query({
  args: { id: v.id("instagramPosts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
