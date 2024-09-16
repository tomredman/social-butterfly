import { v } from "convex/values";

import { Id } from "../_generated/dataModel";
import { internalMutation } from "../_generated/server";

export const insertSocialAccount = internalMutation({
  args: {
    fbId: v.any(),
    fbName: v.string(),
    token: v.string(),
  },
  handler: async (ctx, args): Promise<Id<"socialAccounts">> => {
    const existingAccount = await ctx.db
      .query("socialAccounts")
      .filter((q) => q.eq(q.field("fbId"), args.fbId))
      .first();

    if (existingAccount) {
      await ctx.db.patch(existingAccount._id, {
        fbName: args.fbName,
        token: args.token,
      });
      return existingAccount._id;
    } else {
      const id = await ctx.db.insert("socialAccounts", {
        fbId: args.fbId,
        fbName: args.fbName,
        token: args.token,
      });
      return id;
    }
  },
});
