"use node";

import axios from "axios";
import { v } from "convex/values";
import jwt from "jsonwebtoken";

import { internal } from "../_generated/api";
import { internalAction } from "../_generated/server";
import { FacebookUser } from "../types/FacebookUser";
import { JwtPayload } from "../types/JwtPayload";

export const igProfileFields: string[] = [
  "id",
  "name",
  "ig_id",
  "website",
  "username",
  "biography",
  "media_count",
  "follows_count",
  "followers_count",
  "profile_picture_url",
];

const getAxios = (accessToken: string) => {
  return axios.create({
    baseURL: "https://graph.facebook.com/v20.0/",
    params: {
      access_token: accessToken,
    },
  });
};

export const getInstagramPosts = internalAction({
  args: { socialAccountId: v.id("socialAccounts") },
  handler: async (ctx, args) => {
    // Get the socialAccount
    const socialAccount = await ctx.runQuery(
      internal.socialAccounts.queries.getSocialAccountById,
      { id: args.socialAccountId }
    );
    if (!socialAccount) {
      return { error: "Social account not found", success: false };
    }
    const encryptedToken = socialAccount.token;

    let accessToken;
    try {
      const decoded = jwt.verify(
        encryptedToken,
        process.env.JWT_SECRET!
      ) as JwtPayload;
      accessToken = decoded.data.token;

      if (!accessToken) {
        return { error: "No access token in JWT", success: false };
      }
    } catch (e) {
      console.log(e);
      return { error: "Could not verify JWT", success: false };
    }

    const axiosInstance = getAxios(accessToken);
    const me = await axiosInstance.get<FacebookUser>("/me");
    const pages = await axiosInstance.get(`/${me.data.id}/accounts`);

    for (const page of pages.data.data) {
      const igBusinessAccountResponse = await axiosInstance.get(
        `/${page.id}?fields=instagram_business_account`,
        { params: { access_token: page.access_token } }
      );

      const igBusinessAccountId =
        igBusinessAccountResponse.data.instagram_business_account?.id;

      // todo: refactor when supporting more than instagram
      if (!igBusinessAccountId) continue;

      const profile = await axiosInstance.get(`/${igBusinessAccountId}`, {
        params: { fields: igProfileFields.join(",") },
      });

      /** Profile data:
        {
          "id": "17841457223850876",
          "name": "Skater Fandom ⛸",
          "ig_id": 57287011461,
          "website": "https://lessonsinvoicing.com/download",
          "username": "skaterfandom",
          "media_count": 24,
          "follows_count": 32,
          "followers_count": 130,
          "profile_picture_url": "https://scontent.fyzd1-2.fna.fbcdn.net/v/t51.2885-15/324062060_6170456072978994_8355588202780315506_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=7d201b&_nc_ohc=bA9VBrakkcgQ7kNvgHfxdG3&_nc_ht=scontent.fyzd1-2.fna&edm=AL-3X8kEAAAA&oh=00_AYAO27TMqegaqlpJO3LprG_-PW19bKUBnOdNOBNOwgZg5Q&oe=66EA3D3B"
        }
       */

      // Save profile data
      const convexPageId = await ctx.runMutation(
        internal.facebookPages.mutations.insertOrUpdateFacebookPage,
        {
          fbPageId: page.id,
          instagramBusinessAccountId: igBusinessAccountId,
          network: "instagram",
          socialAccountId: args.socialAccountId,
          ...profile.data,
        }
      );

      if (!convexPageId) {
        return { error: "Could not save page", success: false };
      }

      const media = await axiosInstance.get(`/${igBusinessAccountId}/media`, {
        params: {
          fields: [
            "id",
            "media_type",
            "media_url",
            "caption",
            "timestamp",
            "like_count",
            "comments_count",
            "impressions",
            "reach",
          ].join(","),
        },
      });

      const currentTime = new Date().toISOString();

      await ctx.runMutation(
        internal.importProgress.mutations.initializeProgress,
        {
          pageName: page.name,
          socialAccountId: args.socialAccountId,
          totalPosts: media.data.data.length,
        }
      );

      /** Media data:
        {
          "id": "17841457223850876",
          "media_type": "IMAGE",
          "media_url": "https://scontent.fyzd1-2.fna.fbcdn.net/v/t51.2885-15/324062060_6170456072978994_8355588202780315506_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=7d201b&_nc_ohc=bA9VBrakkcgQ7kNvgHfxdG3&_nc_ht=scontent.fyzd1-2.fna&edm=AL-3X8kEAAAA&oh=00_AYAO27TMqegaqlpJO3LprG_-PW19bKUBnOdNOBNOwgZg5Q&oe=66EA3D3B",
          "caption": "🛹🛹🛹",
          "timestamp": "2024-07-23T14:00:00+0000",
          "like_count": 10,
       */

      // Save posts to Convex
      for (let i = 0; i < media.data.data.length; i++) {
        const post = media.data.data[i];
        await ctx.runMutation(
          internal.instagramPosts.mutations.insertOrUpdateInstagramPost,
          {
            caption: post.caption || "",
            comments: post.comments_count || 0,
            engagement: (post.like_count || 0) + (post.comments_count || 0),
            fbPageId: page.id,
            impressions: post.impressions,
            likes: post.like_count || 0,
            mediaType: post.media_type,
            mediaUrl: post.media_url,
            metricsLastUpdated: currentTime,
            pageId: convexPageId,
            postId: post.id,
            reach: post.reach,
            socialAccountId: args.socialAccountId,
            timestamp: post.timestamp,
          }
        );

        // Update progress
        await ctx.runMutation(
          internal.importProgress.mutations.updateProgress,
          {
            processedPosts: i + 1,
            socialAccountId: args.socialAccountId,
          }
        );
      }
    }

    await ctx.runMutation(internal.importProgress.mutations.completeProgress, {
      socialAccountId: args.socialAccountId,
    });

    return { message: "Instagram data updated successfully", success: true };
  },
});
