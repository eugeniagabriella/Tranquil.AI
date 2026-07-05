"use client";
import { useVoice, VoiceReadyState } from "@humeai/voice-react";
import { useRouter } from "next/navigation";
import { disconnect } from "process";
import React from "react";
import { toast } from "sonner";
import { EmotionChart } from "~/components/EmotionChart";
import EviMessages from "~/components/evi/EviMessages";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
type EmotionData = Record<string, number>;

export default function EviControl() {
  const router = useRouter();
  const {
    connect,
    readyState,
    messages,
    sendPauseAssistantMessage,
    mute,
    disconnect,
  } = useVoice();

  const [cumulativeEmotions, setCumulativeEmotions] =
    React.useState<EmotionData>({});

  const { mutateAsync, isPending } = api.conversation.create.useMutation({
    onSuccess: (data) => {
      toast("Conversation Created");
      toast("Redirecting...");
      disconnect();
      router.replace(`/a/conversations/${data.id}`);
    },
    onMutate: () => {
      toast("Creating Conversation...");
    },
  });

  React.useEffect(() => {
    const newCumulativeEmotions: EmotionData = {};

    messages.forEach((msg) => {
      if (msg.type === "user_message" && msg.models.prosody?.scores) {
        Object.entries(msg.models.prosody.scores).forEach(
          ([emotion, value]) => {
            newCumulativeEmotions[emotion] =
              (newCumulativeEmotions[emotion] ?? 0) + value;
          },
        );
      }
    });

    // Normalize the values
    const totalValue = Object.values(newCumulativeEmotions).reduce(
      (sum, value) => sum + value,
      0,
    );
    Object.keys(newCumulativeEmotions).forEach((emotion) => {
      newCumulativeEmotions[emotion]! /= totalValue;
    });

    setCumulativeEmotions(newCumulativeEmotions);
  }, [messages]);

  const endSession = async () => {
    sendPauseAssistantMessage();
    mute();
    console.log(cumulativeEmotions);
    const messageJson = messages
      .filter(
        (msg) =>
          msg.type === "user_message" || msg.type === "assistant_message",
      )
      .map((msg) => ({
        role: msg.message.role,
        content: msg.message.content,
      }));

    await mutateAsync({
      chat: messageJson,
      mode: "CBT",
      emotionalStats: cumulativeEmotions,
      // emotionData: cumulativeEmotions,
    });

    console.log(messageJson);
    // muteAudio();

    // disconnect();
  };

  return (
    <div className="my-3 flex flex-col gap-2">
      <div className="col-span-2 h-56 w-full overflow-y-auto rounded-md border-[1.2px] border-gray-300 p-4">
        {Object.keys(cumulativeEmotions).length == 0 ? (
          <div className="flex w-full items-center text-center text-lg font-medium text-gray-500">
            No Data
          </div>
        ) : (
          Object.keys(cumulativeEmotions).length > 0 && (
            <EmotionChart emotionData={cumulativeEmotions} />
          )
        )}
      </div>
      {/* <div className="h-48"> */}
      <EviMessages />
      {/* </div> */}
      <div className="col-span-3">
        {readyState === VoiceReadyState.OPEN ? (
          <Button className="w-full bg-red-600" onClick={endSession}>
            End Session
          </Button>
        ) : (
          <Button
            className="w-full"
            onClick={() => {
              connect()
                .then(() => {
                  /* handle success */
                })
                .catch(() => {
                  /* handle error */
                });
            }}
          >
            Start Session
          </Button>
        )}
      </div>
    </div>
  );
}
