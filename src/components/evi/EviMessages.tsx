"use client";
import React from "react";
import { useVoice } from "@humeai/voice-react";

export default function EviMessages() {
  const { messages } = useVoice();

  return (
    <div className="flex h-64 flex-col gap-4 overflow-y-auto p-4">
      {messages.map((msg, index) => {
        if (msg.type === "user_message" || msg.type === "assistant_message") {
          const isUser = msg.message.role === "user";
          return (
            <div
              key={msg.type + index}
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
                <div>{msg.message.content}</div>
              </div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
