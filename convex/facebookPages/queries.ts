import { v } from "convex/values";

import { internalQuery } from "../_generated/server";

export const getFacebookPagesBySocialAccountId = internalQuery({
  args: { socialAccountId: v.id("socialAccounts") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("facebookPages")
      .filter((q) => q.eq(q.field("socialAccountId"), args.socialAccountId))
      .collect();
  },
});
