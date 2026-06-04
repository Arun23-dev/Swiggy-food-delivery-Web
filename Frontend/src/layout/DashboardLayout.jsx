// layouts/DashboardLayout.jsx
import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import useAuth from '../hooks/useAuth'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navSections = [
  {
    title: "Main",
    items: [
      { key: "", label: "Dashboard", icon: "📊", path: "/dashboard" },
      { key: "orders", label: "My Orders", icon: "📦", path: "/dashboard/orders" },
      { key: "cart", label: "Cart", icon: "🛒", path: "/dashboard/cart" },
      { key: "payment", label: "Payments", icon: "💵", path: "/dashboard/payment" },
    ],
  },
  {
    title: "Account",
    items: [
      { key: "profile", label: "Profile Settings", icon: "👤", path: "/dashboard/profile" },
    ],
  },
];

const pageMeta = {
  "": { title: "Dashboard", sub: "Overview of your activity" },
  "orders": { title: "My Orders", sub: "Track your food journey" },
  "cart": { title: "My Cart", sub: "Review and checkout items" },
  "payment": { title: "My Payment", sub: "Review your paid money" }, // ✅ fixed trailing space
  "profile": { title: "Profile Settings", sub: "Manage your account" },
};

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {logout } =useAuth()

  // ✅ Fixed: reliable path extraction
  const currentPath = location.pathname.split("/dashboard/")[1] ?? "";
  const meta = pageMeta[currentPath] || pageMeta[""];

  const handleLogout = () => {
    // localStorage.removeItem('token');
    logout();
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-gray-50">

        {/* SIDEBAR */}
        <Sidebar className="bg-white border-r">
          <SidebarContent className="flex flex-col h-full">

            {/* LOGO */}
            <div className="h-16 flex items-center gap-3 px-4 border-b flex-shrink-0">
              <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <span className="font-bold text-lg">Swiggy</span>
            </div>

            {/* NAVIGATION */}
            <div className="flex-1 overflow-auto">
              {navSections.map((sec) => (
                <SidebarGroup key={sec.title} className="px-2 mt-3">
                  <p className="text-sm text-gray-400 px-3 mb-2">
                    {sec.title}
                  </p>

                  <SidebarGroupContent>
                    <SidebarMenu>
                      {sec.items.map((item) => (
                        <SidebarMenuItem key={item.key}>
                          <SidebarMenuButton
                            onClick={() => navigate(item.path, { replace: true })}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg transition w-full
                              ${
                                location.pathname === item.path
                                  ? "bg-orange-50 text-orange-600 font-semibold"
                                  : "text-gray-600 hover:bg-gray-100"
                              }`}
                          >
                            <div className="flex items-center gap-2">
                              <span>{item.icon}</span>
                              {item.label}
                            </div>

                            {item.badge && (
                              <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </div>

            {/* SIGN OUT BUTTON - pinned to bottom */}
            <div className="px-4 pb-4 flex-shrink-0 border-t pt-3">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 transition text-sm font-medium"
              >
                <span></span> Sign Out
              </button>
            </div>

          </SidebarContent>
        </Sidebar>

        {/* MAIN CONTENT */}
        <div className="flex flex-col flex-1 w-full min-w-0">

          {/* HEADER */}
          <header className="h-16 bg-white border-b flex items-center justify-between px-6">
            <div className="flex items-center">
              <SidebarTrigger />
              <div className="ml-4">
                <h1 className="font-semibold text-lg">{meta.title}</h1>
                <p className="text-xs text-gray-400">{meta.sub}</p>
              </div>
            </div>

            {/* Filter button */}
            <button className="flex items-center gap-2 px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50">
              <span>🔍</span>
              Filter
              <span>▼</span>
            </button>
          </header>

          {/* OUTLET - renders child routes */}
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>

        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;