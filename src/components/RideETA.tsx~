"use client";

import { useState } from "react";

export default function FareSplit({ rideId, totalFare }: { rideId: string; totalFare: number }) {
  const [users, setUsers] = useState<string[]>([]);
  const [splitAmount, setSplitAmount] = useState<number | null>(null);

  const handleSplitFare = async () => {
    const response = await fetch("/api/splitFare", {
      method: "POST",
      body: JSON.stringify({ rideId, users, totalFare }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    if (data.splitAmount) setSplitAmount(data.splitAmount);
  };

  return (
    <div>
      <h2>Split Fare</h2>
      <input
        type="text"
        placeholder="Enter User IDs (comma-separated)"
        onChange={(e) => setUsers(e.target.value.split(","))}
      />
      <button onClick={handleSplitFare}>Split Fare</button>
      {splitAmount !== null && <p>Each user pays: ${splitAmount.toFixed(2)}</p>}
    </div>
  );
}
