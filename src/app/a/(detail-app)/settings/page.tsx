"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import BackLink from "~/components/BackLink";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { api } from "~/trpc/react";

const books = [
  {
    id: 1,
    title: "The Anxiety and Phobia Workbook",
    desc: "A comprehensive guide to managing anxiety and overcoming phobias through cognitive-behavioral therapy.",
    points: 20,
  },
  {
    id: 2,
    title: "Feeling Good: The New Mood Therapy",
    desc: "A book that teaches cognitive therapy techniques to combat depression.",
    points: 20,
  },
  {
    id: 3,
    title: "The Depression Cure",
    desc: "A step-by-step guide to help you beat depression without drugs.",
    points: 20,
  },
  {
    id: 4,
    title: "Mind Over Mood",
    desc: "A self-help manual that offers cognitive therapy techniques for changing your mood.",
    points: 20,
  },
  {
    id: 5,
    title: "The Happiness Trap",
    desc: "A guide to ACT (Acceptance and Commitment Therapy) to reduce stress and live a more fulfilling life.",
    points: 20,
  },
  {
    id: 6,
    title: "Lost Connections",
    desc: "A book that explores the root causes of depression and anxiety and offers a way forward.",
    points: 20,
  },
  {
    id: 7,
    title: "The Mindful Way Workbook",
    desc: "A book that combines mindfulness and cognitive therapy to help manage depression.",
    points: 20,
  },
  {
    id: 8,
    title: "Radical Acceptance",
    desc: "A book that offers mindfulness and self-compassion techniques to help you accept yourself.",
    points: 20,
  },
];

const SettingPage = () => {
  const { data, isLoading } = api.user.getUserData.useQuery();
  return (
    <Dialog>
      <div className="mx-auto max-w-6xl px-2">
        <nav className="flex items-center justify-between py-6">
          <BackLink />
          <DialogTrigger className="font-medium text-indigo-600">
            {/* <Button> */}
            Share Data to Your Psycholog
            {/* </Button> */}
          </DialogTrigger>
          <DialogContent>
            <h1 className="font-bold uppercase text-red-600">
              Warning, Only Share This to your psycholog or someone you trust
            </h1>
            <Button
              onClick={async () => {
                await navigator.clipboard.writeText(`a/data/${data?.id}`);
                toast("Copied to Clipboard");
              }}
            >
              a/data/{data?.id}
            </Button>
          </DialogContent>
        </nav>
        <div>
          {isLoading ? (
            <div>Getting Your Data...</div>
          ) : data ? (
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded border-[1.2px] border-gray-300 p-2">
                  <p className="font-semibold text-indigo-600">EMAIL</p>
                  <h6 className="text-lg font-medium">{data.email}</h6>
                </div>
                <div className="rounded border-[1.2px] border-gray-300 p-2">
                  <p className="font-semibold text-indigo-600">YOUR ID</p>
                  <h6 className="text-lg font-medium">{data.id}</h6>
                </div>
                <div className="rounded border-[1.2px] border-gray-300 p-2">
                  <p className="font-semibold text-indigo-600">POINTS</p>
                  <h6 className="text-lg font-medium">{data.points}</h6>
                </div>
              </div>
              <div>
                <div>
                  <h1 className="text-xl font-bold text-indigo-600">
                    Redeem Points
                  </h1>
                  <p className="font-medium text-gray-600">
                    Take a look at book we recommended based on your data:
                  </p>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {books.map((book) => (
                    <div
                      className="flex flex-col gap-2 rounded-md border-[1.2px] border-gray-300 p-4"
                      key={book.id}
                    >
                      <Image
                        src={`/books/${book.id}.png`}
                        alt={book.title}
                        width="120"
                        height="120"
                      />
                      <h1 className="text-lg font-semibold">{book.title}</h1>
                      <h6 className="w-fit rounded-lg bg-indigo-600 px-4 py-1 font-medium text-white">
                        {book.points} Points
                      </h6>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>Data Not Found</div>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default SettingPage;
