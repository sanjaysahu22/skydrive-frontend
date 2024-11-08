import { ChevronDown, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  return (
    <nav className="flex items-center border-2 justify-between px-4 py-2 ">
      <div className="flex items-center">
        <Button variant="ghost" size="icon">
          <ChevronDown className="h-5 w-5" />
          <span className="sr-only">Logo</span>
        </Button>
      </div>
      <div className="flex-1 mx-4">
        <div className="w-full max-w-lg mx-auto">
          <input
            className="w-full px-4 py-2 rounded-full bg-blue-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search here !!"
            type="search"
          />
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>shared</DropdownMenuItem>
          <DropdownMenuItem>private</DropdownMenuItem>
          <DropdownMenuItem>upload</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )
}