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
  Clock,
  LogOut,
} from "lucide-react";

const navigation = [
  { name: "Panel", href: "/", icon: LayoutDashboard },
  { name: "Turnos", href: "/turnos", icon: Clock },
  { name: "Clientes", href: "/clientes", icon: Users },
  { name: "Inventario", href: "/inventario", icon: Package },
  { name: "Reservas", href: "/reservas", icon: Calendar },
  { name: "Facturación", href: "/facturacion", icon: Receipt },
];

export default function SidebarNav() {
  const [location, navigate] = useLocation();
  const { logoutMutation } = useAuth();

  return (
    <div className="flex flex-col w-64 min-h-screen p-4 border-r border-border bg-sidebar">
      <div className="space-y-4">
        <div className="px-3 py-2">
          <div className="mb-2 px-4 flex items-center gap-2">
            <img src="/APP.png" alt="Logo de la Empresa" className="h-8 w-auto" />
          </div>
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
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}