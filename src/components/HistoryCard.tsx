import { AudioWaveform, BookHeart } from "lucide-react";
import Link from "next/link";
import React from "react";
import { dateConverterCreatedAt } from "~/lib/helper";

type Params = {
  id: number;
  title: string;
  desc: string;
  dates: Date;
  type: "journal" | "conversation";
};

const HistoryCard = (j: Params) => {
  return (
    <Link
      href={`${j.type == "journal" ? "home" : "conversations"}/${j.type == "journal" ? "j/" : ""}${j.id}`}
      type="button"
      key={j.id}
      className="flex justify-between rounded border-[1.3px] border-gray-300 bg-white px-3 py-2 text-start hover:border-indigo-600 hover:bg-indigo-50"
    >
      <div className="grid grid-cols-10 gap-3">
        <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full border-[1.4px] border-indigo-300 text-indigo-600">
          {j.type == "journal" ? (
            <BookHeart size={20} />
          ) : (
            <AudioWaveform size={20} />
          )}
        </div>
        <div className="col-span-9 flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-indigo-700">{j.title}</h3>
          <p className="font-medium text-gray-500">{j.desc}</p>
        </div>
      </div>
      <p className="text-sm font-medium">{dateConverterCreatedAt(j.dates)}</p>
    </Link>
  );
};

export default HistoryCard;
