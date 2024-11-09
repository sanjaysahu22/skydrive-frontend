'use client';

import { Navbar } from "@/components/navbar";
import { FileCard } from "@/components/filecard";
import AxiosInstance from "@/utils/axios";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from 'next/navigation';


interface fileType {
  fileid: string;
  filename: string;
  previewImage: string;
}
interface filearray {
  files: fileType[];
}



export default function Page() {
  const [files, setFiles] = useState<fileType[]>([]);
  const [filter, setFilter] = useState<string>("shared"); 
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); 

  const getFiles = async (filter: string) => {
    try {
      const token = document.cookie.split('=')[1];
      const response = await AxiosInstance.post('/files', { filter }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },withCredentials:true
      }, );
      if (response.status === 200) {
        const { files } = response.data as filearray;
        console.log("Files retrieved successfully:", files);
        setFiles(files); 
        setIsSearching(false);
      }
    } catch (error:any) {
     
      if (error.response?.status === 401) {
        router.push("/signin");
      } else {
        console.error("Error retrieving files:", error);
      }
    }
  };

  useEffect(() => {
    if (!isSearching) {
      getFiles(filter);
    }
  }, [filter, isSearching]);

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter); 
    setIsSearching(false);
  };

  const handleSearchResults = (searchResults: fileType[]) => {
    setFiles(searchResults);
    setIsSearching(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        handleFilter={pathname === "/home" ? handleFilterChange : undefined}
        onSearchResults={handleSearchResults}
      />
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {files.map((file) => (
            <FileCard
              key={file.fileid}
              id={file.fileid}
              fileName={file.filename}
              thumbnail={file.previewImage}
            />
          ))}
          {files.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              No files found
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
