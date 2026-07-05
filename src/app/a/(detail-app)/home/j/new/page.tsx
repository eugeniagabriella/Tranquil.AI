"use client";
import { Loader, SendHorizonal } from "lucide-react";
import * as React from "react";
import { useSearchParams } from "next/navigation";
import BackLink from "~/components/BackLink";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import {
  HumanMessage,
  AIMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { Progress } from "~/components/ui/progress";
import { toast } from "sonner";

const model = new ChatOpenAI({
  model: "gpt-4-turbo",
  temperature: 0,
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

interface ChatMessage {
  role: "human" | "ai";
  content: string;
}

const modeSteps = {
  reframingNegativeThought: [
    "Share a negative thought you're experiencing.",
    "What triggered this negative thought?",
    "How does this thought make you feel, and what is its impact?",
    "In what situations do you notice this thought impacting you the most?",
    "What evidence supports your negative thought?",
    "What evidence challenges this thought?",
    "How would it feel to let go of this negative thought?",
    "How can we turn this negative thought into something more positive?",
    "Let's suggest a new way of thinking about this situation.",
    "How does this new way of thinking make you feel?",
  ],
  savoringPositivity: [
    "Share a positive experience you've had recently.",
    "What emotions did you feel during this experience?",
    "What specific details do you remember about this experience?",
    "How did this experience impact your mood or outlook?",
    "Did you share this experience with anyone? If so, how did that feel?",
    "What aspects of this experience would you like to recreate in the future?",
    "How can you incorporate more moments like this into your daily life?",
    "What does this positive experience tell you about yourself or your life?",
    "How can you use this experience to boost your mood when you're feeling down?",
    "Take a moment to fully savor this positive experience. How do you feel now?",
  ],
  exposureHierarchy: [
    "Identify a fear or anxiety you'd like to work on.",
    "On a scale of 0-10, how anxious does this make you feel?",
    "Let's break this fear down into smaller, manageable steps. What would be the least anxiety-provoking situation related to this fear?",
    "What's a slightly more challenging situation related to this fear?",
    "Continue to list increasingly challenging situations related to this fear.",
    "For each situation, rate your anticipated anxiety level (0-10).",
    "Let's start with the least anxiety-provoking situation. How could you expose yourself to this safely?",
    "What coping strategies could you use during this exposure?",
    "How will you know when you're ready to move to the next step in the hierarchy?",
    "Remember, progress is gradual. How do you feel about starting this exposure process?",
  ],
};

type JournalMode = keyof typeof modeSteps;

const psychologistPrompts = {
  reframingNegativeThought: `You are a skilled psychologist specializing in cognitive behavioral therapy (CBT). Your role is to guide the user through a process of reframing negative thoughts. Respond with empathy, insight, and professionalism, always maintaining a supportive and non-judgmental tone. Keep your responses concise, aiming for 2 sentences maximum. Your goal is to help the user identify, challenge, and reframe their negative thoughts in a more balanced and constructive way.`,
  savoringPositivity: `You are a skilled positive psychologist. Your role is to guide the user through a process of savoring positive experiences. Respond with enthusiasm, curiosity, and warmth, encouraging the user to fully appreciate and extend their positive emotions. Keep your responses concise, aiming for 2 sentences maximum. Your goal is to help the user deepen their positive experiences and learn to integrate more positivity into their daily life.`,
  exposureHierarchy: `You are a skilled psychologist specializing in exposure therapy. Your role is to guide the user through creating and beginning to work through an exposure hierarchy for their fear or anxiety. Respond with empathy, encouragement, and professionalism, always maintaining a supportive and non-judgmental tone. Keep your responses concise, aiming for 2 sentences maximum. Your goal is to help the user break down their fear into manageable steps and begin the process of gradual exposure.`,
};

interface AnalysisResult {
  mood: string;
  keyTakeaway: string;
  affirmation: string;
  summary: string;
  actionableItems: string[];
}

const NewJournal = () => {
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode") as JournalMode;

  const [currentMode, setCurrentMode] = React.useState<JournalMode>(
    modeParam && modeParam in modeSteps
      ? modeParam
      : "reframingNegativeThought",
  );
  const steps = modeSteps[currentMode];

  const [input, setInput] = React.useState("");
  const [chatHistory, setChatHistory] = React.useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isFinished, setIsFinished] = React.useState(false);
  const chatContainerRef = React.useRef<HTMLDivElement>(null);

  const { mutateAsync, isPending } = api.journal.create.useMutation({
    onSuccess: (result) => {
      toast("New Journal Added");
      router.replace(`/a/home/j/${result.id}`);
    },
    onMutate: () => {
      setIsLoading(true);
    },
  });
  const router = useRouter();

  React.useEffect(() => {
    const newMode = searchParams.get("mode") as JournalMode;
    if (
      newMode &&
      newMode in modeSteps &&
      newMode !== currentMode &&
      chatHistory.length < 1
    ) {
      setCurrentMode(newMode);
      setCurrentStep(0);
      setChatHistory([]);
    }
    if (newMode && !(newMode in modeSteps) && chatHistory.length < 1) {
      // toast("Invalid Mode");
      setCurrentMode("reframingNegativeThought");
      router.replace("/a/home/j/new");
    }
  }, [searchParams]);

  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  React.useEffect(() => {
    if (chatHistory.length === 0) {
      setChatHistory([{ role: "ai", content: steps[0]! }]);
    }
  }, [currentMode, steps]);

  const sendMessage = async () => {
    if (input.trim() === "") return;
    setIsLoading(true);

    const newHumanMessage: ChatMessage = { role: "human", content: input };
    setChatHistory((prev) => [...prev, newHumanMessage]);

    try {
      const messages = [
        new SystemMessage(psychologistPrompts[currentMode]),
        ...chatHistory.map((msg) =>
          msg.role === "human"
            ? new HumanMessage(msg.content)
            : new AIMessage(msg.content),
        ),
        new HumanMessage(input),
      ];

      const nextStep = currentStep + 1;
      let prompt = "";
      if (nextStep < steps.length) {
        prompt = `Based on the user's response "${input}" to the question "${steps[currentStep]}", provide a thoughtful and empathetic response. Then, ask the next question: "${steps[nextStep]}". Adjust the question if needed based on previous responses.`;
      } else {
        prompt = `This concludes our ${currentMode} exercise. Provide a brief 1 sentence summary of the conversation and offer encouragement to the user.`;
      }

      const response = await model.invoke([
        ...messages,
        new HumanMessage(prompt),
      ]);
      const aiContent =
        typeof response.content === "string"
          ? response.content
          : JSON.stringify(response.content);

      const newAIMessage: ChatMessage = { role: "ai", content: aiContent };
      setChatHistory((prev) => [...prev, newAIMessage]);

      if (nextStep < steps.length) {
        setCurrentStep(nextStep);
      } else if (nextStep == steps.length) {
        setIsFinished(true);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setIsLoading(false);
    setInput("");
  };

  const finishedJournaling = async () => {
    const promptForAnalysis = `
    Based on the following ${currentMode} chat history, please provide:
    1. The user's mood (choose from: happy, anxious, sad, angry, confused)
    2. A key takeaway from the conversation which the user can learn from
    3. A word of affirmation for the user
    4. A summary of the user's condition (for their psychologist)
    5. 3 actionable items the user can do

    Chat history:
    ${chatHistory.map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`).join("\n")}

    Please format your response as a JSON object with the following structure:
    {
      "mood": string,
      "keyTakeaway": string,
      "affirmation": string,
      "summary": string,
      "actionableItems": [string, string, string]
    }
  `;

    try {
      const response = await model.invoke([
        new SystemMessage(psychologistPrompts[currentMode]),
        new HumanMessage(promptForAnalysis),
      ]);

      const analysisResult = JSON.parse(
        response.content as string,
      ) as AnalysisResult;

      await mutateAsync({
        actionableItems: analysisResult.actionableItems,
        wordAffirmation: analysisResult.affirmation,
        keyTakeaway: analysisResult.keyTakeaway,
        mood: analysisResult.mood,
        summary: analysisResult.summary,
        chat: chatHistory,
        type: "CBT",
        // type: currentMode.toUpperCase(),
      });
    } catch (error) {
      console.error("Error analyzing chat history:", error);
    }
  };

  return (
    <div className="min-h-screen">
      <nav className="mx-auto max-w-6xl px-2 py-5">
        <BackLink />
      </nav>
      <div className="mx-auto max-w-2xl rounded-md border-[1.4px] border-gray-200 p-4">
        <div className="w-full bg-white">
          <h1 className="text-lg font-semibold">
            {currentMode === "reframingNegativeThought" &&
              "Reframing Negative Thoughts Journal"}
            {currentMode === "savoringPositivity" &&
              "Savoring Positivity Journal"}
            {currentMode === "exposureHierarchy" &&
              "Exposure Hierarchy Journal"}
            {" - "}
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </h1>
          <Separator className="mt-3" />
          <Progress
            value={isFinished ? 100 : (currentStep / steps.length) * 100}
            className="mb-3 h-2 text-indigo-600"
          />
          <div ref={chatContainerRef} className="mb-4 h-72 overflow-y-auto">
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 ${msg.role === "ai" ? "font-medium text-indigo-600" : ""}`}
              >
                {msg.content} {msg.role === "ai" ? "🤗" : ""}
              </div>
            ))}
            {isFinished ? null : (
              <Textarea
                value={input}
                disabled={isFinished}
                onChange={(ev) => setInput(ev.target.value)}
                className="flex-grow border-none outline-none ring-0 focus:border-none focus:outline-none"
                placeholder="Share your thoughts here..."
              />
            )}
          </div>
          <Separator className="mb-5 mt-3" />
          <div className="flex items-center gap-3">
            <Button
              onClick={isFinished ? finishedJournaling : sendMessage}
              disabled={
                (input.trim() === "" && !isFinished) || isLoading || isPending
              }
              className={`flex gap-3 text-lg ${
                (input.trim() === "" && !isFinished) || isLoading
                  ? "bg-gray-400"
                  : "bg-indigo-600"
              } ${isFinished ? "w-full" : ""}`}
            >
              {isPending ? (
                <p>Adding Data...</p>
              ) : (
                <p>{isFinished ? "Finish Journal" : "Send"}</p>
              )}
              {isPending ? (
                <Loader className="animate-spin" />
              ) : (
                <SendHorizonal />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewJournal;
