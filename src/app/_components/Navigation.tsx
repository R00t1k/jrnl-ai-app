"use client";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";



export function Navigation() {
  const {data:session} = useSession();
  const [Loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  if(session){
    return (
        <nav className="absolute top-0 left-0 z-10 flex w-full flex-col items-center justify-between gap-8 bg-transparent p-7 backdrop-blur-md md:fixed md:flex-row md:gap-0">
          <div className="font-poppins flex w-full items-center justify-between text-xl font-bold lowercase tracking-tight text-neutral-100 md:text-4xl">
            <Link href="/">jrnl</Link>
            <div className="flex md:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <XMarkIcon width={30} /> : <Bars3Icon width={30} />}
            </div>
          </div>
          <ul className={`font-montserrat flex flex-col gap-8 text-neutral-100 md:flex-row md:items-center md:justify-end md:gap-20 ${
                !isOpen && "hidden md:flex"
              }`}>
            <Link href="/entries">Entries</Link>
            <Link href="/write">Write</Link>
            <button className="w-min" onClick={() => {
              setLoading(true);
              void signOut();
            }}>
              {Loading ? "Logging out..." : "Logout"}
            </button>
          </ul>
    
        </nav>
      );
  }


}
