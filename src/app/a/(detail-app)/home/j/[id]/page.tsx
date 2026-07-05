"use client";
import { ArrowRight, Loader2 } from "lucide-react";
import React from "react";
import BackLink from "~/components/BackLink";
import { Separator } from "~/components/ui/separator";
import { dateConverterCreatedAt, getEmojiForMood } from "~/lib/helper";
import { api } from "~/trpc/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { toast } from "sonner";

export interface ChatMessage {
  role: "ai" | "human";
  content: string;
}

const DetailJournal = ({ params }: { params: { id: string } }) => {
  const { data, isLoading, refetch } = api.journal.getById.useQuery({
    id: parseInt(params.id),
  });
  const chatData = data?.chat as ChatMessage[] | undefined;

  const {
    mutateAsync: acceptTaskMutation,
    isPending,
    isSuccess,
  } = api.task.acceptTask.useMutation({
    onMutate: async () => {
      toast("Accepting Task...");
    },
    onSuccess: async () => {
      toast("Task Accepted");
      await refetch();
    },
    onError: () => {
      toast("Task Accept Failed");
    },
  });

  const acceptTask = async (id: number) => {
    await acceptTaskMutation({ id });
    // toast("Adding Task...");
    // if (isSuccess) {
    //   toast("Task Added");
    // }
  };

  // console.log(data);
  return (
    <div>
      <nav className="mx-auto max-w-6xl px-2 py-5">
        <BackLink />
      </nav>
      {isLoading ? (
        <div className="mx-auto my-24 flex max-w-2xl flex-col items-center justify-center rounded-md">
          <Loader2 size="64" className="animate-spin" />
          <p>Getting Your Journal</p>
        </div>
      ) : (
        <main className="mx-auto max-w-2xl rounded-md border-[1.4px] border-gray-200 p-4">
          <div className="w-full bg-white">
            <div className="flex flex-col gap-2">
              <h1 className="text-lg font-semibold">{data?.keyTakeaway}</h1>
              <h6 className="w-fit rounded-lg bg-indigo-600 px-4 py-1 font-medium text-white">
                {dateConverterCreatedAt(data ? data.date : new Date())}
              </h6>
            </div>
            <Tabs defaultValue="analytics" className="mt-3 w-full">
              <TabsList>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
              </TabsList>
              <Separator className="mt-1" />
              <TabsContent value="analytics">
                <div className="mb-3 flex flex-col gap-4">
                  <div>
                    <h5 className="text-sm font-bold uppercase text-indigo-600">
                      Key Takeaway 🔍
                    </h5>
                    <h6 className="text-lg font-medium">{data?.keyTakeaway}</h6>
                  </div>
                  <div>
                    <h5 className="text-sm font-bold uppercase text-indigo-600">
                      Word Affirmations ✨
                    </h5>
                    <h6 className="text-lg font-medium">
                      {data?.wordAffirmation}
                    </h6>
                  </div>
                  <div>
                    <h5 className="text-sm font-bold uppercase text-indigo-600">
                      Your Mood 🤔
                    </h5>
                    <h6 className="mt-1 flex w-fit gap-1 rounded-md bg-indigo-300 px-3 py-1 font-medium text-indigo-950">
                      <p>{getEmojiForMood(data ? data.mood : "neutral")}</p>
                      <p>{data?.mood}</p>
                    </h6>
                  </div>
                  <div>
                    <h5 className="text-sm font-bold uppercase text-indigo-600">
                      Your ToDos 🗒️
                    </h5>
                    <div className="mt-2 flex flex-col gap-3 font-medium">
                      {data?.tasks.map((task) => (
                        <div
                          key={task.id}
                          className="grid grid-cols-12 items-center justify-between gap-4 border-b-[1.2px] border-b-gray-300 pb-2"
                        >
                          <h6 className="col-span-9">{task.description}</h6>
                          <div className="col-span-3 ml-auto flex w-fit items-end justify-end rounded px-2 py-1 text-end text-sm hover:bg-gray-200">
                            {task.accepted ? (
                              <p className="text-gray-700">Already Accepted</p>
                            ) : (
                              <button
                                onClick={() => acceptTask(task.id)}
                                className="flex items-center justify-end gap-1 font-medium text-indigo-600"
                              >
                                <p>Add to Task</p>
                                <ArrowRight size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="chat">
                <div className="mb-4 h-72 overflow-y-auto">
                  {chatData != null ? (
                    chatData.map((msg, index) => (
                      <div
                        key={index}
                        className={`mb-2 ${msg.role === "ai" ? "font-medium text-indigo-600" : ""}`}
                      >
                        {msg.content} {msg.role === "ai" ? "🤗" : ""}
                      </div>
                    ))
                  ) : (
                    <div>No Data Chat</div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      )}
    </div>
  );
};

export default DetailJournal;
