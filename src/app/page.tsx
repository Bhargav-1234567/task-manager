import { getServerUser } from "@/lib/auth/serverAuth";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Home() {
    const user = await getServerUser()
   if (!user) {
    redirect('/login?from=/dashboard')
  }else{
     redirect('/app')
  }
  return (
    <main className="p-6 bg-white text-black dark:bg-gray-900 dark:text-white">
        <h1 className="text-2xl font-bold">Theme test</h1>
        <p>Click the toggle in the header.</p>
      </main>
  );
}
