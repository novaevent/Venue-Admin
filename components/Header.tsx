"use client";
import React, { useEffect, useState } from "react";

export default function Header() {
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    const pingServer = () => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/ping`, { method: "HEAD" })
        .then((res) => {
          console.log("Ping status:", res.status, res.ok);
          setIsActive(true);
        })
        .catch((err) => {
          console.log("Ping Failed!", err);
          setIsActive(false);
        });
    };

    pingServer();

    const interval = setInterval(pingServer, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-row justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-wide">
            Nova Admin
          </h1>
          <p className="text-gray-600 mt-1">
            Manage venues, time slots, and ratings effortlessly
          </p>
        </div>
        <div className="flex flex-row items-center gap-x-3">
          <div className="font-semibold text-lg">Server Status:</div>
          {isActive ? (
            <div className="flex flex-row items-center gap-x-1.5">
              <div className="h-2.5 w-2.5 bg-green-500 rounded-full"></div>
              <div className="text-sm text-green-500">Online</div>
            </div>
          ) : (
            <div className="flex flex-row items-center gap-x-1.5">
              <div className="h-2.5 w-2.5 bg-red-500 rounded-full"></div>
              <div className="text-sm text-red-500">Offline</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
