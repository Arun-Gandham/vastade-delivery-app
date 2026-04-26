export interface CreateImageUploadInput {
  filename: string;
  contentType: string;
  fileSize: number;
  folder?: string;
}

export interface DirectImageUploadResponse {
  key: string;
  imageUrl: string;
  uploadUrl: string;
  expiresIn: number;
  method: "PUT";
  headers: Record<string, string>;
}
