import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">CR</span>
            </div>
            <span className="font-bold text-xl">CartReserve</span>
          </Link>

          <div className="flex items-center space-x-4"></div>
        </div>
      </div>
    </header>
  );
}
