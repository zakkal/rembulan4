import { useAuth } from '@/contexts/AuthContext';
import { NavLink } from '@/components/NavLink';
import { useLocation, Outlet } from 'react-router-dom';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar,
} from '@/components/ui/sidebar';
import { LayoutDashboard, Users, ClipboardEdit, FileBarChart, LogOut, Moon } from 'lucide-react';

const mentorMenuItems = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Data Murid', url: '/data-murid', icon: Users },
  { title: 'Input Nilai', url: '/input-nilai', icon: ClipboardEdit },
  { title: 'Laporan', url: '/laporan', icon: FileBarChart },
];

const waliMenuItems = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Laporan Anak', url: '/laporan', icon: FileBarChart },
];

function AppSidebarContent() {
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const items = user?.role === 'mentor' ? mentorMenuItems : waliMenuItems;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className={`p-4 ${collapsed ? 'px-2' : ''}`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Moon className="w-4 h-4 text-primary" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="font-heading text-sm font-bold text-foreground">Rembulan 4</h2>
                <p className="text-xs text-muted-foreground font-heading">Monitoring Santri</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4">
          {!collapsed && (
            <div className="mb-3 px-2">
              <p className="font-heading text-xs text-muted-foreground">Masuk sebagai</p>
              <p className="font-heading text-sm font-semibold text-foreground truncate">{user?.name}</p>
              <p className="font-heading text-xs text-muted-foreground capitalize">{user?.role === 'wali' ? 'Wali Murid' : 'Mentor'}</p>
            </div>
          )}
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive font-heading w-full px-2 py-1.5 rounded-md hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Keluar</span>}
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

const AppLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebarContent />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b border-border px-4">
            <SidebarTrigger className="mr-4" />
            <h1 className="font-heading text-sm font-medium text-muted-foreground">Program Rembulan 4</h1>
          </header>
          <main className="flex-1 p-4 md:p-8 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
