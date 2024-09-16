// "use node";

// import axios from "axios";
// import { v } from "convex/values";
// import jwt from "jsonwebtoken";

// import { internal } from "./_generated/api";
// import { Id } from "./_generated/dataModel";
// import { action, internalAction } from "./_generated/server";
// import { igProfileFields } from "./types/IgProfileFields";
// import { JwtPayload } from "./types/JwtPayload";

// const getAxios = (accessToken: string) => {
//   return axios.create({
//     baseURL: "https://graph.facebook.com/v20.0/",
//     params: {
//       access_token: accessToken,
//     },
//   });
// };

// interface InitResponse {
//   error?: string;
//   fbId?: string;
//   fbName?: string;
//   jobId?: Id<"_scheduled_functions">;
//   pages?: any;
//   socialAccountId?: Id<"socialAccounts">;
//   success: boolean;
//   token?: string;
// }

// export const initializeInstagramConnection = action({
//   args: { code: v.string() },
//   handler: async (ctx, args: { code: string }): Promise<InitResponse> => {
//     const { fbId, fbName, success, token } = await ctx.runAction(
//       internal.actions.exchangeCodeForAccessToken,
//       { code: args.code }
//     );

//     if (!success || !token) {
//       return {
//         error: "Could not initialize Instagram connection",
//         success: false,
//       };
//     }

//     const socialAccountId = await ctx.runMutation(
//       internal.socialAccounts.insertSocialAccount,
//       {
//         fbId: fbId,
//         fbName: fbName,
//         token: token,
//       }
//     );

//     const pages = await ctx.runAction(
//       internal.facebookPages.fetchFacebookPagesForSocialAccount,
//       { socialAccountId }
//     );

//     if (pages.error) {
//       return {
//         error: "Could not get Facebook pages",
//         success: false,
//       };
//     }

//     /**
//      * Schedule the getInstagramPosts action to run right away
//      * to populate the database with the user's Instagram data
//      */
//     const jobId = await ctx.scheduler.runAfter(
//       0,
//       internal.actions.getInstagramPosts,
//       {
//         socialAccountId,
//       }
//     );

//     return { jobId, pages, socialAccountId, success: true };
//   },
// });

// export const exchangeCodeForAccessToken = internalAction({
//   args: { code: v.string() },
//   handler: async (ctx, args) => {
//     let response;
//     console.log("Exchanging code for access token:", args.code);
//     try {
//       response = await axios.get(
//         `https://graph.facebook.com/v20.0/oauth/access_token`,
//         {
//           params: {
//             client_id: process.env.FB_APP_ID,
//             client_secret: process.env.FB_APP_SECRET,
//             code: args.code,
//             redirect_uri: process.env.FB_REDIRECT_URI,
//           },
//         }
//       );
//     } catch (e) {
//       if (axios.isAxiosError(e)) {
//         console.error("Axios error:", {
//           data: e.response?.data,
//           message: e.message,
//           status: e.response?.status,
//         });
//         if (e.response?.status === 400) {
//           return {
//             error:
//               "This authorization code has expired. Please try logging in again.",
//             success: false,
//           };
//         }
//       } else {
//         console.error(
//           "Error exchanging code for access token:",
//           e instanceof Error ? e.message : String(e)
//         );
//       }
//       return {
//         error: "Error exchanging code for access token",
//         success: false,
//       };
//     }

//     const accessToken = response.data.access_token;
//     try {
//       const me = await getAxios(accessToken).get<FacebookUser>(`/me`);
//       const token = jwt.sign(
//         {
//           data: { fbId: me.data.id, fbName: me.data.name, token: accessToken },
//         } as JwtPayload,
//         process.env.JWT_SECRET!,
//         { expiresIn: "365d" }
//       );

//       return { fbId: me.data.id, fbName: me.data.name, success: true, token };
//     } catch (e) {
//       console.error(
//         "Error getting /me:",
//         e instanceof Error ? e.message : String(e)
//       );
//       return {
//         error: "Could not get user information",
//         success: false,
//       };
//     }
//   },
// });

// export const extendAccessToken = action({
//   args: { code: v.string() },
//   handler: async (ctx, args) => {
//     // Implement the logic for extending the access token
//     // For now, let's add a TODO comment
//     // TODO: Implement access token extension logic
//     console.log("Extending access token for code:", args.code);
//     return "Not implemented";
//   },
// });

// export interface FacebookUser {
//   id: string;
//   name: string;
// }

// export const getInstagramPosts = internalAction({
//   args: { socialAccountId: v.id("socialAccounts") },
//   handler: async (ctx, args) => {
//     // Get the socialAccount
//     const socialAccount = await ctx.runQuery(
//       internal.socialAccounts.getSocialAccountById,
//       { id: args.socialAccountId }
//     );
//     if (!socialAccount) {
//       return { error: "Social account not found", success: false };
//     }
//     const encryptedToken = socialAccount.token;

//     let accessToken;
//     try {
//       const decoded = jwt.verify(
//         encryptedToken,
//         process.env.JWT_SECRET!
//       ) as JwtPayload;
//       accessToken = decoded.data.token;

//       if (!accessToken) {
//         return { error: "No access token in JWT", success: false };
//       }
//     } catch (e) {
//       console.log(e);
//       return { error: "Could not verify JWT", success: false };
//     }

//     const axiosInstance = getAxios(accessToken);
//     const me = await axiosInstance.get<FacebookUser>("/me");
//     const pages = await axiosInstance.get(`/${me.data.id}/accounts`);

//     for (const page of pages.data.data) {
//       const igBusinessAccountResponse = await axiosInstance.get(
//         `/${page.id}?fields=instagram_business_account`,
//         { params: { access_token: page.access_token } }
//       );

//       const igBusinessAccountId =
//         igBusinessAccountResponse.data.instagram_business_account?.id;

//       // todo: refactor when supporting more than instagram
//       if (!igBusinessAccountId) continue;

//       const profile = await axiosInstance.get(`/${igBusinessAccountId}`, {
//         params: { fields: igProfileFields.join(",") },
//       });

//       // Save profile data
//       const convexPageId = await ctx.runMutation(
//         internal.socialAccounts.insertOrUpdateFacebookPage,
//         {
//           fbPageId: page.id,
//           instagramBusinessAccountId: igBusinessAccountId,
//           socialAccountId: args.socialAccountId,
//           ...profile.data,
//         }
//       );

//       if (!convexPageId) {
//         return { error: "Could not save page", success: false };
//       }

//       const media = await axiosInstance.get(`/${igBusinessAccountId}/media`, {
//         params: {
//           fields: [
//             "id",
//             "media_type",
//             "media_url",
//             "caption",
//             "timestamp",
//             "like_count",
//             "comments_count",
//             "impressions",
//             "reach",
//           ].join(","),
//         },
//       });

//       const currentTime = new Date().toISOString();

//       await ctx.runMutation(internal.importProgress.initializeProgress, {
//         pageId: convexPageId,
//         totalPosts: media.data.data.length,
//       });

//       // Save posts to Convex
//       for (let i = 0; i < media.data.data.length; i++) {
//         const post = media.data.data[i];
//         await ctx.runMutation(
//           internal.instagramPosts.insertOrUpdateInstagramPost,
//           {
//             caption: post.caption || "",
//             comments: post.comments_count || 0,
//             engagement: (post.like_count || 0) + (post.comments_count || 0),
//             fbPageId: page.id,
//             impressions: post.impressions,
//             likes: post.like_count || 0,
//             mediaType: post.media_type,
//             mediaUrl: post.media_url,
//             metricsLastUpdated: currentTime,
//             pageId: convexPageId,
//             postId: post.id,
//             reach: post.reach,
//             socialAccountId: args.socialAccountId,
//             timestamp: post.timestamp,
//           }
//         );

//         // Update progress
//         await ctx.runMutation(internal.importProgress.updateProgress, {
//           pageId: page.id,
//           processedPosts: i + 1,
//         });
//       }
//     }

//     return { message: "Instagram data updated successfully", success: true };
//   },
// });
// // export const getFacebookPages = action({
// //   args: { code: v.string() },
// //   handler: (ctx, args) => {
// //     // do something with `args.a` and `args.b`

// //     // optionally return a value
// //     return "success";
// //   },
// // });

// // export const getInstagramBusinessAccount = action({
// //   args: { code: v.string() },
// //   handler: (ctx, args) => {
// //     // do something with `args.a` and `args.b`

// //     // optionally return a value
// //     return "success";
// //   },
// // });

// // export const getInstagramProfile = action({
// //   args: { code: v.string() },
// //   handler: (ctx, args) => {
// //     // do something with `args.a` and `args.b`

// //     // optionally return a value
// //     return "success";
// //   },
// // });

// // export const getInstagramMedia = action({
// //   args: { code: v.string() },
// //   handler: (ctx, args) => {
// //     // do something with `args.a` and `args.b`

// //     // optionally return a value
// //     return "success";
// //   },
// // });

// // export const getInstagramInsights = action({
// //   args: { code: v.string() },
// //   handler: (ctx, args) => {
// //     // do something with `args.a` and `args.b`

// //     // optionally return a value
// //     return "success";
// //   },
// // });

// // export const getMentionedComment = action({
// //   args: { code: v.string() },
// //   handler: (ctx, args) => {
// //     // do something with `args.a` and `args.b`

// //     // optionally return a value
// //     return "success";
// //   },
// // });

// // export const getMentionedMedia = action({
// //   args: { code: v.string() },
// //   handler: (ctx, args) => {
// //     // do something with `args.a` and `args.b`

// //     // optionally return a value
// //     return "success";
// //   },
// // });

// // export const getMediaComments = action({
// //   args: { code: v.string() },
// //   handler: (ctx, args) => {
// //     // do something with `args.a` and `args.b`

// //     // optionally return a value
// //     return "success";
// //   },
// // });

// // export const getMediaInsights = action({
// //   args: { code: v.string() },
// //   handler: (ctx, args) => {
// //     // do something with `args.a` and `args.b`

// //     // optionally return a value
// //     return "success";
// //   },
// // });
