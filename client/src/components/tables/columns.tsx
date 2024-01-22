"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/tables/column-header";

export type Player = {
  id: string;
  name: string;
  ign: string;
  image?: string;
  facebookUrl: string;
};

export const playerColumns: ColumnDef<Player>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: any) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const Player = row.original;
      return (
        <div className="flex items-center">
          {Player.image ? (
            <img
              src={Player.image}
              alt=""
              className="h-8 w-8 rounded-full mr-2"
            />
          ) : null}
          <span className="text-left font-medium">{Player.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "ign",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="IGN" />
    ),
  },
  {
    accessorKey: "facebookUrl",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Facebook Url" />
    ),
    cell: ({ row }) => {
      const Player = row.original;
      return (
        <a
          href={Player.facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-left font-medium"
        >
          {Player.facebookUrl}
        </a>
      );
    },
  },
  {
    accessorKey: "action",
    id: "actions",
    cell: ({ row }) => {
      const Player = row.original;

      return (
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
              onClick={() => navigator.clipboard.writeText(Player.id)}
            >
              Copy Player ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(Player.ign)}
            >
              Copy Player IGN
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => (Player.facebookUrl ? window.open(Player.facebookUrl, "_blank") : null)}
            >
              Open Player Facebook
            </DropdownMenuItem>
            <DropdownMenuItem>View Player details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
