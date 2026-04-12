import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./dashboard/Dashboard";
import DispensingRequests from "./dispensing-requests/DispensingRequests";
import DispensingRequestItems from "./dispensing-requests/DispensingRequestItems";

const DispensingRoutes = ({ consultationType, stockItem }) => {
  console.log('DispensingRoutes rendered, current path:', window.location.pathname);
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <>
            {console.log('Dashboard route matched')}
            <Dashboard />
          </>
        }
      />
      <Route
        path="/"
        exact
        element={
          <DispensingRequests
            consultationType={consultationType}
            stockItem={stockItem}
          />
        }
      />
      <Route
        path="/dispensing-requests"
        element={
          <DispensingRequests
            consultationType={consultationType}
            stockItem={stockItem}
          />
        }
      />
      <Route
        path="/dispensing-requests/:patientId/:paymentCacheId"
        element={
          <DispensingRequestItems
            consultationType={consultationType}
            stockItem={stockItem}
          />
        }
      />
      <Route
        path="/reports/*"
        element={<div>Reports coming soon</div>}
      />
    </Routes>
  );
};

export default DispensingRoutes;
