// import { v } from "convex/values";

// import { internalMutation, query } from "./_generated/server";

// export const insertOrUpdateInstagramPost = internalMutation({
//   args: {
//     caption: v.optional(v.string()),
//     comments: v.optional(v.number()),
//     engagement: v.optional(v.number()),
//     fbPageId: v.string(),
//     impressions: v.optional(v.number()),
//     likes: v.optional(v.number()),
//     mediaType: v.optional(v.string()),
//     mediaUrl: v.optional(v.string()),
//     metricsLastUpdated: v.optional(v.string()),
//     pageId: v.id("facebookPages"),
//     postId: v.string(),
//     reach: v.optional(v.number()),
//     socialAccountId: v.id("socialAccounts"),
//     timestamp: v.string(),
//   },
//   handler: async (ctx, args) => {
//     const existingPost = await ctx.db
//       .query("instagramPosts")
//       .filter((q) => q.eq(q.field("postId"), args.postId))
//       .first();

//     if (existingPost) {
//       await ctx.db.patch(existingPost._id, args);
//     } else {
//       await ctx.db.insert("instagramPosts", args);
//     }
//   },
// });

// export const getInstagramPostsBySocialAccountId = query({
//   args: { socialAccountId: v.id("socialAccounts") },
//   handler: async (ctx, args) => {
//     return await ctx.db
//       .query("instagramPosts")
//       .filter((q) => q.eq(q.field("socialAccountId"), args.socialAccountId))
//       .collect();
//   },
// });

// export const getInstagramPostById = query({
//   args: { id: v.id("instagramPosts") },
//   handler: async (ctx, args) => {
//     return await ctx.db.get(args.id);
//   },
// });