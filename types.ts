export interface FileType {
    fileId: string;
    fileName: string;
    previewImage: string;
  }
  
  export interface ApiResponse<T> {
    data: T;
    message: string;
    status: number;
  }
  
  export interface FileArrayResponse {
    files: FileType[];
  }