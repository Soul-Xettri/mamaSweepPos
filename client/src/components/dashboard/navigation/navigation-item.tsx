"use client";

import { ActionToolTip } from "@/components/action-tooltip";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useParams } from "next/navigation";

export const NavigationItem =  () => {
    const params = useParams();

  const onClick = () => {
    console.log("clicked");
  };
  return (
    <div>
    <ActionToolTip side="right" align="center" label={""}>
      <button onClick={onClick} className="group relative flex items-center">
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            params?.serverId !== "id" && "group=hover:h-[20px]",
            params?.serverId === "id" ? "h-[36px]" : "h-[38px]"
          )}
        />
        <div
          className={cn(
            "relative group flex m-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
            params?.serverId === "id" &&
              "bg-primary/10 text-primary rounded-[16px]"
          )}
        >
          {/* <Image fill src={"https://images.unsplash.com/photo-1575936123452-b67c3203c357?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"} alt="channel" /> */}
        </div>
      </button>
    </ActionToolTip>
  </div>
  );
};
