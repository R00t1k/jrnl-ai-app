"use client"

import { api } from "@/trpc/react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { useEffect } from "react"
import moment from "moment"
import { TrashIcon } from "@heroicons/react/24/solid"

const Entry = () => {
  const { status: sessionStatus } = useSession()
  const router = useRouter()
  const params = useParams<{ pid: string }>()
  const entryId = params?.pid

  const { data: entryData, refetch: refetchEntry } = api.jounralling.getEntryById.useQuery(
    { id: entryId! },
    {
      enabled: entryId !== undefined,
    },
  )

  const { mutate: deletionMutation } = api.jounralling.deleteEntry.useMutation({
    onSuccess() {
      router.push("/entries")
    },
  })

  const { mutate: rateMoodMutation, status: rateMoodStatus } = api.ai.rateEntry.useMutation({
    onSuccess() {
      refetchEntry()
    },
  })

  const ratingToEmoji = (rating: number) => {
    if (rating < 2) {
      return {
        text: "Very Sad 😭",
        color: "bg-red-700",
      }
    } else if (rating <= 4) {
      return {
        text: "Sad 😔",
        color: "bg-orange-700",
      }
    } else if (rating === 5) {
      return {
        text: "Normal 😐",
        color: "bg-indigo-700",
      }
    } else if (rating <= 8) {
      return {
        text: "Happy 🙂",
        color: "bg-teal-700",
      }
    }
    return {
      text: "Very Happy 😁",
      color: "bg-emerald-700",
    }
  }

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/")
    }
  }, [sessionStatus, router])

  // Set document title dynamically
  useEffect(() => {
    if (entryData) {
      document.title = `Entry - ${moment(entryData.dataCreatedAt).format("MMMM Do YYYY")}`
    } else {
      document.title = "Entry"
    }
  }, [entryData])

  return (
    <section className="mt-32 flex flex-col justify-center gap-10">
      {entryData !== null && (
        <div className="mx-auto flex w-1/2 flex-col gap-5">
          <div className="flex flex-row items-center justify-between">
            <h1 className="font-poppins text-3xl font-extrabold text-gray-50">
              {moment(entryData?.dataCreatedAt).format("MMMM Do YYYY")}
            </h1>
            <div className="flex gap-2">
              {entryData?.moodRating === null && (
                <button
                  disabled={rateMoodStatus === "pending"}
                  onClick={() => rateMoodMutation({ id: entryId! })}
                  className={`${
                    rateMoodStatus === "pending" && "cursor-not-allowed opacity-50"
                  } font-poppins flex justify-center rounded-sm bg-gradient-to-br from-sky-700 to-sky-800 p-2 px-8 font-bold text-gray-50 hover:from-sky-600 hover:to-sky-700 transition-colors`}
                >
                  {rateMoodStatus === "pending" ? "Analyzing..." : "Analyse Mood"}
                </button>
              )}
              <button
                className="rounded-sm bg-gradient-to-br from-gray-700 to-gray-800 p-2 hover:from-gray-600 hover:to-gray-700 transition-colors"
                onClick={() => deletionMutation({ id: entryId! })}
              >
                <TrashIcon width={25} className="text-gray-50" />
              </button>
            </div>
          </div>
          {entryData?.moodRating && (
            <div
              className={`font-poppins w-max justify-center rounded-2xl p-3 text-lg text-gray-50 ${
                ratingToEmoji(entryData.moodRating).color
              }`}
            >
              {ratingToEmoji(entryData.moodRating).text}
            </div>
          )}
          <p className="font-montserrat whitespace-pre-line bg-gray-900 p-5 text-lg text-gray-50 rounded-lg">
            {entryData?.content}
          </p>
        </div>
      )}
    </section>
  )
}

export default Entry
