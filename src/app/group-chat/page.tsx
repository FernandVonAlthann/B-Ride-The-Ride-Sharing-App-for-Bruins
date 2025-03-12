"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
}

export default function GroupChat() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sender, setSender] = useState("Anonymous");

  // Function to load messages from the API.
  const loadMessages = async () => {
    try {
      const res = await fetch("/api/group-chat", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch group chat messages");
      const data = await res.json();
      // Assuming the API returns { messages: Message[] }
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Error fetching group chat messages:", error);
    }
  };

  // Load messages on mount and set up polling every 3 seconds.
  useEffect(() => {
    loadMessages();
    const interval = setInterval(() => {
      loadMessages();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;
    try {
      const messagePayload = {
        sender,
        content: newMessage,
      };
      const res = await fetch("/api/group-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messagePayload),
      });
      if (!res.ok) throw new Error("Failed to send message");
      // Optionally, you can use the response to update messages,
      // or simply re-fetch messages.
      await loadMessages();
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#2563EB] to-[#020B3B] p-6">
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">B-Ride Group Chat</h1>
          <p className="text-blue-200">Connect with other Bruins in real-time</p>
        </div>
        
        <Card className="bg-white/95 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] text-white">
            <CardTitle className="text-center text-2xl font-bold">Group Chat</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4 p-6">
            {/* Chat messages container */}
            <div className="h-80 overflow-y-auto border border-blue-100 p-4 rounded-xl bg-white/80">
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <div key={msg.id} className="mb-4 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center mb-1">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                        <span className="text-blue-600 font-bold">{msg.sender.charAt(0).toUpperCase()}</span>
                      </div>
                      <p className="font-semibold text-blue-800">{msg.sender}</p>
                      <span className="text-xs text-gray-500 ml-auto">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="pl-10 text-gray-700">{msg.content}</p>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center">
                  <p className="text-center text-gray-500 mb-2">No messages yet.</p>
                  <p className="text-center text-gray-400 text-sm">Be the first to start the conversation!</p>
                </div>
              )}
            </div>
            
            {/* Input fields for name and new message */}
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-bold">{sender.charAt(0).toUpperCase()}</span>
                </div>
                <Input
                  type="text"
                  placeholder="Your Name"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  className="flex-1 border-blue-200 focus:ring-blue-500 rounded-full"
                />
              </div>
              
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1 border-blue-200 focus:ring-blue-500 rounded-full"
                />
                <Button
                  className="bg-gradient-to-r from-[#0F172A] to-[#1E40AF] hover:from-[#172554] hover:to-[#2563EB] text-white shadow-md rounded-full"
                  onClick={sendMessage}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6 flex justify-center">
          <button
            className="px-6 py-1.5 bg-gradient-to-r from-[#172554] to-[#2563eb] text-white shadow-md rounded-full flex items-center gap-2"
            onClick={() => router.push("/dashboard")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

