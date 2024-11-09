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

const filesDummy = [
  { fileid: '1', filename: "Image 1", previewImage: "/placeholder.svg?height=200&width=200" },
  { fileid: '2', filename: "Image 2", previewImage: "/placeholder.svg?height=200&width=200" },
  { fileid: '3', filename: "Image 3", previewImage: "/placeholder.svg?height=200&width=200" },
];

export default function Page() {
  const [files, setFiles] = useState<Array<fileType>>(filesDummy);
  const [filter, setFilter] = useState<string>("shared"); // Initialize with "shared"
  const router = useRouter();
  const pathname = usePathname(); // Use usePathname to get the current path

  const getFiles = async (filter: string) => {
    try {
      let token = document.cookie.split('=')[1];
      const response = await AxiosInstance.post('/files', { filter } ,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        const { files } = response.data;
        console.log("Files retrieved successfully:", files);
        setFiles(files); // Update files state with the retrieved data
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push("/signin");
      } else {
        console.log("Error retrieving files:", error);
      }
    }
  };

  useEffect(() => {
    getFiles(filter); 
  }, [filter]);

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter); 
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar handleFilter={pathname === "/home" ? handleFilterChange : undefined} />
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {files.map((file) => (
            <FileCard key={file.fileid} id={file.fileid} fileName={file.filename} thumbnail={file.previewImage} />
          ))}
        </div>
      </main>
    </div>
  );
}
