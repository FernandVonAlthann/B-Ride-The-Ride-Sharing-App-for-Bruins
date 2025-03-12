"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4D9FFF] to-[#020B3B] p-6 flex flex-col">
      <Button
        className="self-start mb-6 bg-[#172554] text-white px-6 py-2 rounded-full"
        onClick={() => router.push("/dashboard")}
      >
        ← Back to Dashboard
      </Button>

      <div className="w-full max-w-4xl mx-auto bg-white/90 shadow-xl rounded-2xl p-6">
        <h1 className="text-center text-black text-2xl font-bold mb-4">
          Messages{" "}
          {selectedRecipient ? `- ${getRecipientName(selectedRecipient)}` : ""}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Recipients List */}
          <div className="border-r border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">
              Recent Messages
            </h3>
            {recipients.map((person) => (
              <div
                key={person.id}
                className={`flex items-center gap-3 p-3 text-black rounded-lg cursor-pointer transition-colors ${
                  selectedRecipient === person.id
                    ? "bg-[#E6B400] text-black"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedRecipient(person.id)}
              >
                <p className="font-medium">{person.name}</p>
              </div>
            ))}
          </div>

          {/* Messages Section */}
          <div className="col-span-2 flex flex-col">
            {selectedRecipient ? (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
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
                            ? "bg-[#4D9FFF] text-black"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p>{message.message}</p>
                        <p className="text-xs mt-1 text-gray-500">
                          {formatDate(message.sent_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t border-gray-200 bg-white flex gap-2">
                  <Input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 text-black"
                  />
                  <Button
                    className="bg-[#E6B400] hover:bg-[#D4A017] text-black"
                    onClick={sendMessage}
                  >
                    Send
                  </Button>
                </div>
              </>
            ) : (
              <div>Select a conversation</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;

