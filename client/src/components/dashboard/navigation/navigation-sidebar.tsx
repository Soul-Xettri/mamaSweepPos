import { Separator } from "@/components/ui/separator";
import { NavigationAction } from "./navigation-action";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavigationItem } from "./navigation-item";
import { ModeToggle } from "@/components/mode-toggle";
import { UserAvatar } from "@/components/user-avatar";

export const NavigationSidebar = () => {
  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full bg-[#E3E5E8] dark:bg-[#1E1F22] py-3">
      <NavigationAction />
      <Separator className="h-2px bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 max-auto" />
      <ScrollArea className="flex-1 w-full">
        <div className="mb-0">
          <NavigationItem />
        </div>
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <ModeToggle />
        <UserAvatar className={"h-[48px] w-[48px]"}/>
      </div>
    </div>
  );
};
