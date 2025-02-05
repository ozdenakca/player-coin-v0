import { Menu, Search } from "lucide-react"

interface TopBarProps {
  onMenuClick: () => void
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  return (
    <div className="bg-white shadow-md p-4 flex items-center">
      <button onClick={onMenuClick} className="p-2">
        <Menu className="h-6 w-6" />
      </button>
      <div className="flex-1 flex justify-center">
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-1/2 max-w-md">
          <Search className="h-5 w-5 text-gray-500 mr-2" />
          <input type="text" placeholder="Search..." className="bg-transparent outline-none w-full" />
        </div>
      </div>
    </div>
  )
}

