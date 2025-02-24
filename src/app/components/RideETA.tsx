"use client";

import { useEffect, useState } from "react";

export default function RideETA({ rideId }: { rideId: string }) {
  const [eta, setEta] = useState<number | null>(null);

  useEffect(() => {
    const fetchETA = async () => {
      const response = await fetch(`/api/getETA?rideId=${rideId}`);
      const data = await response.json();
      setEta(data.eta);
    };

    fetchETA();
    const interval = setInterval(fetchETA, 5000);
    return () => clearInterval(interval);
  }, [rideId]);

  return <div>ETA: {eta ? `${eta} min` : "Fetching..."}</div>;
}
