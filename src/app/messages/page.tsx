"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: number;
  content: string;
  timestamp: string;
}

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch("http://localhost:5001/messages");
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = async () => {
    if (message.trim()) {
      try {
        const newMessage = { content: message };
        const res = await fetch("http://localhost:5001/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newMessage),
        });

        if (!res.ok) throw new Error("Failed to send message");
        fetchMessages(); // Refresh messages after sending
        setMessage("");
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Direct Messages</h1>

      <div className="border p-4 h-64 overflow-y-auto">
        {messages.map((msg) => (
          <p key={msg.id} className="text-gray-800">
            {msg.content} <span className="text-xs text-gray-500">({new Date(msg.timestamp).toLocaleTimeString()})</span>
          </p>
        ))}
      </div>

      <Input
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="mt-2"
      />
      <Button onClick={sendMessage} className="mt-2 bg-blue-600 text-white">Send</Button>
      <Button onClick={() => router.push("/dashboard")} className="bg-gray-500 hover:bg-gray-600 text-white">
        Go Back
      </Button>
    </div>
  );
}

