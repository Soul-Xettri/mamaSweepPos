import Link from "next/link";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/overview"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/overview" ? "text-primary" : "text-muted-foreground"
        )}
      >
        Overview
      </Link>
      <Link
        href="/employees"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/employees" ? "text-primary" : "text-muted-foreground"
        )}
      >
        Employees
      </Link>
      <Link
        href="/players"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/players" ? "text-primary" : "text-muted-foreground"
        )}
      >
        Players
      </Link>
      <Link
        href="/games"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/games" ? "text-primary" : "text-muted-foreground"
        )}
      >
        Games
      </Link>
      <Link
        href="/overview"
         className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/overview" ? "text-primary" : "text-muted-foreground"
        )}
      >
        Shifts
      </Link>
      <Link
        href="/overview"
         className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/overview" ? "text-primary" : "text-muted-foreground"
        )}
      >
        Settings
      </Link>
    </nav>
  );
}
