import { auth } from "@/server/auth";
import Link from "next/link";



export default async function Home() {
  const session = await auth();

  return (
    <>
       <div
        className="flex h-screen items-center bg-cover bg-center"
        style={{ backgroundImage: `url(/background.png)` }}
      >
        <div className="m-auto mt-64 flex flex-col justify-center gap-5 text-center align-middle">
          <h1 className="font-poppins bg-gradient-to-br from-white to-slate-600 box-decoration-slice bg-clip-text p-2 text-7xl font-extrabold text-transparent">
            Jrnl
          </h1>
          <h2 className="font-montserrat text-5xl text-neutral-100">
            Your AI Journal
          </h2>
          <Link
            href={session ? "/api/auth/signout" : "/api/auth/signin"}
            className="font-poppins mx-auto rounded-sm bg-gradient-to-br from-indigo-500 to-indigo-600 px-20 py-2 text-2xl font-bold text-neutral-50 shadow-sm"
          >
            {session ? "Sign Out" : "Sign In"}
          </Link>
        </div>
      </div>
    </>
  );
}
