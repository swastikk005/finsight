import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Sidebar } from "@/components/sidebar"
import { prisma } from "@/lib/db"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { hasOnboarded: true, name: true }
  })

  if (!user?.hasOnboarded) {
    redirect("/onboarding")
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 ml-64 overflow-y-auto">
        <div className="min-h-full">{children}</div>
      </main>
    </div>
  )
}
