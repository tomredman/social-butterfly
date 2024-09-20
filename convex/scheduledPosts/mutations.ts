import { v } from "convex/values";

import { internal } from "../_generated/api";
import { internalMutation, mutation } from "../_generated/server";

const postDataArgs = {
  content: v.string(),
  fileIds: v.array(v.id("_storage")),
  pageId: v.string(),
  scheduledTime: v.string(),
};

export const saveScheduledPost = mutation({
  args: postDataArgs,
  handler: async (ctx, args) => {
    const { content, fileIds, pageId, scheduledTime } = args;

    console.log("fileIds", fileIds);

    // Save the scheduled post to the database
    const postId = await ctx.db.insert("scheduledPosts", {
      content,
      fileIds,
      pageId,
      scheduledTime,
      status: "pending",
    });

    // Schedule the action to publish the post at the specified time
    await ctx.scheduler.runAt(
      new Date(scheduledTime),
      internal.scheduledPosts.actions.publishPost,
      { postId }
    );

    return postId;
  },
});

export const updateStatus = internalMutation({
  args: { postId: v.id("scheduledPosts"), status: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.postId, { status: args.status });
  },
});

export const triggerPublishNow = mutation({
  args: postDataArgs,
  handler: async (ctx, args) => {
    // First, create the scheduled post
    const postId = await ctx.db.insert("scheduledPosts", {
      ...args,
      status: "publishing",
    });

    // Immediately trigger the publishNow action
    await ctx.scheduler.runAfter(
      0,
      internal.scheduledPosts.actions.publishNow,
      { postId }
    );

    return postId;
  },
});
