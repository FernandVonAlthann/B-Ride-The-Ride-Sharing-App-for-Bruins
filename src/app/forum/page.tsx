"use client";

import { useState, useEffect } from "react";
import "./globals.css";
import { useRouter } from "next/navigation"; // Import router
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Thread {
  id: number;
  title: string;
  content: string;
  replies: string[];
  likes: number;
}

export default function Forum() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter(); // Initialize router
  
  useEffect(() => {
    const storedThreads = JSON.parse(localStorage.getItem("threads") || "[]");
    setThreads(storedThreads);
  }, []);

  const addThread = () => {
    if (title.trim() && content.trim()) {
      const newThread = { id: Date.now(), title, content, replies: [], likes: 0 };
      const updatedThreads = [...threads, newThread];
      setThreads(updatedThreads);
      localStorage.setItem("threads", JSON.stringify(updatedThreads));
      setTitle("");
      setContent("");
    }
  };

  const addReply = (id: number, reply: string) => {
    if (reply.trim()) {
      const updatedThreads = threads.map(thread =>
        thread.id === id ? { ...thread, replies: [...thread.replies, reply] } : thread
      );
      setThreads(updatedThreads);
      localStorage.setItem("threads", JSON.stringify(updatedThreads));
    }
  };

  const likeThread = (id: number) => {
    const updatedThreads = threads.map(thread =>
      thread.id === id ? { ...thread, likes: thread.likes + 1 } : thread
    );
    setThreads(updatedThreads);
    localStorage.setItem("threads", JSON.stringify(updatedThreads));
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Forum</h1>
      
      <Input placeholder="Thread Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Textarea placeholder="Thread Content" value={content} onChange={(e) => setContent(e.target.value)} className="mt-2" />
      <Button onClick={addThread} className="mt-2 bg-blue-600 text-white">Post Thread</Button>
      <Button onClick={() => router.push("/dashboard")} className="bg-gray-500 hover:bg-gray-600 text-white">
          Go Back
      </Button>
      <div className="mt-6">
        {threads.map(thread => (
          <div key={thread.id} className="border p-4 mb-4">
            <h2 className="text-xl font-bold">{thread.title}</h2>
            <p>{thread.content}</p>
            <Button onClick={() => likeThread(thread.id)} className="mt-2">❤️ {thread.likes}</Button>
            <div className="mt-2">
              <Input placeholder="Reply..." onKeyDown={(e) => {
                if (e.key === "Enter") addReply(thread.id, e.currentTarget.value);
              }} />
              <ul className="mt-2">
                {thread.replies.map((reply, idx) => <li key={idx} className="text-gray-600">{reply}</li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
