import React, { useState } from 'react';
import Order from '../pages/Order';
import Cart from '../pages/Cart';
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
} from '@/components/ui/sidebar';

const navItems = [
  {
    key: 'orders',
    label: 'Orders',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    key: 'cart',
    label: 'Cart',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
      </svg>
    ),
  },
];

const DashboardLayout = () => {
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <SidebarProvider  defaultOpen={true} style={{ '--sidebar-width': '250px', '--sidebar-width-icon': '60px' }}>
      <div className="flex min-h-screen w-full bg-slate-50">

        {/* Shadcn Sidebar */}
        <Sidebar collapsible='icon' className="w-64">
          <SidebarContent>
            {/* Logo */}
            <div className="flex items-center gap-2 px-4 py-5 border-b border-slate-200">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">S</span>
              </div>
              <span className="font-semibold text-slate-800">Swiggy</span>
            </div>

            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton
                        isActive={activeTab === item.key}
                        onClick={() => setActiveTab(item.key)}
                        className={activeTab === item.key ? 'text-orange-500 bg-orange-50' : ''}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Topbar */}
          <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-lg font-semibold text-slate-900">
                {activeTab === 'orders' ? 'My Orders' : 'My Cart'}
              </h1>
              <p className="text-xs text-slate-500">
                {activeTab === 'orders' ? 'Track and manage your orders' : 'Review your cart items'}
              </p>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {activeTab === 'orders' && <Order />}
            {activeTab === 'cart' && <Cart />}
          </main>
        </div>

      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;