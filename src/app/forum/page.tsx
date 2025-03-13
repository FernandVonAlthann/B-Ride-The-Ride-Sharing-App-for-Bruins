"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const [activeThread, setActiveThread] = useState<number | null>(null);
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
          body: JSON.stringify({ title, content, creator_id: 1 })
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

  const toggleThread = (threadId: number) => {
    if (activeThread === threadId) {
      setActiveThread(null);
    } else {
      setActiveThread(threadId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2563EB] to-[#020B3B] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">B-Ride Community Forum</h1>
          <p className="text-blue-200">Connect with other Bruins and share your thoughts</p>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden mb-6">
          <CardHeader className="bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] rounded-[15px] text-white">
            <CardTitle className="p-3 text-center text-2xl font-bold">Create New Thread</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Input
              placeholder="Thread Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-blue-200 focus:ring-blue-500 rounded-md mb-3"
            />
            <Textarea
              placeholder="Share your thoughts, questions, or ideas with the community..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="border-blue-200 focus:ring-blue-500 rounded-md h-24 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={addThread}
                className="flex-1 bg-gradient-to-r from-[#0F172A] to-[#1E40AF] hover:from-[#172554] hover:to-[#2563EB] text-white shadow-md rounded-full py-2 text-sm font-medium transition-all"
              >
                Post Thread
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="px-6 py-1.5 bg-gradient-to-r from-[#172554] to-[#2563eb] text-white shadow-md rounded-full flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                Back to Dashboard
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {threads.length > 0 ? (
            threads.map((thread) => (
              <Card key={thread.id} className="bg-white/95 backdrop-blur-sm shadow-md rounded-xl overflow-hidden">
                <div 
                  className="p-4 cursor-pointer hover:bg-blue-50/50 transition-colors"
                  onClick={() => toggleThread(thread.id)}
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-blue-900">{thread.title}</h2>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        likeThread(thread.id);
                      }}
                      className="flex items-center gap-1 px-3 py-1 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-full text-sm transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={thread.likes > 0 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                      {thread.likes}
                    </button>
                  </div>
                  <p className="text-gray-600 mt-2">{thread.content}</p>
                </div>
                
                {activeThread === thread.id && (
                  <div className="border-t border-blue-100 p-4 bg-blue-50/50">
                    <div className="mb-4">
                      <Input
                        placeholder="Add a reply..."
                        className="border-blue-200 focus:ring-blue-500 rounded-full"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            addReply(thread.id, e.currentTarget.value);
                            e.currentTarget.value = "";
                          }
                        }}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      {thread.replies?.length > 0 ? (
                        thread.replies.map((reply) => (
                          <div key={reply.id} className="bg-white p-3 rounded-lg shadow-sm">
                            <p className="text-gray-700">{reply.message}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-gray-500">No replies yet.</p>
                          <p className="text-gray-400 text-sm">Be the first to reply to this thread!</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            ))
          ) : (
            <Card className="bg-white/95 backdrop-blur-sm shadow-md rounded-xl overflow-hidden">
              <div className="p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-blue-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No threads yet</h3>
                <p className="text-gray-500">Be the first to start a conversation!</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

