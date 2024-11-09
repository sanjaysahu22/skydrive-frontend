import { ChevronDown, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AxiosInstance from "@/utils/axios";


interface NavbarProps {
  handleFilter?: (filter: string) => void;
}

const uploadFile = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await AxiosInstance.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    if (response.status === 201) {
      console.log("File uploaded successfully:", response.data);
      return response.data;
    }
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 401) {
        console.error("Unauthorized: User is not authenticated.");
      } else if (error.response.status === 400) {
        console.error("Bad Request: File upload failed.");
      } else {
        console.error("Error uploading file:", error.response.data);
      }
    } else {
      console.error("Error uploading file:", error.message);
    }
  }
};

export function Navbar({ handleFilter }: NavbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const handleSearch = async () => {
    try {
      const token = document.cookie.split("=")[1];
      const response = await AxiosInstance.post(`/files/search`,{query:{searchQuery}} , {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        
      }
    } catch (error) {
      console.error("Error performing search:", error);
    }
  };

  return (
    <nav className="flex items-center border-2 justify-between px-4 py-2">
      <div className="flex items-center">
        <Button variant="ghost" size="icon">
          <ChevronDown className="h-5 w-5" />
          <span className="sr-only">Logo</span>
        </Button>
      </div>
      <div className="flex-1 mx-4">
        <div className="w-full max-w-lg mx-auto flex items-center border border-gray-200 rounded-full bg-blue-100">
          <input
            className="w-full px-4 py-2 rounded-full bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search here !!"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch} className="p-2">
            <Search className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>
      {handleFilter && (
        <>
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
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleFilter("shared")}>
                shared
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilter("private")}>
                private
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleUploadClick} className="flex items-center gap-2">
                upload
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </nav>
  );
}
