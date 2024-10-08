"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, TextField, CircularProgress } from "@mui/material";

interface Automation {
  videoUrl: string;
  isStopped: boolean;
}

const DashboardContent = () => {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [affiliateUrl, setAffiliateUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAutomations();
    const interval = setInterval(fetchAutomations, 20000); // Fetch new automations every 20 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchAutomations = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/api/fetchAutomations"
      );
      setAutomations(
        response.data.map((videoUrl: Automation) => ({
          videoUrl,
          isStopped: false,
        }))
      );
    } catch (error) {
      console.error("Error fetching automations:", error);
    }
  };

  const startAutomation = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/automate", {
        videoUrl,
        affiliateUrl,
      });
      fetchAutomations();
    } catch (error) {
      console.error("Error analyzing video:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const stopAutomation = async (videoUrl: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/stop", {
        videoUrl,
      });
      if (response.status === 200) {
        setAutomations((prev) =>
          prev.map((automation) =>
            automation.videoUrl === videoUrl
              ? { ...automation, isStopped: true } // Update isStopped to true
              : automation
          )
        );
      }
      fetchAutomations();
    } catch (error) {
      console.error("Error stopping automation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const restartAutomation = (videoUrl: string) => {
    setIsLoading(true);
    stopAutomation(videoUrl);
    startAutomation();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 w-full h-full">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        Automation Dashboard
      </h1>
      <div className="w-full max-w-md mb-4">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Enter YouTube Video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="mb-4"
        />
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Enter your Affiliate Link"
          value={affiliateUrl}
          onChange={(e) => setAffiliateUrl(e.target.value)}
          className="mb-4"
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          onClick={() => {
            startAutomation();
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Start Automation"
          )}
        </Button>
      </div>
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Active Automations</h2>
        {automations.length === 0 ? (
          <p>No active automations.</p>
        ) : (
          <ul>
            {automations.map((automation) => (
              <li
                key={automation.videoUrl}
                className="flex justify-between items-center mb-2"
              >
                <span>{automation.videoUrl || "Video URL not available"}</span>
                {automation.isStopped ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => restartAutomation(automation.videoUrl)}
                  >
                    Restart Automation
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => stopAutomation(automation.videoUrl)}
                  >
                    Stop
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DashboardContent;
