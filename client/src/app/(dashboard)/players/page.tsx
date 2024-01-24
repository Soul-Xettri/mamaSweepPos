"use client";

import { MainNav } from "@/components/main-nav";
import { Search } from "@/components/search";
import BusinessSwitcher from "@/components/business-switcher";
import { UserNav } from "@/components/user-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { Player, playerColumns } from "@/components/tables/columns";
import { DataTable } from "@/components/tables/data-table";

async function getData(): Promise<Player[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      name: "John Doe",
      ign: "1johndoe",
      image: "https://picsum.photos/200",
      facebookUrl: "https://facebook.com",
    },
    {
     id: "728ed52f",
      name: "John Doe",
      ign: "1johndoe",
      image: "https://picsum.photos/200",
      facebookUrl: "https://facebook.com",
    },{
     id: "728ed52f",
      name: "John Doe",
      ign: "1johndoe",
      image: "https://picsum.photos/200",
      facebookUrl: "https://facebook.com",
    },{
     id: "728ed52f",
      name: "John Doe",
      ign: "1johndoe",
      image: "https://picsum.photos/200",
      facebookUrl: "https://facebook.com",
    },{
     id: "728ed52f",
      name: "John Doe",
      ign: "1johndoe",
      image: "https://picsum.photos/200",
      facebookUrl: "https://facebook.com",
    },{
     id: "728ed52f",
      name: "John Doe",
      ign: "1johndoe",
      image: "https://picsum.photos/200",
      facebookUrl: "https://facebook.com",
    },{
     id: "728ed52f",
      name: "John Doe",
      ign: "1johndoe",
      image: "https://picsum.photos/200",
      facebookUrl: "https://facebook.com",
    },{
      id: "728ed52f",
      name: "John Doe",
      ign: "1johndoe",
      image: "https://picsum.photos/200",
      facebookUrl: "https://facebook.com",
    },{
      id: "728ed52f",
      name: "John Doe",
      ign: "1johndoe",
      image: "https://picsum.photos/200",
      facebookUrl: "https://facebook.com",
    },{
      id: "728ed52f",
      name: "John Doe",
      ign: "1johndoe",
      image: "https://picsum.photos/200",
      facebookUrl: "https://facebook.com",
    },{
     id: "728ed52f",
      name: "John Doe",
      ign: "1johndoe",
      image: "https://picsum.photos/200",
      facebookUrl: "https://facebook.com",
    },{
      id: "728ed52f",
      name: "John Doe",
      ign: "1johndoe",
      image: "https://picsum.photos/200",
      facebookUrl: "https://facebook.com",
    },
  ]
}

export default async function Employees() {
  const data = await getData()
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
            <h2 className="text-3xl font-bold tracking-tight">Players</h2>
          </div>
          <div className="items-start justify-center gap-6 rounded-lg">
          <DataTable columns={playerColumns} data={data} />
          </div>
        </div>
      </div>
    </>
  );
}
