import { ChevronDown } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { api, type RouterOutputs } from "~/trpc/react";

type Task = {
  id: number;
  task: string;
  points: number;
  isDone: boolean;
  dateCompleted: Date | null;
};

const Task = () => {
  const {
    data: completed,
    isLoading: isLoadingCompleted,
    refetch: refetchCompleted,
  } = api.task.getCompletedTask.useQuery();
  const {
    data: uncompleted,
    isLoading: isLoadingUncompleted,
    refetch: refetchUncompleted,
  } = api.task.getUncompletedTask.useQuery();

  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-xl font-bold">Your Task:</h1>
      {isLoadingUncompleted ? (
        <div className="flex items-center justify-center">
          <p className="font-medium text-gray-600">Getting data...</p>
        </div>
      ) : uncompleted != undefined && uncompleted.length > 0 ? (
        <div>
          {uncompleted.map((t) => (
            <TaskCard
              key={t.id}
              id={t.id}
              isDone={false}
              dateCompleted={null}
              points={1}
              task={t.description}
              refetchTasks={async () => {
                await refetchCompleted();
                await refetchUncompleted();
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-sm font-medium text-gray-500">No Task Yet</div>
      )}
      <Collapsible className="">
        <CollapsibleTrigger className="mt-3 flex w-full items-center justify-between rounded-sm hover:bg-gray-200">
          <h2 className="text-sm font-medium text-gray-700">
            {isLoadingCompleted ? "Getting task..." : "See Completed Task"}
          </h2>
          <ChevronDown size={16} className="text-gray-700" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-1">
            {isLoadingCompleted ? (
              <div className="flex items-center justify-center">
                <div className="flex h-10 w-10 animate-pulse items-center justify-center rounded-full border-2 border-gray-200">
                  Loading...
                </div>
              </div>
            ) : completed != undefined && completed.length > 0 ? (
              completed.map((t) => (
                <TaskCard
                  key={t.id}
                  isDone={t.dateCompleted == null ? false : true}
                  id={t.id}
                  points={1}
                  task={t.description}
                  dateCompleted={t.dateCompleted}
                  refetchTasks={async () => {
                    await refetchCompleted();
                    await refetchUncompleted();
                  }}
                />
              ))
            ) : (
              <div className="text-sm font-medium text-gray-500">
                No Completed Task Yet
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

const TaskCard = (t: Task & { refetchTasks: () => void }) => {
  const { mutateAsync: completeTask } = api.task.completeTask.useMutation({
    onSuccess: () => {
      toast("Task Completed");
      t.refetchTasks();
    },
    onError: () => {
      toast("Task Complete Failed");
    },
  });
  const { mutateAsync: uncompleteTask } = api.task.unCompleteTask.useMutation({
    onSuccess: () => {
      toast("Task Uncompleted");
      t.refetchTasks();
    },
    onError: () => {
      toast("Task Uncomplete Failed");
    },
  });

  const complete = async (id: number) => {
    await completeTask({ id });
  };

  const uncomplete = async (id: number) => {
    await uncompleteTask({ id });
  };

  return (
    <div
      key={t.id}
      className={`flex justify-between border-b-[1.3px] border-gray-300 pb-2 pr-3 pt-1 ${t.isDone ? "text-gray-500 line-through" : ""}`}
    >
      <div>
        <h2
          className={`font-semibold ${t.isDone ? "text-gray-500" : "text-indigo-700"}`}
        >
          {t.task}
        </h2>
        <p className="text-sm font-medium text-gray-700">Point: {t.points}</p>
      </div>
      <div className="pt-1">
        <Checkbox
          checked={t.isDone}
          onClick={() => (t.isDone ? uncomplete(t.id) : complete(t.id))}
        />
      </div>
    </div>
  );
};

export default Task;
