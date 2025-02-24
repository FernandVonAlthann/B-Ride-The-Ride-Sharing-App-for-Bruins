"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: number;
  message: string;
  // Optionally, add sender, timestamp, etc.
}

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Fetch messages from the API on mount.
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/messages", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (message.trim()) {
      try {
        const res = await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        });
        if (!res.ok) throw new Error("Failed to send message");
        // Option 1: Re-fetch messages after sending.
        await fetchMessages();
        // Option 2: If the API returns the newly created message, you can also do:
        // const newMessage = await res.json();
        // setMessages((prev) => [...prev, newMessage]);
        setMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Direct Messages</h1>

      <div className="border p-4 h-64 overflow-y-auto">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <p key={msg.id} className="text-gray-800">
              {msg.message}
            </p>
          ))
        ) : (
          <p className="text-gray-600">No messages yet.</p>
        )}
      </div>

      <Input
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="mt-2"
      />
      <Button onClick={sendMessage} className="mt-2 bg-blue-600 text-white">
        Send
      </Button>
      <Button
        onClick={() => router.push("/dashboard")}
        className="bg-gray-500 hover:bg-gray-600 text-white mt-2"
      >
        Go Back
      </Button>
    </div>
  );
}
