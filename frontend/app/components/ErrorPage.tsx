import React from "react";
import { Typography, Button, Container } from "@mui/material";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

interface ErrorPageProps {
  statusCode?: number;
  message?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ statusCode, message }) => {
  const router = useRouter();

  return (
    <Container
      maxWidth="sm"
      className="min-h-screen flex flex-col justify-center items-center text-center"
    >
      <AlertTriangle size={64} className="text-red-500 mb-4" />
      <Typography variant="h4" component="h1" gutterBottom>
        Oops! Something went wrong.
      </Typography>
      <Typography variant="body1" gutterBottom>
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : "An error occurred on client"}
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        {message ||
          "We're sorry for the inconvenience. Please try again later."}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => router.push("/")}
        className="mt-4"
      >
        Go back to home
      </Button>
    </Container>
  );
};

export default ErrorPage;
