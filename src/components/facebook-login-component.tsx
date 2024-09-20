import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Id } from "convex/_generated/dataModel";
import { useAction } from "convex/react";
import { useQuery } from "convex/react";
import { Instagram } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";

import { api } from "../../convex/_generated/api";

export const FacebookLoginComponent = () => {
  const scope = "email";
  const clientId = import.meta.env.VITE_FB_APP_ID || "";
  const [searchParams, setSearchParams] = useSearchParams();
  const [isConnecting, setIsConnecting] = useState(false);
  const [sanitizedProgressCount, setSanitizedProgressCount] = useState(0);
  const [finalizingConnection, setFinalizingConnection] = useState(false);
  const [isConnected, setIsConnected] = useLocalStorage("isConnected", false);
  const [socialAccountId, setSocialAccountId, removeSocialAccountId] =
    useLocalStorage<Id<"socialAccounts"> | null>("socialAccountId", null);
  const [jobId, setJobId] = useState<Id<"_scheduled_functions"> | null>(null);

  const progress = useQuery(
    api.importProgress.queries.getProgress,
    socialAccountId
      ? { socialAccountId: socialAccountId as Id<"socialAccounts"> }
      : "skip"
  );

  const jobStatus = useQuery(
    api.importProgress.queries.getScheduledJobStatus,
    jobId ? { jobId: jobId as Id<"_scheduled_functions"> } : "skip"
  );

  useEffect(() => {
    if (jobStatus && jobStatus.status === "completed") {
      setIsConnected(true);
      setIsConnecting(false);
      setFinalizingConnection(false);
    }
  }, [jobStatus, setIsConnected]);

  useEffect(() => {
    setSanitizedProgressCount(progress?.processedPosts || 0);
  }, [progress, sanitizedProgressCount]);

  const facebookUrl = `https://www.facebook.com/${
    import.meta.env.VITE_FB_APP_VERSION
  }/dialog/oauth?client_id=${clientId}&redirect_uri=${
    import.meta.env.VITE_FB_REDIRECT_URI
  }&scope=${scope}&response_type=code&state=123456789&auth_type=rerequest&config_id=${
    import.meta.env.VITE_FB_CONFIG_ID
  }`;

  const initializeInstagramConnection = useAction(
    api.socialAccounts.actions.initializeInstagramConnection
  );

  useEffect(() => {
    setIsConnected(Boolean(socialAccountId));
  }, [setIsConnected, socialAccountId]);

  useEffect(() => {
    const handleFacebookReturn = async (code: string) => {
      setIsConnecting(true);
      setFinalizingConnection(true);
      setSearchParams({}, { replace: true }); // Clear URL params
      try {
        const response = await initializeInstagramConnection({ code });
        //todo: response should have success/error
        if (response.jobId && response.socialAccountId) {
          setJobId(response.jobId);
          setSocialAccountId(response.socialAccountId);
        } else {
          console.error("Error connecting to Instagram:", response);
          //TODO: handle gracefully
          removeSocialAccountId();
        }
      } catch (error) {
        console.error("Error connecting to Instagram:", error);
        removeSocialAccountId();
      }
    };

    const code = searchParams.get("code");

    // We have a code! But we're not connected, so let's finalize
    if (code && !isConnected && !finalizingConnection) {
      handleFacebookReturn(code);
    }
  }, [
    searchParams,
    isConnected,
    setSearchParams,
    initializeInstagramConnection,
    setSocialAccountId,
    removeSocialAccountId,
    finalizingConnection,
  ]);

  const handleConnectClick = () => {
    setIsConnecting(true);
    setTimeout(() => {
      window.location.href = facebookUrl;
    }, 1000);
  };

  const handleDialogClose = () => {
    if (!isConnecting && !finalizingConnection) {
      setIsConnecting(false);
      setFinalizingConnection(false);
      setSearchParams({}, { replace: true });
      // TODO: cancel job? throw confirmation modal?
    }
  };

  const disconnectAccount = () => {
    removeSocialAccountId();
  };

  return (
    <>
      <div className="flex">
        {isConnected ? (
          <>
            <Button onClick={disconnectAccount} variant="outline">
              Disconnect Account
            </Button>
          </>
        ) : (
          <Button onClick={handleConnectClick} variant="outline">
            Connect New Account
          </Button>
        )}
      </div>

      <Dialog
        onOpenChange={handleDialogClose}
        open={isConnecting || finalizingConnection}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {finalizingConnection
                ? "Finalizing Connection"
                : "Connecting to Instagram"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-4">
            <div>
              {progress && (
                <div className="flex flex-col items-center space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                  {progress?.status === "completed" && (
                    <>
                      <h3 className="text-2xl font-semibold">Finishing up</h3>
                      <div className="text-6xl font-bold">
                        <span>{sanitizedProgressCount}</span>
                      </div>
                      <div className="flex gap-2">
                        of {progress?.totalPosts || "lots of"} posts
                      </div>
                    </>
                  )}
                  {progress?.status !== "completed" && (
                    <>
                      <h3 className="text-2xl font-semibold">Analyzing</h3>
                      <div className="text-6xl font-bold">
                        <span>{sanitizedProgressCount}</span>
                      </div>
                      <div className="flex gap-2">
                        of {progress?.totalPosts || "lots of"} posts
                      </div>
                    </>
                  )}
                </div>
              )}
              {!progress && (
                <div className="flex items-center justify-center">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <div className="flex flex-row gap-2">
              {finalizingConnection && (
                <>
                  <Instagram /> <span>{progress?.pageName}</span>
                </>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FacebookLoginComponent;
