// import { v } from "convex/values";

// import { internalMutation, internalQuery } from "./_generated/server";

// export const getSocialAccountByName = internalQuery({
//   args: { fbName: v.string() },
//   handler: async (ctx, args) => {
//     const socialAccount = await ctx.db
//       .query("socialAccounts")
//       .filter((q: any) => q.eq(q.field("fbName"), args.fbName))
//       .first();

//     return socialAccount;
//   },
// });

// export const insertSocialAccount = internalMutation({
//   args: {
//     fbId: v.any(),
//     fbName: v.string(),
//     token: v.string(),
//   },
//   handler: async (ctx, args) => {
//     const existingAccount = await ctx.db
//       .query("socialAccounts")
//       .filter((q) => q.eq(q.field("fbId"), args.fbId))
//       .first();

//     if (existingAccount) {
//       await ctx.db.patch(existingAccount._id, {
//         fbName: args.fbName,
//         token: args.token,
//       });
//       return existingAccount._id;
//     } else {
//       const id = await ctx.db.insert("socialAccounts", {
//         fbId: args.fbId,
//         fbName: args.fbName,
//         token: args.token,
//       });
//       return id;
//     }
//   },
// });

// export const getSocialAccountById = internalQuery({
//   args: { id: v.id("socialAccounts") },
//   handler: async (ctx, args) => {
//     return await ctx.db.get(args.id);
//   },
// });

// export const insertOrUpdateFacebookPage = internalMutation({
//   args: {
//     accessToken: v.string(),
//     biography: v.optional(v.string()),
//     fbPageId: v.string(),
//     followers_count: v.optional(v.number()),
//     follows_count: v.optional(v.number()),
//     id: v.optional(v.string()),
//     ig_id: v.optional(v.number()),
//     instagramBusinessAccountId: v.optional(v.string()),
//     media_count: v.optional(v.number()),
//     name: v.string(),
//     network: v.string(),
//     profile_picture_url: v.optional(v.string()),
//     socialAccountId: v.id("socialAccounts"),
//     username: v.optional(v.string()),
//   },
//   handler: async (ctx, args) => {
//     const existingPage = await ctx.db
//       .query("facebookPages")
//       .filter((q) => q.eq(q.field("fbPageId"), args.fbPageId))
//       .first();

//     if (existingPage) {
//       await ctx.db.patch(existingPage._id, args);
//     } else {
//       await ctx.db.insert("facebookPages", {
//         ...args,
//         id: args.fbPageId,
//       });
//     }
//   },
// });
