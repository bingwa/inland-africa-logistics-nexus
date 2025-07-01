
import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DriverSidebar } from "@/components/DriverSidebar";
import { Header } from "@/components/Header";

interface DriverLayoutProps {
  children: ReactNode;
}

export const DriverLayout = ({ children }: DriverLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50 dark:bg-slate-900">
        <DriverSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 p-4 sm:p-6 bg-slate-50 dark:bg-slate-900 overflow-x-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
