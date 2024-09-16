"use client";

import { Input } from "@/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  Facebook,
  Instagram,
  Linkedin,
  PlusCircle,
  Search,
  Settings,
  Shell,
  Twitter,
  Youtube,
} from "lucide-react";
import * as React from "react";
import { useEffect } from "react";

import { socialPosts } from "../data";
import { Nav } from "./nav";
import { NewPostModal } from "./NewPostModal";
import { PostDisplay } from "./post-display";
import { PostList } from "./post-list";

interface SocialDashboardProps {
  accounts: {
    email: string;
    icon: React.ReactNode;
    label: string;
  }[];
  defaultCollapsed?: boolean;
  defaultLayout: number[] | undefined;
  navCollapsedSize: number;
}

export function SocialDashboard({
  defaultCollapsed = false,
  defaultLayout = [20, 32, 48],
  navCollapsedSize,
}: SocialDashboardProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [selectedPostId, setSelectedPostId] = React.useState<null | string>(
    null
  );
  const [selectedPlatform, setSelectedPlatform] = React.useState("Instagram");

  const handlePostSelect = (id: string) => {
    setSelectedPostId(id);
  };

  const handlePlatformSelect = (platform: string) => {
    setSelectedPlatform(platform);
    setSelectedPostId(null);
  };

  const filteredPosts = socialPosts.filter(
    (post) => post.platform === selectedPlatform
  );

  const [socialAccountId, setSocialAccountId] = React.useState<null | string>(
    null
  );

  useEffect(() => {
    const storedSocialAccountId = localStorage.getItem("socialAccountId");
    if (storedSocialAccountId) {
      setSocialAccountId(storedSocialAccountId);
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "socialAccountId") {
        setSocialAccountId(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        className="h-full items-stretch h-[2000px]"
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout:social=${JSON.stringify(
            sizes
          )}`;
        }}
      >
        <ResizablePanel
          className={cn(
            isCollapsed &&
              "min-w-[50px] transition-all duration-300 ease-in-out min-h-screen"
          )}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          defaultSize={defaultLayout[0]}
          maxSize={20}
          minSize={15}
          onCollapse={() => {
            setIsCollapsed(true);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              true
            )}`;
          }}
          onExpand={() => {
            setIsCollapsed(false);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              false
            )}`;
          }}
        >
          <div
            className={cn(
              "flex h-[52px] items-center justify-start",
              isCollapsed ? "h-[52px]" : "px-4"
            )}
          >
            <Shell />
            <span className="font-bold pl-2 opacity-20">social butterfly</span>
          </div>
          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                icon: Instagram,
                label: "6",
                onClick: () => handlePlatformSelect("Instagram"),
                title: "Instagram",
                variant: selectedPlatform === "Instagram" ? "default" : "ghost",
              },
              {
                icon: Facebook,
                label: "3",
                onClick: () => handlePlatformSelect("Facebook"),
                title: "Facebook",
                variant: selectedPlatform === "Facebook" ? "default" : "ghost",
              },
              {
                icon: Twitter,
                label: "2",
                onClick: () => handlePlatformSelect("X"),
                title: "X",
                variant: selectedPlatform === "X" ? "default" : "ghost",
              },
              {
                icon: Linkedin,
                label: "1",
                onClick: () => handlePlatformSelect("LinkedIn"),
                title: "LinkedIn",
                variant: selectedPlatform === "LinkedIn" ? "default" : "ghost",
              },
              {
                icon: Youtube,
                label: "4",
                onClick: () => handlePlatformSelect("YouTube"),
                title: "YouTube",
                variant: selectedPlatform === "YouTube" ? "default" : "ghost",
              },
            ]}
          />
          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                icon: PlusCircle,
                label: "",
                title: "New Post",
                variant: "ghost",
              },
              {
                icon: Settings,
                label: "",
                title: "Settings",
                variant: "ghost",
              },
            ]}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <Tabs defaultValue="posts">
            <div className="flex items-center px-4 py-2">
              <NewPostModal />
            </div>
            <Separator />
            <div className="flex flex-row gap-2 bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-8" placeholder="Search posts" />
                </div>
              </form>
              <TabsList className="ml-auto">
                <TabsTrigger value="posts">All</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent className="m-0" value="posts">
              <PostList
                onSelectPost={handlePostSelect}
                selectedPostId={selectedPostId}
                socialAccountId={socialAccountId}
              />
            </TabsContent>
            <TabsContent className="m-0" value="scheduled">
              <div>Scheduled</div>
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
          <PostDisplay postId={selectedPostId} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
