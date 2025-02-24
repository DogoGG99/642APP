import { ReactNode } from "react";
import SidebarNav from "./sidebar-nav";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <SidebarNav />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
