import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  Users,
  Package,
  Calendar,
  Receipt,
  LogOut,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Reservations", href: "/reservations", icon: Calendar },
  { name: "Billing", href: "/billing", icon: Receipt },
];

export default function SidebarNav() {
  const [location, navigate] = useLocation();
  const { logoutMutation } = useAuth();

  return (
    <div className="flex flex-col w-64 min-h-screen p-4 border-r border-border bg-sidebar">
      <div className="space-y-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            642APP
          </h2>
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.name}
                  variant={location === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    location === item.href && "bg-sidebar-accent"
                  )}
                  onClick={() => navigate(item.href)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="mt-auto">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => logoutMutation.mutate()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
