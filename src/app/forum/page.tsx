"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Reply {
  id: number;
  message: string;
  // add additional fields as needed (e.g. user_id, sent_at)
}

interface Thread {
  id: number;
  title: string;
  content: string;
  replies: Reply[];
  likes: number;
}

export default function Forum() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  // Fetch threads from the backend when the component mounts
  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    try {
      const res = await fetch('/api/threads');
      if (!res.ok) throw new Error("Failed to fetch threads");
      const data = await res.json();
      setThreads(data);
    } catch (error) {
      console.error("Error fetching threads:", error);
    }
  };

  const addThread = async () => {
    if (title.trim() && content.trim()) {
      try {
        const res = await fetch('/api/threads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content })
        });
        if (!res.ok) throw new Error("Failed to create thread");
        const newThread = await res.json();
        setThreads(prev => [...prev, newThread]);
        setTitle("");
        setContent("");
      } catch (error) {
        console.error("Error creating thread:", error);
      }
    }
  };

  const addReply = async (threadId: number, replyMessage: string) => {
    if (replyMessage.trim()) {
      try {
        const res = await fetch(`/api/threads/${threadId}/replies`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: replyMessage })
        });
        if (!res.ok) throw new Error("Failed to add reply");
        const updatedThread = await res.json();
        setThreads(prev =>
          prev.map(thread => (thread.id === threadId ? updatedThread : thread))
        );
      } catch (error) {
        console.error("Error adding reply:", error);
      }
    }
  };

  const likeThread = async (threadId: number) => {
    try {
      const res = await fetch(`/api/threads/${threadId}/like`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error("Failed to like thread");
      const updatedThread = await res.json();
      setThreads(prev =>
        prev.map(thread => (thread.id === threadId ? updatedThread : thread))
      );
    } catch (error) {
      console.error("Error liking thread:", error);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Forum</h1>

      <Input
        placeholder="Thread Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        placeholder="Thread Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="mt-2"
      />
      <Button onClick={addThread} className="mt-2 bg-blue-600 text-white">
        Post Thread
      </Button>
      <Button
        onClick={() => router.push("/dashboard")}
        className="bg-gray-500 hover:bg-gray-600 text-white ml-2"
      >
        Go Back
      </Button>

      <div className="mt-6">
        {threads.map((thread) => (
          <div key={thread.id} className="border p-4 mb-4">
            <h2 className="text-xl font-bold">{thread.title}</h2>
            <p>{thread.content}</p>
            <Button
              onClick={() => likeThread(thread.id)}
              className="mt-2"
            >
              ❤️ {thread.likes}
            </Button>
            <div className="mt-2">
              <Input
                placeholder="Reply..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addReply(thread.id, e.currentTarget.value);
                    e.currentTarget.value = "";
                  }
                }}
              />
              <ul className="mt-2">
                {thread.replies.map((reply) => (
                  <li key={reply.id} className="text-gray-600">
                    {reply.message}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
