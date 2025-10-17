import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Users, BarChart3, LogOut, SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/layout/header";

const navigation = [
  { name: 'ترینری', href: '/residents', icon: Users },
  { name: 'استادان', href: '/teachers', icon: Users },
  { name: 'گزارشات', href: '/reports', icon: BarChart3 },
  // { name: 'فورم ها', href: '/forms', icon: FormInputIcon },
  { name: 'تنظیمات', href: '/setting', icon: SettingsIcon },
  { name: 'وظایف', href: '/jobs', icon: SettingsIcon },
  // { name: 'درباره ما', href: '/about', icon: InfoIcon },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    
    <div className="fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg">
      <Header />
      <div className="flex flex-col h-full">
        {/* Logo */}
        
        <div className="flex items-center justify-center h-16 px-4">
          {/* <svg
            className="h-8 w-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg> */}
        </div>
        
        {/* User Info */}
        <div className="px-4 py-4 border-b border-slate-200">
          <div className="flex items-center">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.profileImageUrl || ''} alt="User profile" />
              <AvatarFallback className="bg-hospital-green-100 text-hospital-green-600">
                {user?.firstName?.[0] || user?.email?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="mr-3">
              <p className="text-sm font-medium text-slate-900" data-testid="text-user-name">
                {user?.firstName || user?.email || 'User'}
              </p>
              <p className="text-xs text-slate-500 capitalize" data-testid="text-user-role">
                {user?.role || 'User'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || location.startsWith(item.href + '/');
            
            // Hide Settings/Users section for viewers
            if (item.href === '/setting' && user?.role !== 'admin') {
              return null;
            }
            
            return (
              <Link key={item.name} href={item.href}>
                <div className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-hospital-green-50 text-hospital-green-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )} data-testid={`link-${item.name.toLowerCase()}`}>
                  <Icon className="ml-3 h-5 w-5" />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-slate-200">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full flex items-center justify-start px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            data-testid="button-logout"
          >
            <LogOut className="ml-3 h-5 w-5" />
            خروج
          </Button>
        </div>
      </div>
    </div>
  );
}




