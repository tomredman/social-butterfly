/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as facebookPages_actions from "../facebookPages/actions.js";
import type * as facebookPages_mutations from "../facebookPages/mutations.js";
import type * as facebookPages_queries from "../facebookPages/queries.js";
import type * as importProgress_mutations from "../importProgress/mutations.js";
import type * as importProgress_queries from "../importProgress/queries.js";
import type * as instagramPosts_actions from "../instagramPosts/actions.js";
import type * as instagramPosts_mutations from "../instagramPosts/mutations.js";
import type * as instagramPosts_queries from "../instagramPosts/queries.js";
import type * as scheduledPosts_actions from "../scheduledPosts/actions.js";
import type * as scheduledPosts_mutations from "../scheduledPosts/mutations.js";
import type * as scheduledPosts_queries from "../scheduledPosts/queries.js";
import type * as socialAccounts_actions from "../socialAccounts/actions.js";
import type * as socialAccounts_mutations from "../socialAccounts/mutations.js";
import type * as socialAccounts_queries from "../socialAccounts/queries.js";
import type * as types_FacebookUser from "../types/FacebookUser.js";
import type * as types_JwtPayload from "../types/JwtPayload.js";
import type * as uploads_mutations from "../uploads/mutations.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "facebookPages/actions": typeof facebookPages_actions;
  "facebookPages/mutations": typeof facebookPages_mutations;
  "facebookPages/queries": typeof facebookPages_queries;
  "importProgress/mutations": typeof importProgress_mutations;
  "importProgress/queries": typeof importProgress_queries;
  "instagramPosts/actions": typeof instagramPosts_actions;
  "instagramPosts/mutations": typeof instagramPosts_mutations;
  "instagramPosts/queries": typeof instagramPosts_queries;
  "scheduledPosts/actions": typeof scheduledPosts_actions;
  "scheduledPosts/mutations": typeof scheduledPosts_mutations;
  "scheduledPosts/queries": typeof scheduledPosts_queries;
  "socialAccounts/actions": typeof socialAccounts_actions;
  "socialAccounts/mutations": typeof socialAccounts_mutations;
  "socialAccounts/queries": typeof socialAccounts_queries;
  "types/FacebookUser": typeof types_FacebookUser;
  "types/JwtPayload": typeof types_JwtPayload;
  "uploads/mutations": typeof uploads_mutations;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
