"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { MainNav } from "@/components/main-nav";
import { Search } from "@/components/search";
import BusinessSwitcher from "@/components/business-switcher";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/user-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { DashboardCard } from "@/components/cards/dashboard-card";
import { Stats } from "@/components/stats/stats";

export default function DashboardPage() {
  return (
    <>
      <div className="flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <BusinessSwitcher />
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <ModeToggle/>
              <Search />
              <UserNav />
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
              <CalendarDateRangePicker />
              <Button>Download</Button>
            </div>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics" disabled>
                Analytics
              </TabsTrigger>
              <TabsTrigger value="reports" disabled>
                Reports
              </TabsTrigger>
              <TabsTrigger value="notifications" disabled>
                Notifications
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <DashboardCard/>
              <Stats/>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
