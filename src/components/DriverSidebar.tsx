
import { Truck, Calendar, Package, Settings, FileText, Gauge, Route, Box, MapPin, Clock } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const driverMenuItems = [
  {
    title: "Dashboard",
    url: "/driver-dashboard",
    icon: Gauge,
  },
  {
    title: "My Trips",
    url: "/driver-trips",
    icon: Route,
  },
  {
    title: "Schedule",
    url: "/driver-schedule",
    icon: Calendar,
  },
  {
    title: "Vehicle Check",
    url: "/driver-vehicle",
    icon: Truck,
  },
  {
    title: "Deliveries",
    url: "/driver-deliveries",
    icon: Package,
  },
  {
    title: "Navigation",
    url: "/driver-navigation",
    icon: MapPin,
  },
  {
    title: "Hours Log",
    url: "/driver-hours",
    icon: Clock,
  },
  {
    title: "Documents",
    url: "/driver-documents",
    icon: FileText,
  },
];

export function DriverSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="driver-gradient">
      <SidebarHeader className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <Truck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Driver Portal</h2>
            <p className="text-blue-200 text-sm">Inland Africa Logistics</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-blue-200 font-semibold uppercase tracking-wider">
            Driver Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {driverMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={`driver-nav-item ${
                      location.pathname === item.url 
                        ? 'driver-nav-item-active' 
                        : 'driver-nav-item-inactive'
                    }`}
                  >
                    <Link to={item.url}>
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
