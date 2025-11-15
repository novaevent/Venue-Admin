"use client";
import { PING_PERIOD } from "@/constants/app-constants";
import { useAppContext } from "@/contexts/AppContext";
import React, { useCallback, useEffect, useState } from "react";

export default function Header() {
  const { url, environment, setEnvironment } = useAppContext();

  const [isActive, setIsActive] = useState<boolean>(false);
  const [selectedServer, setSelectedServer] = useState<"local" | "prod">(
    environment
  );

  const pingServer = useCallback(() => {
    fetch(`${url}/ping`, { method: "HEAD" })
      .then((res) => {
        setIsActive(true);
      })
      .catch(() => {
        setIsActive(false);
      });
  }, [url]);

  useEffect(() => {
    setEnvironment(selectedServer);
  }, [selectedServer, setEnvironment]);

  useEffect(() => {
    pingServer();
    const interval = setInterval(pingServer, PING_PERIOD);
    return () => clearInterval(interval);
  }, [pingServer]);

  return (
    <div className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-row justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-wide">
            Gathr Dashboard
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
              className="border rounded px-3 py-2 text-gray-900"
              defaultValue={selectedServer}
            >
              <option value="prod" className="text-gray-900">
                Production
              </option>
              <option value="local" className="text-gray-900">
                Local
              </option>
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
