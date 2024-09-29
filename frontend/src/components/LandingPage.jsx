"use client";

import React, { useState } from "react";
import { TextField, Button, CircularProgress } from "@mui/material";
import { Search } from "lucide-react";
import { useRouter } from "next/router";
import axios from "axios";

const LandingPage = () => {
  const [channelUrl, setChannelUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/analyze", { channelUrl });
      const { recommendations } = response.data;

      // Store recommendations in localStorage
      localStorage.setItem("recommendations", JSON.stringify(recommendations));

      // Navigate to results page
      router.push("/results");
    } catch (error) {
      console.error("Error analyzing channel:", error);
      router.push("/error?message=Failed to analyze channel");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        AI Talent Manager
      </h1>
      <div className="w-full max-w-md">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Enter YouTube channel URL"
          value={channelUrl}
          onChange={(e) => setChannelUrl(e.target.value)}
          InputProps={{
            startAdornment: <Search className="text-gray-400 mr-2" size={20} />,
          }}
          className="mb-4"
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          onClick={handleAnalyze}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Analyze Channel"
          )}
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;
