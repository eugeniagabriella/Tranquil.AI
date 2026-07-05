// ./app/page.tsx
import { fetchAccessToken } from "@humeai/voice";
import BackLink from "~/components/BackLink";
import EviVoice from "~/components/evi/EviVoice";

export default async function Page() {
  const accessToken = await fetchAccessToken({
    apiKey: String(process.env.HUME_API_KEY),
    secretKey: String(process.env.HUME_SECRET_KEY),
  });

  // const client = new HumeClient({ apiKey: process.env.HUME_API_KEY });
  // const socket = await client.empathicVoice.chat.connect({
  //   configId: "e7875550-2a44-4b0a-9ca6-08a9b211b52c"
  // });

  // const emotionScores = await TranscriptModelsSchema

  // // const chats = await client.empathicVoice.chats.listChats();
  // // console.log(chats);
  // const chatsEvent = await client.empathicVoice.chats.listChatEvents(
  //   "fda93b0d-32f9-445a-a6d4-013dde871910",
  // );
  // console.log(chats.chatsPage[0]?.config);
  // console.log("========================= CHATS =========================");
  // console.log(chats);
  // console.log(
  //   "========================= chats events ==============================",
  // );
  // console.log(chatsEvent);

  if (!accessToken) {
    throw new Error();
  }

  return (
    <div>
      <nav className="mx-auto max-w-6xl py-4">
        <BackLink />
      </nav>
      <EviVoice accessToken={accessToken} />;
    </div>
  );
}
