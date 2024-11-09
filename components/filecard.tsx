import Link from "next/link";

interface FileCardProps {
  fileName: string;
  thumbnail?: string;
  id:string
}

export function FileCard({ fileName, id }: FileCardProps) {
  return (
    <Link href={`/file/${id}`} passHref>
    <div className="bg-black-100 rounded-lg overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-blue-200 hover:scale-105 transition-all duration-200 " >
      <div className="bg-gray-100" style={{ height: "10em", overflow: "hidden" }}> 
        <img
          
          className="w-full h-full object-cover"
          height={200} 
          src={'/img1.jpeg'}
          style={{
            aspectRatio: "200/200",
            objectFit: "cover",
          }}
          width={100} 
        />
      </div>
      <div className="p-1 bg-[#5F71F6] text-white"> 
        <p className="text-xs truncate">{fileName}</p> 
      </div>
    </div>
    </Link>
  );
}
