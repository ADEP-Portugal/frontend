import { ApiService } from "./api.service";

export class FileService extends ApiService<unknown> {
  constructor() {
    super("/files");
  }

  async upload(formData: FormData): Promise<string> {
    const response = await this.api.post<{ message: string }>(
      `${this.endpoint}/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    return response.data.message;
  }

  async download(fileName: string): Promise<Blob> {
    const response = await this.api.get(
      `${this.endpoint}/download/${fileName}`,
      {
        responseType: "blob",
        withCredentials: true,
      }
    );
    return response.data;
  }
}
