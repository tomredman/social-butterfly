import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { addDays, addHours, addMinutes, format, nextSaturday } from "date-fns";
import {
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  PlusCircle,
  Twitter,
  X,
  Youtube,
} from "lucide-react";
import React from "react";

import FacebookLoginComponent from "./FacebookLoginComponent";

const socialAccounts = [
  {
    icon: Instagram,
    label: "@travel_enthusiast",
    network: "instagram",
    value: "instagram_travel",
  },
  {
    icon: Instagram,
    label: "@foodie_adventures",
    network: "instagram",
    value: "instagram_food",
  },
  {
    icon: Facebook,
    label: "Main Facebook Page",
    network: "facebook",
    value: "facebook_main",
  },
  {
    icon: Twitter,
    label: "@personal_twitter",
    network: "twitter",
    value: "twitter_personal",
  },
  {
    icon: Linkedin,
    label: "Business LinkedIn",
    network: "linkedin",
    value: "linkedin_business",
  },
  {
    icon: Youtube,
    label: "My YouTube Channel",
    network: "youtube",
    value: "youtube_channel",
  },
];

export function NewPostModal() {
  const [selectedDate, setSelectedDate] = React.useState<Date>(() => {
    const now = new Date();
    const randomDays = Math.floor(Math.random() * 5);
    const randomMinutes = Math.floor(Math.random() * 24 * 60);
    return addMinutes(addDays(now, randomDays), randomMinutes);
  });
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).slice(0, 10 - selectedFiles.length);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleDeleteFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const today = new Date();

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
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="social-account">Social Network Account</Label>
              <Select>
                <SelectTrigger id="social-account">
                  <SelectValue placeholder="Select an account" />
                </SelectTrigger>
                <SelectContent>
                  {socialAccounts.map((account) => (
                    <SelectItem key={account.value} value={account.value}>
                      <div className="flex items-center">
                        <account.icon className="mr-2 h-4 w-4" />
                        {account.label}
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
                placeholder="Write your post content here..."
                rows={5}
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
            <Button className="w-full" type="submit">
              Create Post
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <FacebookLoginComponent />
    </div>
  );
}
