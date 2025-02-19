"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
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
  const [loading, setLoading] = useState(false);
  const router = useRouter(); 

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/threads");
      if (!res.ok) throw new Error("Failed to fetch threads");
      const data = await res.json();
      setThreads(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addThread = async () => {
    if (title.trim() && content.trim()) {
      try {
        const newThread = { title, content, replies: [], likes: 0 };
        const res = await fetch("http://localhost:5001/threads/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newThread),
        });

        if (!res.ok) throw new Error("Failed to add thread");
        fetchThreads();
        setTitle("");
        setContent("");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const addReply = async (id: number, reply: string, inputElement: HTMLInputElement) => {
    if (reply.trim()) {
      try {
        const res = await fetch(`http://localhost:5001/threads/${id}/reply`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reply }),
        });

        if (!res.ok) throw new Error("Failed to add reply");
        fetchThreads();
        inputElement.value = ""; // Clear input after submitting
      } catch (error) {
        console.error(error);
      }
    }
  };

  const likeThread = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:5001/threads/${id}/like`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to like thread");
      fetchThreads();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Forum</h1>
      
      <Input placeholder="Thread Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Textarea placeholder="Thread Content" value={content} onChange={(e) => setContent(e.target.value)} className="mt-2" />
      <Button onClick={addThread} className="mt-2 bg-blue-600 text-white">Post Thread</Button>
      <Button onClick={() => router.push("/dashboard")} className="ml-2 bg-gray-500 hover:bg-gray-600 text-white">
          Go Back
      </Button>

      {loading ? (
        <p className="mt-4 text-gray-600">Loading threads...</p>
      ) : (
        <div className="mt-6">
          {threads.map(thread => (
            <div key={thread.id} className="border p-4 mb-4 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold">{thread.title}</h2>
              <p className="text-gray-700">{thread.content}</p>
              <Button onClick={() => likeThread(thread.id)} className="mt-2">❤️ {thread.likes}</Button>
              
              <div className="mt-4">
                <Input 
                  placeholder="Reply..." 
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addReply(thread.id, e.currentTarget.value, e.currentTarget);
                  }} 
                />
                <ul className="mt-2 border-l-4 border-gray-300 pl-4">
                  {thread.replies.map((reply, idx) => (
                    <li key={idx} className="text-gray-600 bg-gray-100 p-2 rounded-md my-1">{reply}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
