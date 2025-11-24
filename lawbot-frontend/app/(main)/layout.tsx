import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "sonner"
import { AuthProvider } from "@/context/AuthContext";
import { FontProvider } from "@/context/FontContext";
import { DynamicSidebarProvider } from "@/context/DynamicSidebarContext";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { UserProvider } from "@/context/UserContext";
import { ProjectProvider } from "@/context/ProjectContext";
import { FavoriteProvider } from "@/context/FavoriteContext";
import { NextStepProvider, NextStep } from 'nextstepjs';
import { steps } from "@/lib/steps";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <NextStepProvider>
      <NextStep steps={steps}>
        <FontProvider>
          <AuthProvider>
            <SidebarProvider>
              <DynamicSidebarProvider>
                <div className="flex-1 flex overflow-hidden w-full">
                  <UserProvider>
                    <FavoriteProvider>
                      <ProjectProvider>
                        <AppSidebar />
                        <main className="flex flex-col flex-1 h-dvh max-h-screen overflow-y-auto">
                          <div className="flex-1 overflow-y-auto">
                            {children}
                          </div>
                          <Toaster />
                        </main>
                      </ProjectProvider>
                    </FavoriteProvider>
                  </UserProvider>
                </div>
              </DynamicSidebarProvider>
            </SidebarProvider>
          </AuthProvider>
        </FontProvider>
      </NextStep>
    </NextStepProvider>
  );
}
