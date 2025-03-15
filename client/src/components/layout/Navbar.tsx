import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Bell, Menu } from "lucide-react";

const Navbar = () => {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const isActive = (path: string) => {
    return location === path;
  };

  const navLinks = [
    { name: "Products", path: "/products" },
    { name: "Features", path: "/#features" },
    { name: "AI News", path: "/news" },
    { name: "About", path: "/about" }
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <a className="flex-shrink-0 flex items-center">
                <span className="text-primary-600 text-2xl font-bold">AI<span className="text-green-500">Market</span></span>
              </a>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <Link key={link.path} href={link.path}>
                  <a className={`${
                    isActive(link.path) 
                      ? "border-primary-500 text-gray-900" 
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:border-primary-500"
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                    {link.name}
                  </a>
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <div className="relative">
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-gray-600 hover:text-gray-900 p-1 rounded-full focus:outline-none"
              >
                <Search size={20} />
              </button>
              {isSearchOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg p-2">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    autoFocus
                  />
                </div>
              )}
            </div>
            <button type="button" className="text-gray-600 hover:text-gray-900 p-1 rounded-full focus:outline-none">
              <Bell size={20} />
            </button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center text-sm focus:outline-none">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || ""} alt={user.username} />
                      <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium text-gray-900">{user.fullName || user.username}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <a className="w-full cursor-pointer">Dashboard</a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <a className="w-full cursor-pointer">Profile</a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/messages">
                      <a className="w-full cursor-pointer">Messages</a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={handleLogout}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-3">
                <Link href="/auth?mode=login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link href="/auth?mode=register">
                  <Button>Register</Button>
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="py-4">
                  <Link href="/">
                    <a className="block px-4 py-2 text-xl font-bold text-primary-600">
                      AI<span className="text-green-500">Market</span>
                    </a>
                  </Link>
                  <div className="mt-4 space-y-1">
                    {navLinks.map((link) => (
                      <Link key={link.path} href={link.path}>
                        <a className={`${
                          isActive(link.path) 
                            ? "bg-gray-50 border-primary-500 text-gray-900" 
                            : "border-transparent text-gray-600"
                          } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
                          {link.name}
                        </a>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    {user ? (
                      <>
                        <div className="flex items-center px-4">
                          <div className="flex-shrink-0">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={user.avatar || ""} alt={user.username} />
                              <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="ml-3">
                            <div className="text-base font-medium text-gray-800">{user.fullName || user.username}</div>
                            <div className="text-sm font-medium text-gray-500">{user.email}</div>
                          </div>
                        </div>
                        <div className="mt-3 space-y-1">
                          <Link href="/dashboard">
                            <a className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50">
                              Dashboard
                            </a>
                          </Link>
                          <Link href="/profile">
                            <a className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50">
                              Profile
                            </a>
                          </Link>
                          <Link href="/messages">
                            <a className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50">
                              Messages
                            </a>
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:text-red-800 hover:bg-gray-50"
                          >
                            Log out
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="px-4 flex flex-col space-y-2">
                        <Link href="/auth?mode=login">
                          <Button variant="outline" className="w-full justify-center">Login</Button>
                        </Link>
                        <Link href="/auth?mode=register">
                          <Button className="w-full justify-center">Register</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
