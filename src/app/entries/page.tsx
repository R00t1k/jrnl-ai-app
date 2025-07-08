"use client";

import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import NoEntries from "@/app/_components/NoEntries";
import Loading from "@/app/_components/Loading";
import { api } from "@/trpc/react";
import Link from "next/link";
import moment from "moment";

const Entries = () => {
  const { status: sessionStatus } = useSession();
  const { replace } = useRouter();
  const { data } = api.post.hello.useQuery({ text: "hello t3 in cool" });

  const { data: entriesData } = api.jounralling.getAllEntries.useQuery(
    undefined,
    {
      enabled: sessionStatus === "authenticated",
    },
  );

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      replace("/");
    }
  }, [sessionStatus]);

  if (sessionStatus === "loading") {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>Entries</title>
      </Head>
      <section className="mt-32 flex flex-col justify-center gap-10">
        <h1 className="font-poppins text-center text-4xl font-bold text-neutral-50">
          Your Entries
        </h1>
        <p className="text-neutral-50 text-center">{data?.greeting}</p>
        {entriesData?.length === 0 ? (
          <NoEntries />
        ) : (
          entriesData?.map((entry) => (
            <Link
              href={`/entries/${entry.id}`}
              key={entry.id}
              className="mx-auto flex w-1/2 flex-row rounded-sm bg-slate-800 p-10"
            >
              <div className="truncate">
                <p className="font-poppins text-lg text-gray-50">
                  {entry.content}
                </p>
                <p className="font-montserrat text-gray-500">{moment(entry.dataCreatedAt).format("MMMM Do YYYY")}</p>
              </div>
            </Link>
          ))
        )}
      </section>
    </>
  );
};

export default Entries;
