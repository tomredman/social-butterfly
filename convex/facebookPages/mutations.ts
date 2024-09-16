import { v } from "convex/values";

import { internalMutation } from "../_generated/server";

export const insertOrUpdateFacebookPage = internalMutation({
  args: v.any(),
  handler: async (ctx, args) => {
    const existingPage = await ctx.db
      .query("facebookPages")
      .filter((q) => q.eq(q.field("fbPageId"), args.fbPageId))
      .first();

    if (existingPage) {
      await ctx.db.patch(existingPage._id, args);
    } else {
      const newPageId = await ctx.db.insert("facebookPages", {
        ...args,
        id: args.fbPageId,
      });
      return newPageId;
    }

    return existingPage?._id;
  },
});
