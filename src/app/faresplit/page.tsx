"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function FareSplitPage() {
  const [totalFare, setTotalFare] = useState<number>(0);
  const [riders, setRiders] = useState<string[]>([""]);
  const [splits, setSplits] = useState<number[]>([]);
  const [customSplit, setCustomSplit] = useState<boolean>(false);
  const router = useRouter();
 
  const handleSplit = () => {
    if (!customSplit) {
      const evenSplit = totalFare / riders.length;
      setSplits(Array(riders.length).fill(evenSplit));
    }
  };

  const updateSplit = (index: number, value: number) => {
    const newSplits = [...splits];
    newSplits[index] = value;
    setSplits(newSplits);
  };

  const addRider = () => {
    setRiders([...riders, ""]);
    setSplits([...splits, 0]);
  };

  const removeRider = (index: number) => {
    const newRiders = riders.filter((_, i) => i !== index);
    const newSplits = splits.filter((_, i) => i !== index);
    setRiders(newRiders);
    setSplits(newSplits);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Split Fare</h1>

      <div className="bg-white p-6 rounded-lg shadow-md w-[400px]">
      <Button className="mt-6 bg-gray-500 hover:bg-gray-600 text-white" onClick={() => router.push("/ride-cost")}>
        	Back
      	</Button>
        <label className="block font-semibold">Total Fare ($)</label>
        <input
          type="number"
          value={totalFare}
          onChange={(e) => setTotalFare(parseFloat(e.target.value))}
          className="border p-2 w-full mb-4"
        />

        {riders.map((_, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              placeholder={`Rider ${index + 1} Name`}
              value={riders[index]}
              onChange={(e) => {
                const newRiders = [...riders];
                newRiders[index] = e.target.value;
                setRiders(newRiders);
              }}
              className="border p-2 w-2/3"
            />
            {customSplit && (
              <input
                type="number"
                placeholder="Amount ($)"
                value={splits[index] || ""}
                onChange={(e) => updateSplit(index, parseFloat(e.target.value))}
                className="border p-2 w-1/3 ml-2"
              />
            )}
            {index > 0 && (
              <button onClick={() => removeRider(index)} className="ml-2 bg-red-500 text-white px-2 py-1 rounded">
                ❌
              </button>
            )}
          </div>
        ))}

        <button onClick={addRider} className="bg-green-500 text-white px-4 py-2 rounded mt-2">
          ➕ Add Rider
        </button>

        <div className="mt-4">
          <label className="inline-flex items-center">
            <input type="checkbox" checked={customSplit} onChange={() => setCustomSplit(!customSplit)} />
            <span className="ml-2">Custom Split</span>
          </label>
        </div>

        <button
          onClick={handleSplit}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full mt-4"
          disabled={customSplit}
        >
          Split Evenly
        </button>

        {splits.length > 0 && (
          <div className="mt-4">
            <h2 className="font-semibold">Split Results:</h2>
            {riders.map((rider, index) => (
              <p key={index}>
                {rider || `Rider ${index + 1}`}: <strong>${splits[index]?.toFixed(2) || "0.00"}</strong>
              </p>
            ))}
          </div>
        )}
	<Button className="mt-6 bg-gray-500 hover:bg-gray-600 text-white" onClick={() => router.push("/dashboard")}>
        	Back to Dashboard
      	</Button>
      </div>
    </div>
  );
}
