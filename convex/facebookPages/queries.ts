import { v } from "convex/values";

import { internalQuery, query } from "../_generated/server";

export const getFacebookPagesBySocialAccountId = query({
  args: { socialAccountId: v.id("socialAccounts") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("facebookPages")
      .filter((q) => q.eq(q.field("socialAccountId"), args.socialAccountId))
      .collect();
  },
});

export const getFacebookPageById = internalQuery({
  args: { fbPageId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("facebookPages")
      .filter((q) => q.eq(q.field("fbPageId"), args.fbPageId))
      .first();
  },
});
