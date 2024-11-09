"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Delete, Share, Trash } from "lucide-react";
import AxiosInstance from "@/utils/axios";
interface UserEmails {
  email: string;
}
interface FileDetails {
  fileId: string;
  downloadURL: string;
  previewImage: string;
  createdAt: string;
  createdBy: string;
  isShared: boolean;
  sharedwith: UserEmails[];
}
const sharedUsers: UserEmails[] = [
  { email: "alice@example.com" },
  { email: "bob@example.com" },
];
export default function FileDetailPage() {
  const router = useRouter();
  const pathname = usePathname();
  const id = pathname.split("/").pop(); 

  const [fileDetails, setFileDetails] = useState<FileDetails>({
  fileId: "1",
  downloadURL: "img1.jpeg",
  previewImage: "img1.jpeg",
  createdAt: "2024-11-09T10:00:00Z",
  createdBy: "Jane Doe",
  isShared: true,
  sharedwith: sharedUsers,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const sharefile = async () => {
    try {
      const token = document.cookie.split("=")[1];
      const response = await AxiosInstance.post(
        `/files/${id}/share`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert(`File shared successfully with ${email}`);
        setIsModalOpen(false);
        setEmail("");
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push("/signin");
      } else {
        console.log("Error sharing file:", error);
      }
    }
  };

  const getFileDetails = async (id: string) => {
    try {
      const token = document.cookie.split("=")[1];
      const response = await AxiosInstance.get(`/files/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setFileDetails(response.data);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push("/signin");
      } else {
        console.log("Error retrieving file details:", error);
      }
    }
  };
  const deleteFile= async (id: string) => {
    try {
      const token = document.cookie.split("=")[1];
      const response = await AxiosInstance.get(`/files/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("file deleted successfully");
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push("/signin");
      } else {
        console.log("Error retrieving file details:", error);
      }
    }
  };

  useEffect(() => {
    if (id) {
      getFileDetails(id);
    }
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="min-h-5/6 bg-sky-100 flex items-center p-8">
        {fileDetails ? (
          <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-100 aspect-square rounded-lg overflow-hidden">
              <img
                alt="File preview"
                className="w-full h-full object-cover"
                src={fileDetails.previewImage || "/img1.jpeg"}
                style={{
                  aspectRatio: "1/1",
                  objectFit: "cover",
                  height: "50em",
                  width: "40em",
                }}
              />
            </div>
            <div
              className="rounded-lg p-6 space-y-6 self-center mx-auto my-auto bg-white w-full md:w-3/5"
              style={{ height: "12em" }}
            >
              <div className="space-y-4">
                <h1 className="text-2xl font-bold">
                  {fileDetails.downloadURL.split("/").pop() || "xyz.ext"}
                </h1>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Created by: {fileDetails.createdBy || "username"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Created on:{fileDetails.createdAt || ""}
                    
                  </p>
                </div>
              </div>

              <div className="flex items-center   w-full justify-between">
                <Button
                  className="flex items-center gap-2"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Share className="h-4 w-4" />
                  Share
                </Button>
                <Trash onClick={()=>deleteFile(fileDetails.fileId)} className="hover:bg-zinc-200 hover:shadow-2xl p-1 hover:rounded-md hover:shadow-blue-200 hover:scale-105 transition-all duration-200 " size={30}/>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Shared with</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Shared Users</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <ScrollArea className="h-[200px]">
                      {fileDetails.sharedwith.map((user) => (
                        <DropdownMenuItem key={user.email} className="p-2">
                          <div className="flex items-center gap-2">
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-500">{user.email}</span>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </ScrollArea>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>

      {/* Modal for email input */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-80">
            <h2 className="text-xl font-semibold mb-4">Share File</h2>
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={sharefile}>Share</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
