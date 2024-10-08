"use client";

import React, { Suspense } from "react";
import DashboardContent from "../components/DashboardContent";

const Dashboard = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
};

export default Dashboard;
