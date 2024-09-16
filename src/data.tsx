import { Instagram } from "lucide-react";

import cakeUrl from "./assets/cake.png";
import phoneUrl from "./assets/phone.png";
import sunsetUrl from "./assets/sunset.png";

export const socialPosts = [
  {
    account: "@travel_enthusiast",
    content: {
      caption: "Sunset at the beach #nofilter #travel #sunset",
      image: sunsetUrl,
    },
    id: "1",
    platform: "Instagram",
    postDate: "2023-10-22T09:00:00",
    scheduled: false,
    stats: {
      clicks: 150,
      comments: 300,
      engagement: 1850,
      impressions: 5000,
      likes: 1500,
      reach: 4000,
      shares: 50,
      views: 2000,
    },
    title: "Sunset at the beach #nofilter",
  },
  {
    account: "@foodie_adventures",
    content: {
      caption:
        "Delicious vegan chocolate cake recipe now on the blog! #vegan #foodie #baking",
      image: cakeUrl,
    },
    id: "2",
    platform: "Instagram",
    postDate: "2023-10-23T10:30:00",
    scheduled: false,
    stats: {
      clicks: 200,
      comments: 450,
      engagement: 2725,
      impressions: 7500,
      likes: 2200,
      reach: 6000,
      shares: 75,
      views: 3000,
    },
    title: "Delicious vegan chocolate cake recipe",
  },
  {
    account: "@tech_geek",
    content: {
      caption:
        "Unboxing the latest smartphone! Full review coming soon. #tech #unboxing #newphone",
      image: phoneUrl,
    },
    id: "3",
    platform: "Instagram",
    postDate: "2023-11-01T15:00:00",
    scheduled: true,
    stats: {
      clicks: 0,
      comments: 0,
      engagement: 0,
      impressions: 0,
      likes: 0,
      reach: 0,
      shares: 0,
      views: 0,
    },
    title: "Unboxing the latest smartphone",
  },
];

export type SocialPost = (typeof socialPosts)[number];

export const accounts = [
  {
    handle: "@travel_enthusiast",
    icon: Instagram,
    label: "Travel Enthusiast",
  },
  {
    handle: "@foodie_adventures",
    icon: Instagram,
    label: "Foodie Adventures",
  },
  {
    handle: "@tech_geek",
    icon: Instagram,
    label: "Tech Geek",
  },
];

export type Account = (typeof accounts)[number];
