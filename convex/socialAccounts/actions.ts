"use node";

import axios from "axios";
import { v } from "convex/values";
import jwt from "jsonwebtoken";

import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { action } from "../_generated/server";
import { FacebookUser } from "../types/FacebookUser";
import { JwtPayload } from "../types/JwtPayload";

export const initializeInstagramConnection = action({
  args: { code: v.string() },
  handler: async (
    ctx,
    args
  ): Promise<{
    error?: string;
    fbId?: string;
    fbName?: string;
    jobId?: Id<"_scheduled_functions">;
    pages?: any;
    socialAccountId?: Id<"socialAccounts">;
    success: boolean;
    token?: string;
  }> => {
    let response;
    console.log("Exchanging code for access token:", args.code);
    try {
      response = await axios.get(
        `https://graph.facebook.com/v20.0/oauth/access_token`,
        {
          params: {
            client_id: process.env.FB_APP_ID,
            client_secret: process.env.FB_APP_SECRET,
            code: args.code,
            redirect_uri: process.env.FB_REDIRECT_URI,
          },
        }
      );
    } catch (e) {
      if (axios.isAxiosError(e)) {
        console.error("Axios error:", {
          data: e.response?.data,
          message: e.message,
          status: e.response?.status,
        });
        if (e.response?.status === 400) {
          return {
            error:
              "This authorization code has expired. Please try logging in again.",
            success: false,
          };
        }
      } else {
        console.error(
          "Error exchanging code for access token:",
          e instanceof Error ? e.message : String(e)
        );
      }
      return {
        error: "Error exchanging code for access token",
        success: false,
      };
    }

    const accessToken = response.data.access_token;
    try {
      const me = await axios.get<FacebookUser>(
        `https://graph.facebook.com/v20.0/me`,
        {
          params: { access_token: accessToken },
        }
      );
      const token = jwt.sign(
        {
          data: { fbId: me.data.id, fbName: me.data.name, token: accessToken },
        } as JwtPayload,
        process.env.JWT_SECRET!,
        { expiresIn: "365d" }
      );

      const socialAccountId = await ctx.runMutation(
        internal.socialAccounts.mutations.insertSocialAccount,
        {
          fbId: me.data.id,
          fbName: me.data.name,
          token,
        }
      );

      const pages = await ctx.runAction(
        internal.facebookPages.actions.fetchFacebookPagesForSocialAccount,
        { socialAccountId }
      );

      if (!pages.success) {
        console.error(pages);
        return {
          error: "Could not get Facebook pages",
          success: false,
        };
      }

      /**
       * Schedule the getInstagramPosts action to run right away
       * to populate the database with the user's Instagram data
       */
      const jobId = await ctx.scheduler.runAfter(
        0,
        internal.instagramPosts.actions.getInstagramPosts,
        {
          socialAccountId,
        }
      );

      return {
        fbId: me.data.id,
        fbName: me.data.name,
        jobId,
        pages: pages,
        socialAccountId,
        success: true,
        token,
      };
    } catch (e) {
      console.error(
        "Error getting /me:",
        e instanceof Error ? e.message : String(e)
      );
      return {
        error: "Could not get user information",
        success: false,
      };
    }
  },
});
