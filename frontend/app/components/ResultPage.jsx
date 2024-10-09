import React, { useState, useEffect } from "react";
import { TextField, Button, Snackbar } from "@mui/material";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import BrandDealCard from "./BrandDealCard";

const ResultsPage = () => {
  const [email, setEmail] = useState("");
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Retrieve recommendations from localStorage
    const storedRecommendations = localStorage.getItem("recommendations");

    if (storedRecommendations) {
      setRecommendations(JSON.parse(storedRecommendations));
    } else {
      // If no recommendations, redirect to error page
      router.push("/error?message=No recommendations found");
    }
  }, [router]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL_LINK}/api/send-email`,
        {
          email,
          recommendations,
        }
      );
      setIsSuccess(true);
      setSnackbarMessage("Email Successfully Sent!");
      setIsSnackbarOpen(true);
      setEmail("");
    } catch (error) {
      console.error("Error sending email:", error);
      setIsSuccess(false);
      setSnackbarMessage(error.response?.data?.error || "Failed to send email");
      setIsSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsSnackbarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Recommended Brand Deals
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {recommendations.map((deal, index) => (
          <BrandDealCard key={index} deal={deal} />
        ))}
      </div>
      <form onSubmit={handleEmailSubmit} className="mt-8 max-w-md w-full">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          startIcon={<Mail size={20} />}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Email Results
        </Button>
      </form>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        ContentProps={{
          className: isSuccess ? "bg-green-600" : "bg-red-600",
        }}
      />
    </div>
  );
};

export default ResultsPage;
