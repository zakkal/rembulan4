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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(124,177,232,0.2)]">
              <Moon className="w-5 h-5 text-primary" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="font-heading text-base font-bold text-foreground tracking-wide">Rembulan <span className="text-primary text-sm align-super">2026</span></h2>
                <p className="text-xs text-primary/80 font-heading tracking-wider uppercase">Monitoring Santri</p>
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
      <div className="min-h-screen flex w-full relative z-10">
        <AppSidebarContent />
        <div className="flex-1 flex flex-col bg-transparent">
          <header className="h-16 flex items-center border-b border-white/10 bg-white/5 backdrop-blur-md px-6 shadow-sm">
            <SidebarTrigger className="mr-4 text-foreground/80 hover:text-white" />
            <h1 className="font-heading text-xs font-semibold text-primary/70 tracking-widest uppercase">Program Rembulan 2026</h1>
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
