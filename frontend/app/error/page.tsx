"use client";

import React, { useEffect } from "react";
import ErrorPage from "../components/ErrorPage";

// Error component for rendering error messages
const Error = () => {
  // You can include default status code and message for display
  const statusCode = 500;
  const message = "An unexpected error occurred.";

  return <ErrorPage statusCode={statusCode} message={message} />;
};

export default Error;
