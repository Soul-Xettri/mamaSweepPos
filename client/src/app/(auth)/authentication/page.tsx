"use client";

import { cn } from "@/lib/utils";

import { AuthCard } from "@/components/cards/auth-card";

function Container({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-center [&>div]:w-full",
        className
      )}
      {...props}
    />
  );
}

export default function CardsPage() {
  return (
    <>
      <div className=" items-center justify-center gap-6 rounded-lg p-8 md:grid h-screen">
        <Container>
          <AuthCard />
        </Container>
      </div>
    </>
  );
}
