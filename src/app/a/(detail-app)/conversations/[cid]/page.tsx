"use client";
import React from "react";
import BackLink from "~/components/BackLink";
import { EmotionChart, type EmotionData } from "~/components/EmotionChart";
import { api } from "~/trpc/react";

type ConversationMessage = {
  role: "user" | "assistant";
  content: string;
};

const ConversationDetail = ({ params }: { params: { cid: string } }) => {
  const { data, isLoading } = api.conversation.getById.useQuery({
    id: parseInt(params.cid),
  });
  return isLoading ? (
    <div>Loading...</div>
  ) : data ? (
    <div>
      <nav className="mx-auto max-w-6xl py-4">
        <BackLink />
      </nav>
      <div className="mx-auto my-6 max-w-4xl">
        <div>
          <EmotionChart emotionData={data.emotionalStats as EmotionData} />
        </div>
        <div className="flex h-64 flex-col gap-4 overflow-y-auto p-4">
          {data.chat.map((msgs, index) => {
            const msg = msgs as ConversationMessage;
            if (msg.role === "user" || msg.role === "assistant") {
              const isUser = msg.role === "user";
              return (
                <div
                  key={index}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      isUser
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <div className="mb-1 font-semibold">
                      {isUser ? "You" : "AI Assistant"}
                    </div>
                    <div>{msg.content}</div>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  ) : (
    <div>No Data</div>
  );
};

export default ConversationDetail;
