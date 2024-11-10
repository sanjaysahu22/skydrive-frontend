import Link from "next/link";
import Image from "next/image";

interface FileCardProps {
  fileName: string;
  thumbnail: string;
  id: string;
}

export function FileCard({ fileName, id  , thumbnail}: FileCardProps) {
  return (
    <Link href={`/file/${id}`} className="block">
      <div className="group bg-white rounded-lg overflow-hidden shadow-lg 
                    hover:shadow-2xl hover:shadow-blue-200 
                    transform hover:scale-102 transition-all duration-300
                    h-full">
        <div className="relative h-40 sm:h-48 md:h-52 lg:h-56 bg-gray-100 overflow-hidden">
          <Image
            src={thumbnail}
            alt={fileName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, 
                   (max-width: 768px) 50vw,
                   (max-width: 1024px) 33vw,
                   25vw"
          />
        </div>
        <div className="p-2 bg-[#5F71F6] text-white">
          <p className="text-xs sm:text-sm font-medium truncate">{fileName}</p>
        </div>
      </div>
    </Link>
  );
}