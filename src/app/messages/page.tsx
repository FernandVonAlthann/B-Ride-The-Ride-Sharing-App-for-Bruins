"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface Message {
  id: number;
  message: string;
  sender_id: number;
  receiver_id: number;
  sent_at: string;
  ride_id?: number | null;
}

interface Recipient {
  id: number;
  name: string;
}

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState<number | null>(
    null
  );
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [user, setUser] = useState<{ id?: number; name?: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    fetchRecipients();
  }, []);

  useEffect(() => {
    if (selectedRecipient) {
      fetchMessages(selectedRecipient);
    }

    
    const interval = setInterval(() => {
      if (selectedRecipient) {
        fetchMessages(selectedRecipient);
      }
    }, 3000);

    return () => clearInterval(interval); 
  }, [selectedRecipient]);

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async (recipientId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("http://localhost:5001/api/messages", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        console.error("Failed to fetch messages");
        return;
      }

      const data = await response.json();

      //  Ensure both sent & received messages are included
      const filteredMessages = data.messages.filter(
        (m: Message) =>
          (m.sender_id === recipientId && m.receiver_id === user.id) ||
          (m.sender_id === user.id && m.receiver_id === recipientId)
      );


      filteredMessages.sort(
        (a: Message, b: Message) =>
          new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime()
      );

      setMessages(filteredMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecipients = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("http://localhost:5001/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        console.error("Failed to fetch recipients");
        return;
      }

      const data = await response.json();
      setRecipients(data.users);
    } catch (error) {
      console.error("Error fetching recipients:", error);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !selectedRecipient || !user.id) {
      console.error("Missing required fields:", {
        messageText,
        selectedRecipient,
        userId: user.id,
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");

    
      const tempMessage: Message = {
        id: Math.random(), // Temporary ID
        message: messageText,
        sender_id: user.id,
        receiver_id: selectedRecipient,
        sent_at: new Date().toISOString(),
        ride_id: null,
      };

      setMessages((prevMessages) => [...prevMessages, tempMessage]);

      setMessageText("");

      const response = await fetch("http://localhost:5001/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          senderId: user.id,
          receiverId: selectedRecipient,
          rideId: null, // Optional
          message: messageText,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

     
      setTimeout(() => {
        fetchMessages(selectedRecipient);
      }, 1000);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getRecipientName = (id: number) => {
    const recipient = recipients.find((r) => r.id === id);
    return recipient ? recipient.name : "Unknown User";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4D9FFF] to-[#020B3B] p-6 flex flex-col">
      {/* Back to Dashboard Button */}
      <Button 
        className="self-start mb-6 bg-[#172554] hover:bg-[#1E3A8A] text-white shadow-md rounded-full px-6 py-2 flex items-center gap-2"
        onClick={() => router.push("/dashboard")}
      >
        ← Back to Dashboard
      </Button>

      <Card className="w-full max-w-5xl mx-auto bg-white/90 backdrop-blur-sm text-gray-900 shadow-xl rounded-2xl border-t border-white/50">
        <CardHeader className="bg-gradient-to-r from-[#4D9FFF] to-[#2563EB] text-white rounded-t-2xl p-6">
          <CardTitle className="text-center text-2xl font-bold">
            Messages {selectedRecipient ? `- ${getRecipientName(selectedRecipient)}` : ""}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 h-[70vh]">
            {/* Recipients List */}
            <div className="border-r border-gray-200 overflow-y-auto">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">
                  Conversations
                </h3>
              </div>
              <div className="overflow-y-auto max-h-[calc(70vh-60px)]">
                {recipients.length > 0 ? (
                  recipients.map((person) => (
                    <div
                      key={person.id}
                      className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${
                        selectedRecipient === person.id
                          ? "bg-[#4D9FFF]/10 border-l-4 border-[#4D9FFF]"
                          : "hover:bg-gray-50 border-l-4 border-transparent"
                      }`}
                      onClick={() => setSelectedRecipient(person.id)}
                    >
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                        {person.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{person.name}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No conversations yet
                  </div>
                )}
              </div>
            </div>

            {/* Messages Section */}
            <div className="col-span-2 flex flex-col h-full">
              {selectedRecipient ? (
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(70vh-120px)]">
                    {messages.length > 0 ? (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender_id === user.id
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[70%] p-3 rounded-lg ${
                              message.sender_id === user.id
                                ? "bg-[#4D9FFF] text-white"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            <p>{message.message}</p>
                            <p className={`text-xs mt-1 ${
                              message.sender_id === user.id
                                ? "text-white/70"
                                : "text-gray-500"
                            }`}>
                              {formatDate(message.sent_at)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center text-gray-500">
                          <div className="bg-[#4D9FFF]/10 p-4 rounded-full inline-block mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4D9FFF]">
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                          </div>
                          <p>No messages yet</p>
                          <p className="text-sm">Start the conversation!</p>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="p-4 border-t border-gray-200 bg-white/50">
                    <div className="flex gap-2">
                      <Input
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4D9FFF]"
                      />
                      <Button
                        className="bg-[#E6B400] hover:bg-[#D9A900] text-black font-medium px-6 py-2 rounded-full"
                        onClick={sendMessage}
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <div className="bg-[#4D9FFF]/10 p-4 rounded-full inline-block mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4D9FFF]">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                    </div>
                    <p>Select a conversation</p>
                    <p className="text-sm">Choose a person from the list to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Messages;

