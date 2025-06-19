import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Globe, Menu, User, LogOut, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CurrencySelector } from "./CurrencySelector";
import { LanguageSelector } from "./LanguageSelector";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Header() {
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  // Fetch notifications for authenticated users
  const { data: notifications } = useQuery({
    queryKey: ['/api/notifications'],
    enabled: isAuthenticated,
  });

  const unreadCount = Array.isArray(notifications) ? notifications.filter((n: any) => !n.isRead)?.length : 0;

  const navItems = [
    { href: "/flights", label: "Flights" },
    { href: "/hotels", label: "Hotels" },
    { href: "/cars", label: "Cars" },
    { href: "/blog", label: "Blog" },
  ];

  const seoTools = [
    { href: "/google-seo", label: "SEO Dashboard" },
    { href: "/seosurf", label: "Rankings" },
    { href: "/seo-automation", label: "AI Auto" },
    { href: "/gap-analysis", label: "Gap Analysis" },
    { href: "/ahrefs-dashboard", label: "Competitor Intel" },
  ];

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600">YourTravelSearch</h1>
            </Link>
          </div>

          {/* Centered Navigation - Main Travel Services Only */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-baseline space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    location === item.href
                      ? "text-blue-600"
                      : "text-gray-900 hover:text-blue-600"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Notification Bell for authenticated users */}
            {isAuthenticated && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative"
                onClick={() => setLocation("/profile?tab=notifications")}
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs flex items-center justify-center"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            )}

            {/* SEO Tools Dropdown - only visible to authorized users */}
            <div className="hidden md:flex items-center space-x-2">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                      Tools
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="p-4 w-48">
                        {seoTools.map((tool) => (
                          <NavigationMenuLink key={tool.href} asChild>
                            <Link
                              href={tool.href}
                              className={`block px-3 py-2 text-sm font-medium transition-colors rounded ${
                                location === tool.href
                                  ? "text-blue-600 bg-blue-50"
                                  : "text-gray-900 hover:text-blue-600 hover:bg-gray-50"
                              }`}
                            >
                              {tool.label}
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Currency and Language Selectors */}
            <div className="hidden md:flex items-center space-x-2">
              <CurrencySelector />
              <LanguageSelector />
            </div>
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span className="hidden md:inline">{user?.firstName} {user?.lastName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setLocation("/profile")}>
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </DropdownMenuItem>
                  {user?.isAdmin && (
                    <DropdownMenuItem onClick={() => setLocation("/admin-dashboard")}>
                      <User className="w-4 h-4 mr-2" />
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={() => setLocation("/login")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Sign In
              </Button>
            )}
            
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`text-lg font-medium transition-colors ${
                        location === item.href
                          ? "text-blue-600"
                          : "text-gray-900 hover:text-blue-600"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                  
                  <div className="border-t pt-4">
                    <div className="text-sm font-medium text-gray-500 mb-2">SEO Tools</div>
                    {seoTools.map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        className={`block text-base font-medium transition-colors ml-4 ${
                          location === tool.href
                            ? "text-blue-600"
                            : "text-gray-900 hover:text-blue-600"
                        }`}
                      >
                        {tool.label}
                      </Link>
                    ))}
                  </div>
                  
                  <div className="flex flex-col space-y-2 mt-4">
                    <CurrencySelector />
                    <LanguageSelector />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
