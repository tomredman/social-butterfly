import { Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";

import { api } from "../../convex/_generated/api";

export function useConvexFileUploader() {
  const generateUploadUrl = useMutation(
    api.uploads.mutations.generateUploadUrl
  );

  const uploadFile = async (
    file: File,
    uploadUrl: string,
    onProgress: (progress: number) => void
  ): Promise<Id<"_storage">> => {
    return new Promise((resolve, reject) => {
      // Using XMLHttpRequest for file upload so that we can track progress
      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          onProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          // Parse the response to get the storageId
          const response = JSON.parse(xhr.responseText);
          resolve(response.storageId as Id<"_storage">);
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error("Upload failed"));

      xhr.open("POST", uploadUrl);
      xhr.send(file);
    });
  };

  return { generateUploadUrl, uploadFile };
}
