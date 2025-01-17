import Team from "@/src/components/Team";
import { FullScreen } from "@tsparticles/engine";
import {
    Chat,
    Channel,
    ChannelList,
    Window,
    ChannelHeader,
    MessageList,
    MessageInput,
    Thread,
    useCreateChatClient,
  } from "stream-chat-react";
  import "stream-chat-react/dist/css/v2/index.css";

  export default async function Page({params}){
    const slug = (await params).slug;
    return (
      <div className="w-full h-full">
        <Team slug={slug}/>
      </div>
    );
  }