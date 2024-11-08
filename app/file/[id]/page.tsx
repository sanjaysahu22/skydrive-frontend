"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Share } from "lucide-react";

interface FileDetailPageProps {
  params: {
    id: string;
  };
}

const sharedUsers = [
  { id: 1, name: "Alice Smith", email: "alice@example.com", avatar: "/placeholder.svg" },
  { id: 2, name: "Bob Johnson", email: "bob@example.com", avatar: "/placeholder.svg" },
  { id: 3, name: "Carol Williams", email: "carol@example.com", avatar: "/placeholder.svg" },
  { id: 4, name: "David Brown", email: "david@example.com", avatar: "/placeholder.svg" },
];

export default function FileDetailPage({ params }: FileDetailPageProps) {
  const router = useRouter();
  const [fileId, setFileId] = useState<string | null>(null);
  const [fileDetails, setFileDetails] = useState<any>(" ");

  const param = useParams();
  let id = param?.id;

  useEffect(() => {
    if (typeof id === "string") {
      setFileId(id);
    }
  }, [id]);

  return (
    <>
    <Navbar />
    <div className="min-h-5/6   bg-sky-100 flex  items-center p-8">
     
      {/* <button onClick={() => router.back()}>Go Back</button> Render more details about the file here */}
     
      {fileId ? (
        <div className="mx-auto  max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Preview Section */}
          <div className="bg-gray-100 aspect-square rounded-lg overflow-hidden">
            <img
              alt="File preview"
              className="w-full h-full object-cover"
              height={600}
              src="/img1.jpeg"
              style={{
                aspectRatio: "1/1",
                objectFit: "cover",
              }}
              width={600}
            />
          </div>

          {/* Details Section */}
          <div
            className="rounded-lg p-6 space-y-6 self-center mx-auto my-auto  bg-white w-full md:w-1/2"
            style={{ height: '12em' }}
          >
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">xyz.ext</h1>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">created by: username</p>
                <p className="text-sm text-gray-600">created on: 9.59.23</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Button className="flex items-center gap-2">
                <Share className="h-4 w-4" />
                Share
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Shared with</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Shared Users</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <ScrollArea className="h-[200px]">
                    {sharedUsers.map((user) => (
                      <DropdownMenuItem key={user.id} className="p-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage alt={user.name} src={user.avatar} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{user.name}</span>
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
    </>
    
  );
}
