"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Helper function: arithmetic calculation
function calculateArithmetic(input: string): string | null {
  const plusMatch = input.match(/(\d+)\s*(plus|\+)\s*(\d+)/i);
  if (plusMatch) {
    const a = parseFloat(plusMatch[1]);
    const b = parseFloat(plusMatch[3]);
    return `${a} + ${b} = ${a + b}`;
  }
  const minusMatch = input.match(/(\d+)\s*(minus|\-)\s*(\d+)/i);
  if (minusMatch) {
    const a = parseFloat(minusMatch[1]);
    const b = parseFloat(minusMatch[3]);
    return `${a} - ${b} = ${a - b}`;
  }
  const timesMatch = input.match(/(\d+)\s*(times|\*)\s*(\d+)/i);
  if (timesMatch) {
    const a = parseFloat(timesMatch[1]);
    const b = parseFloat(timesMatch[3]);
    return `${a} * ${b} = ${a * b}`;
  }
  const divideMatch = input.match(/(\d+)\s*(divided by|\/)\s*(\d+)/i);
  if (divideMatch) {
    const a = parseFloat(divideMatch[1]);
    const b = parseFloat(divideMatch[3]);
    if (b === 0) return "Cannot divide by zero!";
    return `${a} / ${b} = ${a / b}`;
  }
  return null;
}

// Helper: Fare estimation calculation
function calculateFare(input: string): string | null {
  // Example pattern: "distance is 5 miles, duration is 10 minutes"
  const fareMatch = input.match(/Distance\s+is\s+(\d+(?:\.\d+)?)\s*miles?,\s*duration\s+is\s+(\d+(?:\.\d+)?)\s*minutes?/i);
  if (fareMatch) {
    const distance = parseFloat(fareMatch[1]);
    const duration = parseFloat(fareMatch[2]);
    const baseFare = 3;
    const costPerMile = 1.5;
    const costPerMinute = 0.25;
    const cost = baseFare + (distance * costPerMile) + (duration * costPerMinute);
    return `The estimated fare for a ride of ${distance} miles and ${duration} minutes is $${cost.toFixed(2)}.`;
  }
  return null;
}

const responseRules = [
  // Greetings and small talk
  { pattern: /^(hi|hello|hey)\b/i, response: "Hello there! How can I help you today?" },
  { pattern: /good morning/i, response: "Good morning! What can I assist you with?" },
  { pattern: /good evening/i, response: "Good evening! How can I make your night easier?" },
  { pattern: /how are you/i, response: "I'm just a friendly assistant, always here and ready to help!" },
  { pattern: /bye|goodbye/i, response: "Goodbye! Have a great day, and don't hesitate to reach out if you need anything!" },

  // Ride-related
  { pattern: /book.*ride/i, response: "I can help you book a ride! Please share your pickup location and destination." },
  { pattern: /cancel.*ride/i, response: "Need to cancel your ride? Just let me know the ride details, and I'll take care of it!" },
  { pattern: /check.*ride.*status/i, response: "Let me check the status of your ride. Can you provide the ride ID?" },
  { pattern: /find.*carpool/i, response: "Looking for a carpool? Tell me where you're headed, and I'll match you with similar routes." },
  { pattern: /ride.*history/i, response: "You can view your ride history in the 'Ride History' section of the app." },

  // Location-based and route-related
  { pattern: /current.*location/i, response: "Can you share your current location? I'll help you with directions." },
  { pattern: /route/i, response: "You can view the live route on our map section." },
  { pattern: /traffic/i, response: "If you're worried about traffic, consider leaving a bit earlier or checking real-time conditions." },
  { pattern: /weather/i, response: "I'm not a weather bot, but it's always a good day to ride!" },
  { pattern: /landmark/i, response: "Looking for landmarks? Let me know your location, and I'll help you out!" },

  // Personal profile and account management
  { pattern: /profile|account/i, response: "To update your profile, please head over to the Profile Customization page." },
  { pattern: /edit.*account/i, response: "To edit your account details, go to 'Account Settings'." },
  { pattern: /change.*password/i, response: "You can change your password in the 'Account Settings' section." },
  { pattern: /update.*information/i, response: "Make sure your information is up to date in your Profile Settings!" },

  // Ride features
  { pattern: /safety/i, response: "Safety first! Always wear your seatbelt and follow road rules." },
  { pattern: /price|cost|fare/i, response: "Need a fare estimate? Provide me the distance and duration of your ride (Distance is X miles, duration is Y minutes(for decimals format 0.0))." },
  { pattern: /driver/i, response: "Our drivers are all verified for your safety." },
  { pattern: /share.*ride/i, response: "Sharing a ride? Let's find a suitable carpool for you." },

  // Fun and engagement
  { pattern: /joke/i, response: "Why don't skeletons ride motorcycles? Because they don't have the guts!" },
  { pattern: /fact/i, response: "Did you know? The first car was invented in 1885 by Karl Benz!" },
  { pattern: /funny/i, response: "Why do cars never get tired? Because they always have 'brakes'!" },
  { pattern: /quote/i, response: "Here's a travel quote: 'The journey, not the arrival, matters.' - T.S. Eliot" },

  // Miscellaneous interests
  { pattern: /restaurant|food/i, response: "Looking for a bite to eat? I recommend checking out local reviews for the best spots!" },
  { pattern: /workout/i, response: "Staying fit is great! Try stretching before long drives." },
  { pattern: /podcast/i, response: "Podcasts make rides better! Try 'The Daily' or '99% Invisible'." },
  { pattern: /road trip/i, response: "A road trip? Sounds exciting! Make sure to pack some snacks!" },
  { pattern: /holiday/i, response: "Planning a trip for the holidays? Consider booking your ride early!" },

  // Emergency and safety
  { pattern: /emergency/i, response: "In case of an emergency, always dial your local emergency services!" },
  { pattern: /emergency kit/i, response: "Always carry an emergency kit with jumper cables, a flashlight, and first aid." },
  { pattern: /accident/i, response: "In case of an accident, make sure to stay calm and contact emergency services." },

  // Environment and eco-friendly
  { pattern: /eco-friendly/i, response: "Go green! Choose eco-friendly rides for a more sustainable journey." },
  { pattern: /fuel/i, response: "Want to save fuel? Try maintaining a steady speed and avoiding rapid acceleration." },
  { pattern: /electric vehicle/i, response: "Electric vehicles are the future! We support sustainable options for your rides." },

  // Other random topics
  { pattern: /pets/i, response: "Traveling with pets? Make sure they're safely secured!" },
  { pattern: /adventure/i, response: "Life is an adventure! Where are you headed next?" },
  { pattern: /bucket list/i, response: "What's on your travel bucket list? I'd love to hear it!" },
  { pattern: /celebration/i, response: "Celebrating something special? A shared ride makes it more fun!" },
  { pattern: /sunset/i, response: "Sunset drives are the best! Find a scenic route and enjoy." },
  { pattern: /morning routine/i, response: "Start your day with a smooth ride! How can I assist with your commute?" },

  // Health and wellness
  { pattern: /hydration/i, response: "Stay hydrated, especially on long rides! Always keep a water bottle nearby." },
  { pattern: /sleep/i, response: "Getting enough rest before a long ride is key! Make sure you're well-rested." },
  { pattern: /stretch/i, response: "Take breaks and stretch during long journeys to avoid stiffness." },

  // Technology and gadgets
  { pattern: /phone/i, response: "Don't forget to charge your phone before your ride. A charged phone is always handy!" },
  { pattern: /gps/i, response: "Make sure your GPS is set up before heading out for smooth navigation." },
  { pattern: /app/i, response: "Need help with the app? Feel free to ask about any features!" },

  // Miscellaneous
  { pattern: /shopping/i, response: "Need a shopping stop? Let me know where to go!" },
  { pattern: /travel/i, response: "Traveling soon? Let's make sure your ride is booked!" },
  { pattern: /fashion/i, response: "Looking for fashion tips? A stylish outfit can make your ride even better!" },
  { pattern: /pets/i, response: "Bringing your furry friend along? Let's make sure they're comfortable!" },
  { pattern: /smart/i, response: "While not the smartest, I do what I can!" },
  { pattern: /help me/i, response: "I can help with a lot of things, like the cost of fares and routing you to other features!" },
  
  // Catch-all response
  { pattern: /.*/, response: "I'm not entirely sure what you mean. Could you please rephrase that?" }
];

export default function AIChatAssistant() {
  const router = useRouter();
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    { role: "bot", text: "Hello! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  // For routing confirmations
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);

  const processInput = (userInput: string) => {
    // Check arithmetic first
    const arithmeticResult = calculateArithmetic(userInput);
    if (arithmeticResult) return arithmeticResult;

    // Check fare calculation
    const fareResult = calculateFare(userInput);
    if (fareResult) return fareResult;

    // Check for "send to" commands
    const sendToMatch = userInput.match(/send\s+(?:me\s+to\s+)?(.*)/i);
    if (sendToMatch) {
      const feature = sendToMatch[1].trim();
      // Set pending route if feature is recognized (simulate known features)
      // For example, if feature contains "profile", "map", "chat", "payment"
      if (/profile/i.test(feature)) {
        setPendingRoute("/profile");
        return "Do you want me to route you to your profile page? (yes/no)";
      } else if (/map/i.test(feature)) {
        setPendingRoute("/map");
        return "Do you want me to show you the live map? (yes/no)";
      } else if (/chat/i.test(feature)) {
        setPendingRoute("/group-chat");
        return "Do you want me to open the group chat for you? (yes/no)";
      } else if (/payment/i.test(feature)) {
        setPendingRoute("/payment");
        return "Do you want me to take you to the payment page? (yes/no)";
      } else if (/ride history/i.test(feature)) {
        setPendingRoute("/ride-history");
        return "Do you want me to show you your ride history? (yes/no)";
      } else if (/saved locations/i.test(feature)) {
        setPendingRoute("/saved-locations");
        return "Do you want me to take you to your saved locations? (yes/no)";
      } else if (/fare/i.test(feature)) {
        return "Please provide the distance and duration (e.g., 'distance is 5 miles, duration is 10 minutes').";
      } else {
        return "I'm not sure what feature you mean. Please try again.";
      }
    }

    // If pending route exists and user responds "yes" or "no"
    if (pendingRoute) {
      if (/^(yes|y)$/i.test(userInput.trim())) {
        const route = pendingRoute;
        setPendingRoute(null);
        router.push(route);
        return `Routing you to ${route}...`;
      } else if (/^(no|n)$/i.test(userInput.trim())) {
        setPendingRoute(null);
        return "Okay, staying on the current page.";
      }
    }

    // Process response rules
    for (const rule of responseRules) {
      if (rule.pattern.test(userInput)) {
        return rule.response;
      }
    }

    return "I'm not sure how to help with that.";
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    // Get bot response
    const botResponse = processInput(input);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", text: botResponse }]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
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

      <Card className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-sm text-gray-900 shadow-xl rounded-2xl border-t border-white/50">
        <CardHeader className="bg-gradient-to-r from-[#4D9FFF] to-[#2563EB] text-white rounded-t-2xl p-6">
          <CardTitle className="text-center text-2xl font-bold">
            Chat with AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-96 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-xl">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-3 ${
                  msg.role === "user" ? "flex justify-end" : "flex justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-[#4D9FFF] text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#4D9FFF]"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me something..."
            />
            <Button 
              onClick={handleSend} 
              className="bg-[#E6B400] hover:bg-[#D9A900] text-black font-semibold px-6 py-3 rounded-full"
            >
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
