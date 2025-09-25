"use client";
import { useAppContext } from "@/contexts/AppContext";
import React, { useCallback, useEffect, useState } from "react";

export default function Header() {
  const { url, setEnvironment } = useAppContext();

  const [isActive, setIsActive] = useState<boolean>(false);
  const [selectedServer, setSelectedServer] = useState<"local" | "prod">(
    "prod"
  );

  const pingServer = useCallback(() => {
    fetch(`${url}/ping`, { method: "HEAD" })
      .then((res) => {
        console.log("Ping status:", res.status, res.ok);
        setIsActive(true);
      })
      .catch(() => {
        console.log("Ping Failed!");
        setIsActive(false);
      });
  }, [url]);

  useEffect(() => {
    setEnvironment(selectedServer);
  }, [selectedServer, setEnvironment]);

  useEffect(() => {
    pingServer();
    const interval = setInterval(pingServer, 30000);
    return () => clearInterval(interval);
  }, [pingServer]);

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
        <div className="flex flex-row items-center gap-x-8">
          <div className="flex flex-row items-center gap-x-3">
            <div className="font-semibold text-lg text-gray-900">
              Environment:
            </div>
            <select
              id="venue"
              value={selectedServer}
              onChange={(e) =>
                setSelectedServer(e.target.value as "local" | "prod")
              }
              className="border rounded px-3 py-2"
              defaultValue={selectedServer}
            >
              <option value="prod">Production</option>
              <option value="local">Local</option>
            </select>
          </div>
          <div className="flex flex-row items-center gap-x-3">
            <div className="font-semibold text-lg text-gray-900">
              Server Status:
            </div>
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
    </div>
  );
}
