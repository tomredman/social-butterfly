import { cn } from "@/lib/utils";
import { Id } from "convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { Bar, BarChart } from "recharts";
import { useLocalStorage } from "usehooks-ts";

import { api } from "../../convex/_generated/api";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";

export function PostList({
  onSelectPost,
  selectedPostId,
}: {
  onSelectPost: (id: string) => void;
  selectedPostId: null | string;
}) {
  const [socialAccountId] = useLocalStorage("socialAccountId", null);

  const instagramPosts = useQuery(
    api.instagramPosts.queries.getInstagramPostsBySocialAccountId,
    socialAccountId
      ? { socialAccountId: socialAccountId as Id<"socialAccounts"> }
      : "skip"
  );

  if (!socialAccountId) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Please connect your Instagram account.
      </div>
    );
  }

  if (!instagramPosts) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Loading posts...
      </div>
    );
  }

  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {instagramPosts.map((post) => (
          <button
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent relative",
              selectedPostId === post._id && "bg-muted"
            )}
            key={post._id}
            onClick={() => onSelectPost(post._id)}
          >
            {/* Render post content */}
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">
                    {post.caption?.split("\n")[0] || "No caption"}
                  </div>
                </div>
                <div
                  className={cn(
                    "ml-auto text-xs",
                    selectedPostId === post._id
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {formatDistanceToNow(new Date(post.timestamp), {
                    addSuffix: true,
                  })}
                </div>
              </div>
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
              {post.caption || "No caption"}
            </div>
            <div className="flex items-center justify-between w-full">
              <Badge variant="secondary">Instagram</Badge>
              <MiniAnalytics post={post} />
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}

function MiniAnalytics({ post }: { post: any }) {
  const data = [
    {
      fill: "hsl(210, 100%, 80%)",
      name: "Comments",
      value: post.comments > 0 ? post.comments : 2,
    },
    {
      fill: "hsl(210, 100%, 60%)",
      name: "Likes",
      value: post.likes > 0 ? post.likes : 2,
    },
    {
      fill: "hsl(210, 100%, 40%)",
      name: "Engagement",
      value: post.engagement > 0 ? post.engagement : 2,
    },
  ];

  return (
    <BarChart data={data} height={32} width={64}>
      <Bar dataKey="value" />
    </BarChart>
  );
}
