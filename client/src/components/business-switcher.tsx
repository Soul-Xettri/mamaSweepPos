"use client";

import * as React from "react";
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const groups = [
  {
    label: "Current Business",
    business: [
      {
        avatar: "/ms.jpg",
        label: "Mama Sweeps",
        value: "business1",
      },
    ],
  },
  {
    label: "Other Business",
    business: [
      {
        avatar: "/tg.jpg",
        label: "Titanium Gaming ",
        value: "business2",
      },
    ],
  },
];

type business = (typeof groups)[number]["business"][number];

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface BusinessSwitcherProps extends PopoverTriggerProps {}

export default function BusinessSwitcher({ className }: BusinessSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [showNewBusinessDialog, setShowNewBusinessDialog] =
    React.useState(false);
  const [selectedBusiness, setSelectedBusiness] = React.useState<business>(
    groups[0].business[0]
  );

  return (
    <Dialog
      open={showNewBusinessDialog}
      onOpenChange={setShowNewBusinessDialog}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a business"
            className={cn("w-[200px] justify-between", className)}
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage
                src={selectedBusiness.avatar}
                alt={selectedBusiness.label}
                className="dark:grayscale"
              />
              <AvatarFallback>MS</AvatarFallback>
            </Avatar>
            {selectedBusiness.label}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search business..." />
              <CommandEmpty>No business found.</CommandEmpty>
              {groups.map((group) => (
                <CommandGroup key={group.label} heading={group.label}>
                  {group.business.map((business) => (
                    <CommandItem
                      key={business.value}
                      onSelect={() => {
                        setSelectedBusiness(business);
                        setOpen(false);
                      }}
                      className="text-sm"
                    >
                      <Avatar className="mr-2 h-5 w-5">
                        <AvatarImage
                          src={business.avatar}
                          alt={business.label}
                          className="dark:grayscale"
                        />
                        <AvatarFallback>SC</AvatarFallback>
                      </Avatar>
                      {business.label}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedBusiness.value === business.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewBusinessDialog(true);
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Create business
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create business</DialogTitle>
          <DialogDescription>
            Add a new business to manage products and customers.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Business name</Label>
              <Input id="name" placeholder="Acme Inc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan">Subscription plan</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">
                    <span className="font-medium">Free</span> -{" "}
                    <span className="text-muted-foreground">
                      Trial for two weeks
                    </span>
                  </SelectItem>
                  <SelectItem value="pro">
                    <span className="font-medium">Pro</span> -{" "}
                    <span className="text-muted-foreground">
                      $9/month per user
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setShowNewBusinessDialog(false)}
          >
            Cancel
          </Button>
          <Button type="submit">Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
