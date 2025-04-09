"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Book, Home, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar";
import { dummyCourses } from "@/app/course/constant";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";

interface CourseLayoutProps {
  children: ReactNode;
}

export function CourseLayout({ children }: CourseLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const { user } = useAuthStore();

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background overflow-hidden">
        <Sidebar variant="floating" collapsible="icon">
          <SidebarHeader className="flex items-center justify-between px-4 py-2">
            <h2 className="text-xl font-bold truncate">CourseGPT</h2>
            <SidebarTrigger />
          </SidebarHeader>

          <SidebarSeparator />
          <SidebarContent className="flex flex-col justify-between h-full">
            <div className="flex-grow overflow-y-auto no-scrollbar">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={pathname === "/course"}
                    onClick={() => router.push("/course")}
                    tooltip="Dashboard"
                  >
                    <Home size={18} />
                    <span className="truncate">Course</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>

              <SidebarSeparator className="my-2" />

              <div className="px-4 py-2">
                <h3 className="text-sm font-medium text-muted-foreground mb-2 truncate">
                  My Courses
                </h3>
                <SidebarMenu>
                  {dummyCourses.map((course) => (
                    <SidebarMenuItem key={course.id}>
                      <SidebarMenuButton
                        isActive={pathname === `/course/${course.id}`}
                        onClick={() => router.push(`/course/${course.id}`)}
                        tooltip={course.title}
                      >
                        <Book size={18} />
                        <span className="truncate">{course.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </div>
            </div>

            <div className="p-4 flex flex-col gap-4 mt-auto border-t">
              <div className="flex items-center gap-3">
                {user?.user_metadata?.avatar_url ? (
                  <Image
                    src={user.user_metadata.avatar_url}
                    alt="User Avatar"
                    width={32}
                    height={32}
                    className="rounded-full flex-shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold uppercase text-white flex-shrink-0">
                    {user?.email?.charAt(0) || "U"}
                  </div>
                )}

                <div className="text-sm overflow-hidden">
                  <div className="font-medium truncate">
                    {user?.email ?? "Loading..."}
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-full justify-start"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                <span className="ml-2 truncate">Toggle Theme</span>
              </Button>
            </div>
          </SidebarContent>

          <SidebarRail />
        </Sidebar>
        <div className="">{children}</div>
      </div>
    </SidebarProvider>
  );
}
