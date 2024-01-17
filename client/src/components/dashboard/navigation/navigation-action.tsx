"use client";

import { ActionToolTip } from "@/components/action-tooltip"
import { Plus } from "lucide-react"

export const NavigationAction = () => {
    return(
        <div>
           <ActionToolTip label="Add user" side="right" align="center">
            <button
            className="group flex items-center"
            >
                <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
                    <Plus
                    className="group-hover:text-white text-emerald-500 transition"
                    size={25}
                    />
                </div>
            </button>
           </ActionToolTip>
        </div>
    )
}