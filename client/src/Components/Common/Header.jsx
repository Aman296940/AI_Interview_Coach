import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ArrowRight } from "lucide-react";

export default function Header() {
  const { user, logout } = useAuth();
  
  return (
      <nav className="bg-[#0f172a] text-white px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        {/* Tailwind Icon (or your logo) */}
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6 text-indigo-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 7.5a6.75 6.75 0 0112.248-2.97m-12.248 2.97a6.75 6.75 0 0012.248 2.97M3.75 7.5H4.5m15.75 9a6.75 6.75 0 01-12.248 2.97m12.248-2.97a6.75 6.75 0 00-12.248-2.97M19.5 16.5h-.75"
          />
        </svg> */}
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex space-x-10 font-semibold text-sm">
        <a href="#" className="hover:text-indigo-400">Product</a>
        <a href="#" className="hover:text-indigo-400">Features</a>
        <a href="#" className="hover:text-indigo-400">Marketplace</a>
        <a href="#" className="hover:text-indigo-400">Company</a>
      </div>

      {/* Login */}
      <div>
        {/* <a
          href="#"
          className="flex items-center text-sm font-medium hover:text-indigo-400"
        >
          Log in <ArrowRight className="ml-1 w-4 h-4" />
        </a> */}
      </div>
    </nav>  
  );
}
