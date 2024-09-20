"use node";

import axios from "axios";
import { v } from "convex/values";
import jwt from "jsonwebtoken";

import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { internalAction } from "../_generated/server";
import { JwtPayload } from "../types/JwtPayload";

export const publishPost = internalAction({
  args: { postId: v.id("scheduledPosts") },
  handler: async (ctx, args) => {
    const { postId } = args;

    // Retrieve the scheduled post
    const scheduledPost = await ctx.runQuery(
      internal.scheduledPosts.queries.getScheduledPostById,
      { id: postId }
    );
    if (!scheduledPost) {
      console.error("Scheduled post not found");
      return;
    }

    // Retrieve the page information
    const page = await ctx.runQuery(
      internal.facebookPages.queries.getFacebookPageById,
      { fbPageId: scheduledPost.pageId }
    );
    if (!page) {
      console.error("Facebook page not found");
      await ctx.runMutation(internal.scheduledPosts.mutations.updateStatus, {
        postId,
        status: "failed",
        //TODO: add a reason
      });
      return;
    }

    // Retrieve the social account to get the access token
    const socialAccount = await ctx.runQuery(
      internal.socialAccounts.queries.getSocialAccountById,
      { id: page.socialAccountId }
    );
    if (!socialAccount) {
      console.error("Social account not found");
      await ctx.runMutation(internal.scheduledPosts.mutations.updateStatus, {
        postId,
        status: "failed",
      });
      return;
    }

    // Decrypt the token
    let accessToken;
    try {
      const decoded = jwt.verify(
        socialAccount.token,
        process.env.JWT_SECRET!
      ) as JwtPayload;
      accessToken = decoded.data.token;
    } catch (e) {
      console.error("Token decryption failed", e);
      await ctx.runMutation(internal.scheduledPosts.mutations.updateStatus, {
        postId,
        status: "failed",
      });
      return;
    }

    const igAccountId = page.instagramBusinessAccountId;

    // Prepare media upload
    // You need to upload media to a publicly accessible URL.
    // This example assumes `scheduledPost.files` contains URLs.

    try {
      // For each media, create a media object
      const mediaIds = [];
      for (const fileId of scheduledPost.fileIds) {
        const fileUrl = await ctx.storage.getUrl(fileId as Id<"_storage">);
        if (!fileUrl) {
          throw new Error(`File URL not found for file ID: ${fileId}`);
        }
        const mediaResponse = await axios.post(
          `https://graph.facebook.com/v20.0/${igAccountId}/media`,
          null,
          {
            params: {
              access_token: accessToken,
              caption: scheduledPost.content,
              image_url: fileUrl,
            },
          }
        );
        mediaIds.push(mediaResponse.data.id);
      }

      // If multiple media, create a carousel post
      let creationId;
      if (mediaIds.length > 1) {
        const carouselResponse = await axios.post(
          `https://graph.facebook.com/v20.0/${igAccountId}/media`,
          null,
          {
            params: {
              access_token: accessToken,
              caption: scheduledPost.content,
              children: mediaIds,
              media_type: "CAROUSEL",
            },
          }
        );
        creationId = carouselResponse.data.id;
      } else {
        creationId = mediaIds[0];
      }

      // Publish the media
      // TODO: listen for the response and update the status
      await axios.post(
        `https://graph.facebook.com/v20.0/${igAccountId}/media_publish`,
        null,
        {
          params: {
            access_token: accessToken,
            creation_id: creationId,
          },
        }
      );

      // Update the scheduled post status
      await ctx.runMutation(internal.scheduledPosts.mutations.updateStatus, {
        postId,
        status: "posted",
      });
    } catch (error) {
      console.error("Error publishing post:", error);
      await ctx.runMutation(internal.scheduledPosts.mutations.updateStatus, {
        postId,
        status: "failed",
      });
    }
  },
});

export const publishNow = internalAction({
  args: { postId: v.id("scheduledPosts") },
  handler: async (ctx, args) => {
    const { postId } = args;

    // Update the status to "publishing"
    await ctx.runMutation(internal.scheduledPosts.mutations.updateStatus, {
      postId,
      status: "publishing",
    });

    try {
      // Retrieve the scheduled post
      const scheduledPost = await ctx.runQuery(
        internal.scheduledPosts.queries.getScheduledPostById,
        { id: postId }
      );
      if (!scheduledPost) {
        throw new Error("Scheduled post not found");
      }

      // Retrieve the page information
      const page = await ctx.runQuery(
        internal.facebookPages.queries.getFacebookPageById,
        { fbPageId: scheduledPost.pageId }
      );
      if (!page) {
        throw new Error("Facebook page not found");
      }

      // Retrieve the social account to get the access token
      const socialAccount = await ctx.runQuery(
        internal.socialAccounts.queries.getSocialAccountById,
        { id: page.socialAccountId }
      );
      if (!socialAccount) {
        throw new Error("Social account not found");
      }

      // Decrypt the token
      let accessToken;
      try {
        const decoded = jwt.verify(
          socialAccount.token,
          process.env.JWT_SECRET!
        ) as JwtPayload;
        accessToken = decoded.data.token;
      } catch (e) {
        console.error("Token decryption failed", e);
        throw new Error("Token decryption failed");
      }

      const igAccountId = page.instagramBusinessAccountId;

      // Prepare media upload
      const mediaIds = [];
      for (const fileId of scheduledPost.fileIds) {
        const fileUrl = await ctx.storage.getUrl(fileId as Id<"_storage">);
        if (!fileUrl) {
          throw new Error(`File URL not found for file ID: ${fileId}`);
        }
        const mediaResponse = await axios.post(
          `https://graph.facebook.com/v20.0/${igAccountId}/media`,
          null,
          {
            params: {
              access_token: accessToken,
              caption: scheduledPost.content,
              image_url: fileUrl,
            },
          }
        );
        mediaIds.push(mediaResponse.data.id);
      }

      // If multiple media, create a carousel post
      let creationId;
      if (mediaIds.length > 1) {
        const carouselResponse = await axios.post(
          `https://graph.facebook.com/v20.0/${igAccountId}/media`,
          null,
          {
            params: {
              access_token: accessToken,
              caption: scheduledPost.content,
              children: mediaIds,
              media_type: "CAROUSEL",
            },
          }
        );
        creationId = carouselResponse.data.id;
      } else {
        creationId = mediaIds[0];
      }

      // Publish the media
      await axios.post(
        `https://graph.facebook.com/v20.0/${igAccountId}/media_publish`,
        null,
        {
          params: {
            access_token: accessToken,
            creation_id: creationId,
          },
        }
      );

      // Update the scheduled post status to "posted"
      await ctx.runMutation(internal.scheduledPosts.mutations.updateStatus, {
        postId,
        status: "posted",
      });
    } catch (error) {
      console.error("Error publishing post:", error);
      // Update the status to "failed" if there's an error
      await ctx.runMutation(internal.scheduledPosts.mutations.updateStatus, {
        postId,
        status: "failed",
      });
    }
  },
});
