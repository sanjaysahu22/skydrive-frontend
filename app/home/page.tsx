'use client';

import { Navbar } from "@/components/navbar";
import { FileCard } from "@/components/filecard";
import AxiosInstance from "@/utils/axios";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { FileType, FileArrayResponse } from "@/types";

export default function HomePage() {
  const [files, setFiles] = useState<FileType[]>([]);
  const [filter, setFilter] = useState<"shared" | "private">("shared");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const getFiles = async (filter: "shared" | "private") => {
    setIsLoading(true);
    try {
      const token = document.cookie.split('=')[1];
      if (!token) {
        router.push("/signin");
        return;
      }

      const response = await AxiosInstance.post<FileArrayResponse>(
        '/files/', 
        { filter }, 
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );

      setFiles(response.data.files);
      setIsSearching(false);
    } catch (error) {
      if (error instanceof Error) {
        const axiosError = error as { response?: { status: number } };
        if (axiosError.response?.status === 401) {
          router.push("/signin");
        } else {
          console.error("Error retrieving files:", error.message);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isSearching) {
      getFiles(filter);
    }
  }, [filter, isSearching]);

  const handleFilterChange = (newFilter: "shared" | "private") => {
    setFilter(newFilter);
    setIsSearching(false);
  };

  const handleSearchResults = (searchResults: FileType[]) => {
    setFiles(searchResults);
    setIsSearching(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        handleFilter={handleFilterChange}
        onSearchResults={handleSearchResults}
      />
      <main className="container mx-auto px-4 py-6 sm:py-8 md:py-10">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {files.map((file) => (
              <FileCard
                key={file.fileId}
                id={file.fileId}
                fileName={file.fileName}
                thumbnail={`data:image/png;base64,${file.previewImage}`}
              />
            ))}
            {!isLoading && files.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No files found</p>
                <p className="text-gray-400 text-sm mt-2">
                  {isSearching ? "Try a different search term" : "Upload some files to get started"}
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
