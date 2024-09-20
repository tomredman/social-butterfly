import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useConvexFileUploader } from "@/hooks/use-convex-file-uploader";
import { Id } from "convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { addDays, addHours, addMinutes, format, nextSaturday } from "date-fns";
import { Clock, Instagram, PlusCircle, X } from "lucide-react";
import React from "react";
import { useLocalStorage } from "usehooks-ts";

import { api } from "../../convex/_generated/api";
import FacebookLoginComponent from "./facebook-login-component";

export function NewPostModal() {
  const [selectedDate, setSelectedDate] = React.useState<Date>(() => {
    const now = new Date();
    const randomDays = Math.floor(Math.random() * 5);
    const randomMinutes = Math.floor(Math.random() * 24 * 60);
    return addMinutes(addDays(now, randomDays), randomMinutes);
  });
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [selectedPage, setSelectedPage] = React.useState<string | undefined>();
  const [content, setContent] = React.useState("");
  const [uploadProgress, setUploadProgress] = React.useState<
    Record<string, number>
  >({});
  const [uploadedFileIds, setUploadedFileIds] = React.useState<
    Id<"_storage">[]
  >([]);
  const { generateUploadUrl, uploadFile } = useConvexFileUploader();

  const saveScheduledPost = useMutation(
    api.scheduledPosts.mutations.saveScheduledPost
  );
  const triggerPublishNow = useMutation(
    api.scheduledPosts.mutations.triggerPublishNow
  );

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).slice(0, 10 - selectedFiles.length);
      setSelectedFiles((prev) => [...prev, ...newFiles]);

      for (const file of newFiles) {
        const uploadUrl = await generateUploadUrl();
        if (uploadUrl) {
          try {
            const fileId = await uploadFile(file, uploadUrl, (progress) => {
              setUploadProgress((prev) => ({ ...prev, [file.name]: progress }));
            });
            setUploadedFileIds((prev) => [...prev, fileId]);
          } catch (error) {
            console.error("File upload failed:", error);
            // Handle the error (e.g., show a message to the user)
          }
        }
      }
    }
  };

  const handleDeleteFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setUploadedFileIds((prev) => prev.filter((_, i) => i !== index));
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[selectedFiles[index].name];
      return newProgress;
    });
  };

  const today = new Date();

  // Retrieve the current socialAccountId from localStorage
  const [socialAccountId] = useLocalStorage<Id<"socialAccounts"> | null>(
    "socialAccountId",
    null
  );

  // Fetch associated facebookPages using the socialAccountId
  const facebookPages = useQuery(
    api.facebookPages.queries.getFacebookPagesBySocialAccountId,
    socialAccountId ? { socialAccountId } : "skip"
  );

  // Handle loading state
  if (facebookPages === undefined) {
    return <div>Loading accounts...</div>;
  }

  // Handle case with no pages
  if (facebookPages.length === 0) {
    return <div>No connected Facebook Pages found.</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createPost(false);
  };

  const handlePublishNow = async () => {
    await createPost(true);
  };

  const createPost = async (publishNow: boolean) => {
    if (!selectedPage) {
      alert("Please select a social account.");
      return;
    }

    // Wait for all files to finish uploading
    const allFilesUploaded = selectedFiles.every(
      (file) => uploadProgress[file.name] === 100
    );
    if (!allFilesUploaded) {
      alert("Please wait for all files to finish uploading.");
      return;
    }

    const postData = {
      content,
      fileIds: uploadedFileIds,
      pageId: selectedPage,
      scheduledTime: selectedDate.toISOString(),
    };

    try {
      if (publishNow) {
        await triggerPublishNow(postData);
      } else {
        await saveScheduledPost(postData);
      }
      // Reset form or provide feedback to the user
      // ... (implement form reset and user feedback)
    } catch (error) {
      console.error("Error creating post:", error);
      // Handle the error (e.g., show an error message to the user)
    }
  };

  return (
    <div className="flex flex-row w-full justify-between">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">New Post</Button>
        </DialogTrigger>
        <DialogContent className="max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="social-account">Social Network Account</Label>
              <Select onValueChange={setSelectedPage}>
                <SelectTrigger id="social-account">
                  <SelectValue placeholder="Select an account" />
                </SelectTrigger>
                <SelectContent>
                  {facebookPages.map((page) => (
                    <SelectItem key={page.fbPageId} value={page.fbPageId}>
                      <div className="flex flex-row items-center">
                        <Instagram className="mr-2 h-4 w-4" />
                        {page.username || page.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post content here..."
                rows={5}
                value={content}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file-upload">Upload Images/Videos (Max 10)</Label>
              <div className="flex flex-wrap gap-2">
                <label
                  className="w-16 h-16 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                  htmlFor="file-upload"
                >
                  <PlusCircle className="h-6 w-6 text-gray-400" />
                  <Input
                    accept="image/*,video/*"
                    className="hidden"
                    disabled={selectedFiles.length >= 10}
                    id="file-upload"
                    multiple
                    onChange={handleFileChange}
                    type="file"
                  />
                </label>
                {selectedFiles.map((file, index) => (
                  <div className="relative group w-16 h-16" key={index}>
                    <div className="w-16 h-16 rounded-md overflow-hidden">
                      {file.type.startsWith("image/") ? (
                        <img
                          alt={`Preview ${index}`}
                          className="w-full h-full object-cover"
                          src={URL.createObjectURL(file)}
                        />
                      ) : (
                        <video
                          className="w-full h-full object-cover"
                          src={URL.createObjectURL(file)}
                        />
                      )}
                    </div>
                    <button
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteFile(index)}
                      type="button"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                {selectedFiles.length}/10 files selected
              </p>
            </div>
            <div className="space-y-2">
              <Label>Schedule Post</Label>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{format(selectedDate, "PPP 'at' p")}</span>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Change schedule</Button>
                </PopoverTrigger>
                <PopoverContent className="flex w-[535px] p-0">
                  <div className="flex flex-col gap-2 border-r px-2 py-4">
                    <div className="px-4 text-sm font-medium">Schedule for</div>
                    <div className="grid min-w-[250px] gap-1">
                      <Button
                        className="justify-start font-normal"
                        onClick={() => setSelectedDate(addHours(today, 4))}
                        variant="ghost"
                      >
                        Later today{" "}
                        <span className="ml-auto text-muted-foreground">
                          {format(addHours(today, 4), "E, h:m b")}
                        </span>
                      </Button>
                      <Button
                        className="justify-start font-normal"
                        onClick={() => setSelectedDate(addDays(today, 1))}
                        variant="ghost"
                      >
                        Tomorrow
                        <span className="ml-auto text-muted-foreground">
                          {format(addDays(today, 1), "E, h:m b")}
                        </span>
                      </Button>
                      <Button
                        className="justify-start font-normal"
                        onClick={() => setSelectedDate(nextSaturday(today))}
                        variant="ghost"
                      >
                        This weekend
                        <span className="ml-auto text-muted-foreground">
                          {format(nextSaturday(today), "E, h:m b")}
                        </span>
                      </Button>
                      <Button
                        className="justify-start font-normal"
                        onClick={() => setSelectedDate(addDays(today, 7))}
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
                    <Calendar
                      mode="single"
                      onSelect={(date) => date && setSelectedDate(date)}
                      selected={selectedDate}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex justify-between">
              <Button className="w-1/2 mr-2" type="submit">
                Schedule Post
              </Button>
              <Button
                className="w-1/2 ml-2"
                onClick={handlePublishNow}
                type="button"
              >
                Publish Now
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <FacebookLoginComponent />
    </div>
  );
}
