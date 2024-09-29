import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Snackbar,
} from "@mui/material";
import { Copy, ExternalLink, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

const BrandDealCard = ({ deal }) => (
  <Card className="mb-4 hover:shadow-lg transition-shadow duration-300">
    <CardContent>
      <div className="flex items-center mb-2">
        <img src={deal.logo} alt={deal.name} className="w-10 h-10 mr-2" />
        <Typography variant="h6">{deal.name}</Typography>
      </div>
      <Typography variant="body2" color="textSecondary" className="mb-2">
        {deal.description}
      </Typography>
      <Typography variant="body2" className="mb-2">
        Potential earnings: {deal.earnings}
      </Typography>
      {deal.contactInfo && (
        <div className="flex items-center mb-2">
          <Typography variant="body2" className="mr-2">
            Contact: {deal.contactInfo}
          </Typography>
          <Button
            startIcon={<Copy size={16} />}
            size="small"
            onClick={() => navigator.clipboard.writeText(deal.contactInfo)}
          >
            Copy
          </Button>
        </div>
      )}
      <Button
        startIcon={<ExternalLink size={16} />}
        variant="outlined"
        color="primary"
        fullWidth
        href={deal.affiliateLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2"
      >
        Visit Affiliate Program
      </Button>
    </CardContent>
  </Card>
);

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
        "http://127.0.0.1:5000/api/send-email",
        {
          email,
          recommendations,
        }
      );
      setIsSuccess(true);
      setSnackbarMessage(response.data.message);
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
