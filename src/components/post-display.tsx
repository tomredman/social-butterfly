"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import { Doc, Id } from "convex/_generated/dataModel";
import { useQuery } from "convex/react";
import {
  addDays,
  addHours,
  format,
  formatDistanceToNow,
  nextSaturday,
} from "date-fns";
import {
  Archive,
  ArchiveX,
  Bookmark,
  Clock,
  Forward,
  Heart,
  MessageCircle,
  MoreVertical,
  Reply,
  ReplyAll,
  Share2,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts";

import { api } from "../../convex/_generated/api";
import { Calendar } from "./ui/calendar";
import { Card, CardContent, CardDescription, CardHeader } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface PostDisplayProps {
  postId: null | string;
}

export function PostDisplay({ postId }: PostDisplayProps) {
  const post = useQuery(
    api.instagramPosts.queries.getInstagramPostById,
    postId ? { id: postId as Id<"instagramPosts"> } : "skip"
  );

  const today = new Date();

  // Use actual metrics from the post data
  const generateMetrics = (post: Doc<"instagramPosts"> | null | undefined) => {
    if (!post) return [];
    return [
      {
        fill: "hsl(var(--chart-1))",
        label: "Comments",
        metric: "Comments",
        value: post.comments,
      },
      {
        fill: "hsl(var(--chart-2))",
        label: "Likes",
        metric: "Likes",
        value: post.likes,
      },
      {
        fill: "hsl(var(--chart-3))",
        label: "Engagement",
        metric: "Engagement",
        value: post.engagement,
      },
    ];
  };

  // Calculate Butterfly Score based on actual metrics
  const calculateButterflyScore = (
    post: Doc<"instagramPosts"> | null | undefined
  ) => {
    if (!post) return 0;
    // This is a simple example calculation, you can adjust the algorithm as needed
    const totalPossibleScore =
      (post.comments || 0) + (post.likes || 0) + (post.engagement || 0);
    const actualScore =
      (post.comments || 0) + (post.likes || 0) + (post.engagement || 0);
    return Math.round((actualScore / totalPossibleScore) * 10);
  };

  const metrics = generateMetrics(post);
  const butterflyScore = calculateButterflyScore(post);

  const chartConfig: ChartConfig = {
    comments: {
      color: "hsl(210, 100%, 80%)",
      label: "Comments",
    },
    engagement: {
      color: "hsl(210, 100%, 40%)",
      label: "Engagement",
    },
    likes: {
      color: "hsl(210, 100%, 60%)",
      label: "Likes",
    },
    value: {
      label: "Total",
    },
  };

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <div className="flex-shrink-0">
        {/* Toolbar */}
        <div className="flex items-center">
          <div className="flex items-center px-4 py-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button disabled={!post} size="icon" variant="ghost">
                  <Archive className="h-4 w-4" />
                  <span className="sr-only">Archive</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Archive</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button disabled={!post} size="icon" variant="ghost">
                  <ArchiveX className="h-4 w-4" />
                  <span className="sr-only">Move to junk</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Move to junk</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button disabled={!post} size="icon" variant="ghost">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Move to trash</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Move to trash</TooltipContent>
            </Tooltip>
            <Separator className="mx-1 h-6" orientation="vertical" />
            <Tooltip>
              <Popover>
                <PopoverTrigger asChild>
                  <TooltipTrigger asChild>
                    <Button disabled={!post} size="icon" variant="ghost">
                      <Clock className="h-4 w-4" />
                      <span className="sr-only">Snooze</span>
                    </Button>
                  </TooltipTrigger>
                </PopoverTrigger>
                <PopoverContent className="flex w-[535px] p-0">
                  <div className="flex flex-col gap-2 border-r px-2 py-4">
                    <div className="px-4 text-sm font-medium">Snooze until</div>
                    <div className="grid min-w-[250px] gap-1">
                      <Button
                        className="justify-start font-normal"
                        variant="ghost"
                      >
                        Later today{" "}
                        <span className="ml-auto text-muted-foreground">
                          {format(addHours(today, 4), "E, h:m b")}
                        </span>
                      </Button>
                      <Button
                        className="justify-start font-normal"
                        variant="ghost"
                      >
                        Tomorrow
                        <span className="ml-auto text-muted-foreground">
                          {format(addDays(today, 1), "E, h:m b")}
                        </span>
                      </Button>
                      <Button
                        className="justify-start font-normal"
                        variant="ghost"
                      >
                        This weekend
                        <span className="ml-auto text-muted-foreground">
                          {format(nextSaturday(today), "E, h:m b")}
                        </span>
                      </Button>
                      <Button
                        className="justify-start font-normal"
                        variant="ghost"
                      >
                        Next week
                        <span className="ml-auto text-muted-foreground">
                          {format(addDays(today, 7), "E, h:m b")}
                        </span>
                      </Button>
                    </div>
                  </div>
                  <div className="p-2">
                    <Calendar />
                  </div>
                </PopoverContent>
              </Popover>
              <TooltipContent>Snooze</TooltipContent>
            </Tooltip>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button disabled={!post} size="icon" variant="ghost">
                  <Reply className="h-4 w-4" />
                  <span className="sr-only">Reply</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reply</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button disabled={!post} size="icon" variant="ghost">
                  <ReplyAll className="h-4 w-4" />
                  <span className="sr-only">Reply all</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reply all</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button disabled={!post} size="icon" variant="ghost">
                  <Forward className="h-4 w-4" />
                  <span className="sr-only">Forward</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Forward</TooltipContent>
            </Tooltip>
          </div>
          <Separator className="mx-2 h-6" orientation="vertical" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button disabled={!post} size="icon" variant="ghost">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Mark as unread</DropdownMenuItem>
              <DropdownMenuItem>Star thread</DropdownMenuItem>
              <DropdownMenuItem>Add label</DropdownMenuItem>
              <DropdownMenuItem>Mute thread</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Separator />
      </div>

      {!post && (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-muted-foreground">Select a post</p>
        </div>
      )}

      {post && (
        <div className="bg-muted flex flex-col justify-start items-start overflow-y-auto p-8 gap-8">
          {/* Analytics section */}
          <Card className="w-full mx-auto">
            <CardHeader className="items-start text-lg font-semibold">
              Performance
              <CardDescription>
                {post.metricsLastUpdated
                  ? `Last updated ${formatDistanceToNow(new Date(post.metricsLastUpdated), { addSuffix: true })}`
                  : "Not available"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {metrics.map((metric) => (
                  <div className="text-center" key={metric.metric}>
                    <div className="text-2xl font-bold">
                      {metric.value?.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
              <ChartContainer
                className="min-h-[200px] w-full"
                config={chartConfig}
              >
                <BarChart accessibilityLayer data={metrics}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    axisLine={false}
                    dataKey="metric"
                    tickLine={false}
                    tickMargin={0}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={false}
                  />
                  <Bar
                    activeBar={({ ...props }) => {
                      return (
                        <Rectangle
                          {...props}
                          fillOpacity={0.8}
                          stroke={props.payload.fill}
                          strokeDasharray={4}
                          strokeDashoffset={4}
                        />
                      );
                    }}
                    dataKey="value"
                    radius={0}
                    strokeWidth={2}
                  />
                </BarChart>
              </ChartContainer>
              <div className="flex items-center mt-4">
                <div className="flex gap-2 font-medium leading-none text-sm">
                  Butterfly Score: {butterflyScore}/10
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
            </CardContent>

            <CardHeader className="items-start text-lg font-semibold">
              Content
              <CardDescription>
                Posted on{" "}
                {post.metricsLastUpdated
                  ? new Date(post.metricsLastUpdated).toLocaleString("en-US", {
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : "Not available"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex flex-col mx-auto rounded-lg border">
                <div className="flex items-center p-4">
                  <div className="ml-4">
                    <p className="text-sm font-semibold">@skaterfandom</p>
                  </div>
                </div>
                <Separator />
                <div className="overflow-hidden">
                  {post.mediaType === "IMAGE" && (
                    <img
                      alt="Post image"
                      className="w-full object-cover"
                      src={post.mediaUrl}
                      style={{ maxHeight: "400px" }}
                    />
                  )}
                  {post.mediaType === "VIDEO" && (
                    <video
                      className="w-full object-cover"
                      src={post.mediaUrl}
                      style={{ maxHeight: "400px" }}
                    />
                  )}
                  <div className="p-4">
                    <div className="flex justify-between mb-2">
                      <div className="flex space-x-4">
                        <Button size="icon" variant="ghost">
                          <Heart className="h-6 w-6" />
                        </Button>
                        <Button size="icon" variant="ghost">
                          <MessageCircle className="h-6 w-6" />
                        </Button>
                        <Button size="icon" variant="ghost">
                          <Share2 className="h-6 w-6" />
                        </Button>
                      </div>
                      <Button size="icon" variant="ghost">
                        <Bookmark className="h-6 w-6" />
                      </Button>
                    </div>
                    <p className="font-semibold mb-2">
                      {post.likes?.toLocaleString()} likes
                    </p>
                    <p>
                      <span className="font-semibold">@skaterfandom</span>{" "}
                      {post.caption}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      View all {post.comments} comments
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="p-4">
                  <textarea
                    className="w-full p-2 text-sm bg-muted rounded-md"
                    placeholder="Add a comment..."
                    rows={3}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-muted-foreground">
                      This post has been published
                    </p>
                    <Button size="sm">Edit Post</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
