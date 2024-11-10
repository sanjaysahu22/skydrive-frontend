"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Delete, Share, Trash, AlertCircle, Download } from "lucide-react";
import AxiosInstance from "@/utils/axios";
import { AxiosError } from 'axios';
import { FileType } from "@/types";
import { format } from 'date-fns';


interface FileDetails {
  fileName:string;
  fileId: string;
  downloadURL: string;
  previewImage: string;
  createdAt: string;      
  createdBy: string;
  isShared: boolean;
  sharedWith: string[];
}

export default function FileDetailPage() {
  const router = useRouter();
  const pathname = usePathname();
  const id = pathname?.split("/").pop();

  const [fileDetails, setFileDetails] = useState<FileDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const sharefile = async () => {
    if (!email || !id) return;

    setIsSharing(true);
    setError(null);

    try {
      const token = document.cookie.split("=")[1];
      if (!token) {
        router.push("/signin");
        return;
      }

      await AxiosInstance.patch(
        `/files/${id}/share`,
        { email },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      )
      setFileDetails(prev => prev ? {
        ...prev,
        sharedWith: [...prev.sharedWith, email ]
      } : null);
      
      setIsModalOpen(false);
      setEmail("");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || "Error sharing file");
    } finally {
      setIsSharing(false);
    }
  };
  const getFileDetails = async (fileId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const token = document.cookie.split('=')[1];
      if (!token) {
        router.push('/signin');
        return;
      }
      const response = await AxiosInstance.get<FileDetails>(`/files/${fileId}/preview`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setFileDetails(response.data);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response?.status === 401) {
        router.push('/signin');
      } else {
        setError(axiosError.response?.data?.message || "Error loading file details");
      }
    } finally {
      setIsLoading(false);
    }
  };
  const deleteFile = async (fileId: string) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    setIsDeleting(true);
    setError(null);
    try {
      const token = document.cookie.split("=")[1];
      if (!token) {
        router.push("/signin");
        return;
      }
      await AxiosInstance.delete(`/files/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push("/home");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || "Error deleting file");
    } finally {
      setIsDeleting(false);
    }
  };
  useEffect(() => {
    if (id) {
      getFileDetails(id);
    }
  }, [id]);
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <p className="text-gray-600">{error}</p>
          <Button onClick={() => router.push("/home")}>Return to Home</Button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        handleFilter={() => router.push("/home")}
        onSearchResults={() => router.push("/home")}
      />   
      <main className="container mx-auto px-4 py-8">
        {fileDetails && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative aspect-square bg-gray-100">
                  <Image
                    src={`data:image/png;base64,${fileDetails.previewImage}` || "/img1.jpeg"}
                    alt="File preview"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Details Section */}
                <div className="p-6 md:p-8 flex flex-col">
                  <div className="flex-grow">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                      {fileDetails.fileName || "Untitled"}
                    </h1>
                    
                    <div className="space-y-3 text-sm text-gray-600">
                      <p className="flex items-center space-x-2">
                        <span className="font-medium">Created by:</span>
                        <span>{fileDetails.createdBy}</span>
                      </p>
                      <p className="flex items-center space-x-2">
                        <span className="font-medium">Created on:</span>
                        <span>
                          {format(new Date(fileDetails.createdAt), 'PPP')}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-4">
                    <Button
                      onClick={() => setIsModalOpen(true)}
                      className="flex items-center gap-2"
                      disabled={isSharing}
                    >
                      <Share className="h-4 w-4" />
                      {isSharing ? 'Sharing...' : 'Share'}
                    </Button>
                    <Button
  onClick={async () => {
    try {
      const response = await AxiosInstance.get(fileDetails.downloadURL, {
        responseType: "blob", // This is important for downloading binary files
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileDetails.fileName); // Set filename
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download file", error);
    }
  }}
  className="flex items-center gap-2"
>
  <Download className="h-4 w-4" />
  Download
</Button>
                    <Button
                      variant="destructive"
                      onClick={() => deleteFile(fileDetails.fileId)}
                      disabled={isDeleting}
                      className="flex items-center gap-2"
                    >
                      <Trash className="h-4 w-4" />
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          Shared with ({fileDetails.sharedWith.length})
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-72" align="end">
                        <DropdownMenuLabel>Shared Users</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <ScrollArea className="h-[200px]">
  {fileDetails.sharedWith.length > 0 ? (
    fileDetails.sharedWith.map((email ) => (
      <DropdownMenuItem key={email} className="flex items-center py-2 px-4">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
          {email[0].toUpperCase()}
        </div>
        <span className="text-sm">{email}</span>
      </DropdownMenuItem>
    ))
  ) : (
    <div className="py-2 px-4 text-sm text-gray-500">No users shared with</div>
  )}
</ScrollArea>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share File</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && (
              <p className="mt-2 text-sm text-red-500">{error}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={sharefile} disabled={!email || isSharing}>
              {isSharing ? 'Sharing...' : 'Share'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}