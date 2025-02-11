"use client";

import { useState, useEffect } from "react";
import "./globals.css";
import { useRouter } from "next/navigation"; // Import router
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Messages() {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const router = useRouter(); // Initialize router
  
  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem("messages") || "[]");
    setMessages(storedMessages);
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const updatedMessages = [...messages, message];
      setMessages(updatedMessages);
      localStorage.setItem("messages", JSON.stringify(updatedMessages));
      setMessage("");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Direct Messages</h1>

      <div className="border p-4 h-64 overflow-y-auto">
        {messages.map((msg, idx) => <p key={idx} className="text-gray-800">{msg}</p>)}
      </div>

      <Input placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)} className="mt-2" />
      <Button onClick={sendMessage} className="mt-2 bg-blue-600 text-white">Send</Button>
      <Button onClick={() => router.push("/dashboard")} className="bg-gray-500 hover:bg-gray-600 text-white">
          Go Back
      </Button>
    </div>
  );
}
