"use node";

import axios from "axios";
import { v } from "convex/values";
import jwt from "jsonwebtoken";

import { api, internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { internalAction } from "../_generated/server";
import { igProfileFields } from "../instagramPosts/actions";
import { FacebookUser } from "../types/FacebookUser";
import { JwtPayload } from "../types/JwtPayload";

const getAxios = (accessToken: string) => {
  return axios.create({
    baseURL: "https://graph.facebook.com/v20.0/",
    params: {
      access_token: accessToken,
    },
  });
};

interface FacebookPagesResponse {
  error?: string;
  fbId?: string;
  fbName?: string;
  jobId?: Id<"_scheduled_functions">;
  pages?: [string];
  socialAccountId?: Id<"socialAccounts">;
  success: boolean;
  token?: string;
}
export const fetchFacebookPagesForSocialAccount = internalAction({
  args: { socialAccountId: v.id("socialAccounts") },
  handler: async (ctx, args): Promise<FacebookPagesResponse> => {
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
    }

    await ctx.runQuery(
      api.facebookPages.queries.getFacebookPagesBySocialAccountId,
      { socialAccountId: args.socialAccountId }
    );

    const pageNames = pages.data.data.map((page: any) => page.name);

    return { pages: pageNames, success: true };
  },
});
