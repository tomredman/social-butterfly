import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema(
  {
    facebookPages: defineTable({
      biography: v.optional(v.string()),
      fbPageId: v.string(),
      followers_count: v.optional(v.number()),
      follows_count: v.optional(v.number()),
      id: v.string(),
      ig_id: v.optional(v.number()),
      instagramBusinessAccountId: v.optional(v.string()),
      media_count: v.optional(v.number()),
      name: v.string(),
      network: v.string(),
      profile_picture_url: v.optional(v.string()),
      socialAccountId: v.id("socialAccounts"),
      username: v.optional(v.string()),
      website: v.optional(v.string()),
    })
      .index("by_socialAccountId", ["socialAccountId"])
      .index("by_fbPageId", ["fbPageId"]),
    importProgress: defineTable({
      lastUpdated: v.string(),
      pageName: v.string(),
      processedPosts: v.number(),
      socialAccountId: v.id("socialAccounts"),
      status: v.string(),
      totalPosts: v.number(),
    }).index("by_socialAccountId", ["socialAccountId"]),
    instagramPosts: defineTable({
      caption: v.optional(v.string()),
      comments: v.optional(v.number()),
      engagement: v.optional(v.number()),
      fbPageId: v.string(),
      impressions: v.optional(v.number()),
      likes: v.optional(v.number()),
      mediaType: v.optional(v.string()),
      mediaUrl: v.optional(v.string()),
      metricsLastUpdated: v.optional(v.string()),
      pageId: v.id("facebookPages"),
      postId: v.string(),
      reach: v.optional(v.number()),
      socialAccountId: v.id("socialAccounts"),
      timestamp: v.string(),
    })
      .index("by_socialAccountId", ["socialAccountId"])
      .index("by_pageId", ["pageId"])
      .index("by_fbPageId", ["fbPageId"]),
    socialAccounts: defineTable({
      fbId: v.string(),
      fbName: v.string(),
      token: v.string(),
    }),
  },
  {
    schemaValidation: false,
  }
);
