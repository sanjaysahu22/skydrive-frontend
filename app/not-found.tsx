'use client '
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* 404 SVG/Text */}
        <div className="relative">
          <h1 className="text-9xl font-bold text-gray-200">404</h1>
          <p className="absolute w-full text-2xl top-1/2 -translate-y-1/2 text-gray-800">
            Oops! Page not found
          </p>
        </div>

        {/* Error Message */}
        <div className="space-y-4 mt-8">
          <h2 className="text-3xl font-semibold text-gray-800">
            Looks like you're lost
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. 
            Don't worry, you can find your way back home.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
         
          <Link href="/signin">
            <Button 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
            > 
              <Home size={20} />
              Return Home
            </Button>
          </Link>
        </div>

        {/* Optional: Custom 404 Illustration */}
        <div className="mt-12">
          <svg 
            className="mx-auto" 
            viewBox="0 0 200 120" 
            width="200" 
            height="120"
          >
            <path 
              d="M 10,100 C 30,60 40,80 50,100 C 60,120 70,100 80,80 C 90,60 100,80 110,100 C 120,120 130,100 140,80 C 150,60 160,80 170,100 C 180,120 190,100 190,100" 
              fill="none" 
              stroke="#3b82f6" 
              strokeWidth="2"
            />
            <circle cx="100" cy="50" r="20" fill="#3b82f6" opacity="0.2" />
            <circle cx="100" cy="50" r="15" fill="#3b82f6" opacity="0.4" />
            <circle cx="100" cy="50" r="10" fill="#3b82f6" opacity="0.6" />
            <circle cx="100" cy="50" r="5" fill="#3b82f6" opacity="0.8" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default NotFound;