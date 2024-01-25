"use client";

import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { MainNav } from "@/components/main-nav";
import { Search } from "@/components/search";
import BusinessSwitcher from "@/components/business-switcher";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/user-nav";
import { ModeToggle } from "@/components/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MoreHorizontal, Phone } from "lucide-react";

const data=[
  {
    id:1,
    name:"Fire Kirin",
    image:"/fk.jpeg",
  },
  {
    id:2,
    name:"Orion Stars",
    image:"/os.png",
  },
  {
    id:3,
    name:"Game Vault",
    image:"/gv.jpeg",
  },
  {
    id:4,
    name:"VB-Link",
    image:"/vblink.jpeg",
  },
  {
    id:5,
    name:"Milky Way",
    image:"/milkyway.jpeg",
  },
  {
    id:6,
    name:"Juwa",
    image:"/juwa.jpeg",
  },
  {
    id:7,
    name:"Panda Master",
    image:"/pm.jpeg",
    slug:"pm",
  },
  {
    id:8,
    name:"Ultra Panda",
    image:"/up.jpeg",
  },
]

export default function Employees() {
  return (
    <>
      <div className="flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <BusinessSwitcher />
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <ModeToggle />
              <Search />
              <UserNav />
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Games</h2>
          </div>
          <div className="items-start justify-center gap-6 rounded-lg  md:grid lg:grid-cols-2 xl:grid-cols-4">
            {
              data.map((item)=>(
                <div className="col-span-2 grid items-start gap-6 lg:col-span-1">
                <Card>
                  <CardHeader className="items-center relative">
                      <div className="absolute right-0 top-0">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => console.log("Copy payment ID")}
                          >
                            Copy Game Link
                          </DropdownMenuItem>
                            <DropdownMenuItem
                            onClick={() => console.log("Copy payment ID")}
                          >
                            Copy Admin Link
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>View Game Details</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      </div>
                    <Avatar className="w-[150px] h-[150px] rounded-none">
                      <AvatarImage src={item.image} alt="Avatar"/>
                      <AvatarFallback>{item.name}</AvatarFallback>
                    </Avatar>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center pb-10">
                    <h5 className="text-xl font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </h5>
                  </CardContent>
                </Card>
              </div>
              ))
            }
          </div>
        </div>
      </div>
    </>
  );
}
