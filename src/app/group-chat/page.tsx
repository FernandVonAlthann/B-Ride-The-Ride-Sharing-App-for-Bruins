"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const [sender, setSender] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();

    const interval = setInterval(() => {
      fetchMessages();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Fetch messages from the backend
  const fetchMessages = async () => {
    try {
      const res = await fetch("http://localhost:5001/groupchat");
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Send message to the backend
  const sendMessage = async () => {
    if (newMessage.trim() === "") return;
    
    const message = {
      sender: sender.trim() || "Anonymous",
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch("http://localhost:5001/groupchat/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      });

      if (!res.ok) throw new Error("Failed to send message");

      fetchMessages(); // Refresh messages after sending
      setNewMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 text-black">
      <Card className="w-full max-w-2xl bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Group Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <div className="h-80 overflow-y-auto border p-4 rounded-md">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div key={msg.id} className="mb-2">
                  <p className="font-semibold">{msg.sender}:</p>
                  <p>{msg.content}</p>
                  <span className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No messages yet.</p>
            )}
            <div ref={messagesEndRef}></div>
          </div>
          <div className="flex flex-col space-y-2">
            <Input
              type="text"
              placeholder="Your Name"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={sendMessage}>
              Send Message
            </Button>
          </div>
        </CardContent>
      </Card>
      <Button className="mt-6 bg-gray-500 hover:bg-gray-600 text-white" onClick={() => router.push("/dashboard")}>
        Back to Dashboard
      </Button>
    </div>
  );
}
