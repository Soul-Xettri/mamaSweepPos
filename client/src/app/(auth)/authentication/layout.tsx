import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
}

interface ExamplesLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: ExamplesLayoutProps) {
  return (
    <>
      <div className="container relative">
        <section>
          <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow-md md:shadow-xl">
            {children}
          </div>
        </section>
      </div>
    </>
  )
}
