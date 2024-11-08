import { Navbar } from "@/components/navbar"
import { FileCard } from "@/components/filecard"

const files = [
  { id: 1, name: "Image 1", thumbnail: "/placeholder.svg?height=200&width=200" },
  { id: 2, name: "Image 1", thumbnail: "/placeholder.svg?height=200&width=200" },
  { id: 3, name: "Image 1", thumbnail: "/placeholder.svg?height=200&width=200" },
  { id: 4, name: "Image 1", thumbnail: "/placeholder.svg?height=200&width=200" },
  { id: 5, name: "Image 1", thumbnail: "/placeholder.svg?height=200&width=200" },
  
]

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar/>
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {files.map((file) => (
            <FileCard key={file.id} id={file.id} fileName={file.name} thumbnail={file.thumbnail} />
          ))}
        </div>
      </main>
    </div>
  )
}