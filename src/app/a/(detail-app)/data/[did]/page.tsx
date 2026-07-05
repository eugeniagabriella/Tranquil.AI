"use client";
import React from "react";
import { dateConverterCreatedAt } from "~/lib/helper";
import { api } from "~/trpc/react";

const DataInfoPage = ({ params }: { params: { did: string } }) => {
  const { data, isLoading } = api.journal.getAllInfo.useQuery({
    id: params.did,
  });

  return (
    <div>
      {
        isLoading ? (
          <div>Getting your data...</div>
        ) : data ? (
          <div className="p-8">
            <h1 className="text-lg font-semibold text-indigo-600">
              Information About: {data[0]?.user.email}
            </h1>
            <div className="mt-4 flex flex-col gap-6">
              {data.map((d) => (
                <div
                  key={d.id}
                  className="grid grid-cols-3 gap-2 rounded border-[1.3px] border-gray-400 p-4"
                >
                  <div>
                    <h5 className="font-semibold text-indigo-600">
                      SUMMARY - {dateConverterCreatedAt(d.date)}
                    </h5>
                    <p className="text-lg font-medium">{d.summary}</p>
                  </div>
                  <div className="max-h-64 overflow-y-scroll">
                    {d.chat.map((msg, index) => (
                      <div
                        key={index}
                        className={`mb-2 ${msg!.role === "ai" ? "font-medium text-indigo-600" : ""}`}
                      >
                        {msg!.content} {msg!.role === "ai" ? "🤗" : ""}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>No Data</div>
        )
        // <h1>Information About: {data != undefined ? data[0].user.email : did} </h1>
      }
    </div>
  );
};

export default DataInfoPage;
