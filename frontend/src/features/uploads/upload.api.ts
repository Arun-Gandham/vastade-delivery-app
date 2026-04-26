import { unwrapResponse } from "@/lib/api/api-client";
import api from "@/lib/api/api-client";

export type DirectImageUploadResponse = {
  key: string;
  imageUrl: string;
  uploadUrl: string;
  expiresIn: number;
  method: "PUT";
  headers: Record<string, string>;
};

export const uploadApi = {
  createImageUpload: (payload: {
    filename: string;
    contentType: string;
    fileSize: number;
    folder: string;
  }) => unwrapResponse<DirectImageUploadResponse>(api.post("/uploads/image", payload)),
  uploadImage: async (file: File, folder: string) => {
    const upload = await uploadApi.createImageUpload({
      filename: file.name,
      contentType: file.type,
      fileSize: file.size,
      folder,
    });

    if (!upload || !upload.uploadUrl || !upload.imageUrl || !upload.method || !upload.key) {
      throw new Error(
        "Upload API returned an invalid response. Restart the backend and verify /uploads/image is serving the new S3 signing flow."
      );
    }

    const response = await fetch(upload.uploadUrl, {
      method: upload.method,
      headers: upload.headers,
      body: file,
    });

    if (!response.ok) {
      throw new Error("Direct upload to S3 failed");
    }

    return upload;
  },
};
