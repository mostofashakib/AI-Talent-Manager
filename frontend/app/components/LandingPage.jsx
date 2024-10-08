"use client";

import React, { useState } from "react";
import { TextField, Button, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Search, ArrowRight, Zap, BarChart, Users } from "lucide-react";

const LandingPage = () => {
  const [channelUrl, setChannelUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [affiliateUrl, setAffiliateUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/analyze", {
        channelUrl,
      });
      const { recommendations } = response.data;

      // Store recommendations in localStorage if available
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(
          "recommendations",
          JSON.stringify(recommendations)
        );
      }

      // Navigate to results page
      router.push("/results");
    } catch (error) {
      console.error("Error analyzing channel:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to analyze channel. Please try again later.";
      router.push(`/error?message=${encodeURIComponent(errorMessage)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoAnalyze = async () => {
    setIsLoading(true);
    try {
      await axios.post("http://127.0.0.1:5000/api/automate", {
        videoUrl,
        affiliateUrl,
      });
      router.push(`/dashboard`);
    } catch (error) {
      console.error("Error analyzing video:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to automate video. Please try again later.";
      router.push(`/error?message=${encodeURIComponent(errorMessage)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="flex-grow">
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
              Supercharge Your Creator Career
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Automate brand partnerships, and maximize your earnings with AI
            </p>
            <div className="max-w-xl mx-auto space-y-4">
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-2">
                  Analyze YouTube Channel
                </h2>
                <p className="text-gray-600 mb-4">
                  Find potential brand partnerships for your channel
                </p>
                <div className="flex space-x-2">
                  <TextField
                    variant="outlined"
                    placeholder="Enter YouTube channel URL"
                    value={channelUrl}
                    onChange={(e) => setChannelUrl(e.target.value)}
                    className="flex-grow"
                  />
                  <Button
                    onClick={handleAnalyze}
                    disabled={isLoading}
                    className="bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Analyze"
                    )}
                    <ArrowRight className="inline-block ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-2">
                  Automate Sales Response
                </h2>
                <p className="text-gray-600 mb-4">
                  Set up automated responses for your video
                </p>
                <div className="space-y-2">
                  <TextField
                    variant="outlined"
                    placeholder="Enter YouTube video URL"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full"
                  />
                  <TextField
                    variant="outlined"
                    placeholder="Enter your Affiliate Link"
                    value={affiliateUrl}
                    onChange={(e) => setAffiliateUrl(e.target.value)}
                    className="w-full"
                  />
                  <Button
                    onClick={handleVideoAnalyze}
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Set Up Automation"
                    )}
                    <ArrowRight className="inline-block ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              Key Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2 flex items-center">
                  <Search className="h-6 w-6 text-blue-600 mr-2" />
                  Brand Discovery
                </h3>
                <p className="text-gray-600">
                  Discover potential brand partnerships tailored to your
                  channel's content and audience.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2 flex items-center">
                  <BarChart className="h-6 w-6 text-blue-600 mr-2" />
                  Performance Tracking
                </h3>
                <p className="text-gray-600">
                  Track the performance of your brand deals and optimize your
                  partnerships.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2 flex items-center">
                  <Users className="h-6 w-6 text-blue-600 mr-2" />
                  Automated Engagement
                </h3>
                <p className="text-gray-600">
                  Automatically respond to comments and DMs with relevant
                  affiliate links and product information.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-4">ViralVisionAI</h3>
              <p className="text-gray-400">
                Empowering creators with AI-driven tools for success.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-2 border-t border-gray-800 text-center">
            <p className="text-gray-400">
              &copy; 2024 ViralVisionAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
