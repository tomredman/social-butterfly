// import { v } from "convex/values";

// import { internalMutation, query } from "./_generated/server";

// export const initializeProgress = internalMutation({
//   args: { pageId: v.id("facebookPages"), totalPosts: v.number() },
//   handler: async (ctx, args) => {
//     await ctx.db.insert("importProgress", {
//       lastUpdated: new Date().toISOString(),
//       pageId: args.pageId,
//       processedPosts: 0,
//       status: "in_progress",
//       totalPosts: args.totalPosts,
//     });
//   },
// });

// export const updateProgress = internalMutation({
//   args: { pageId: v.id("facebookPages"), processedPosts: v.number() },
//   handler: async (ctx, args) => {
//     const progress = await ctx.db
//       .query("importProgress")
//       .withIndex("by_pageId", (q) => q.eq("pageId", args.pageId))
//       .first();

//     if (progress) {
//       console.log("Processed, total", args.processedPosts, progress.totalPosts);

//       await ctx.db.patch(progress._id, {
//         lastUpdated: new Date().toISOString(),
//         processedPosts: args.processedPosts,
//         status:
//           args.processedPosts === progress.totalPosts
//             ? "completed"
//             : "in_progress",
//       });
//     }
//   },
// });

// export const getProgress = query({
//   args: { pageId: v.id("facebookPages") },
//   handler: async (ctx, args) => {
//     return await ctx.db
//       .query("importProgress")
//       .withIndex("by_pageId", (q) => q.eq("pageId", args.pageId))
//       .first();
//   },
// });

// export const getScheduledJobStatus = query({
//   args: { jobId: v.id("_scheduled_functions") },
//   handler: async (ctx, args) => {
//     const scheduledJob = await ctx.db.system.get(args.jobId);

//     if (!scheduledJob) {
//       return { status: "not_found" };
//     }

//     if (scheduledJob.completedTime) {
//       return {
//         completedTime: scheduledJob.completedTime,
//         state: scheduledJob.state,
//         status: "completed",
//       };
//     }

//     return {
//       scheduledTime: scheduledJob.scheduledTime,
//       status: "pending",
//     };
//   },
// });
