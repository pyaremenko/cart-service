import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t py-8">
      <div className="container mx-auto px-4">
        <div className="border-t mt-8 pt-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} CartReserve. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
