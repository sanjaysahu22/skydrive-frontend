import {  Cloud, Menu, Search} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AxiosInstance from "@/utils/axios";
import { FileType } from "@/types";

interface NavbarProps {
  handleFilter: (filter: "shared" | "private") => void;
  onSearchResults: (results: FileType[]) => void;
}

interface UploadResponse {
  message: string;
  file: FileType;
}

const uploadFile = async (file: File): Promise<UploadResponse | undefined> => {
  try {
    const token = document.cookie.split('=')[1];
    const formData = new FormData();
    formData.append('file', file);
    const response = await AxiosInstance.post<UploadResponse>('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data' ,
        Authorization: `Bearer ${token}`  ,
         
      },  withCredentials: true
    });
    
    if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    if (error instanceof Error) {
      const axiosError = error as { response?: { status: number; data?: { message: string } } };
      if (axiosError.response?.status === 401) {
        throw new Error("Unauthorized: User is not authenticated.");
      } else if (axiosError.response?.status === 400) {
        throw new Error("Bad Request: File upload failed.");
      } else {
        throw new Error(axiosError.response?.data?.message || "Error uploading file");
      }
    }
    throw error;
  }
};

export function Navbar({ handleFilter, onSearchResults }: NavbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        await uploadFile(file);
        // Refresh the file list after successful upload
        handleFilter("private");
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
        }
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const token = document.cookie.split("=")[1];
      const response = await AxiosInstance.post<{ files: FileType[] }>(
        `/files/search`,
        { query: searchQuery },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.status === 200) {
        onSearchResults(response.data.files);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error performing search:", error.message);
      }
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16 sm:h-20">
        
        {/* Logo */}
        <div className="font-bold flex gap-1 text-xl text-blue-600"><Cloud size={30} />SkyDrive     </div>
  
        <div className="flex-1 mx-4">
          <div className="relative max-w-lg mx-auto">
            <input
              className="w-full px-4 py-2 rounded-full bg-blue-50 border border-blue-100
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       transition-all duration-200 placeholder:text-gray-400"
              placeholder="Search files..."
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2
                       hover:bg-blue-100 rounded-full transition-colors duration-200"
            >
              <Search className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
  
        <div className="flex items-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="*/*"
          />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleFilter("shared")} className="cursor-pointer">
                Shared Files
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilter("private")} className="cursor-pointer">
                Private Files
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleUploadClick} 
                className="cursor-pointer flex items-center gap-2"
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload File'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        </div>
    </div>
  </nav>
  );
}