import { v } from "convex/values";

import { internalQuery } from "../_generated/server";

export const getSocialAccountByName = internalQuery({
  args: { fbName: v.string() },
  handler: async (ctx, args) => {
    const socialAccount = await ctx.db
      .query("socialAccounts")
      .filter((q) => q.eq(q.field("fbName"), args.fbName))
      .first();

    return socialAccount;
  },
});

export const getSocialAccountById = internalQuery({
  args: { id: v.id("socialAccounts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
