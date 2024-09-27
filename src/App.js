import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainLayout from "./Components/Layout/MainLayout";
import SchedulePage from "./Pages/SchedulePage/SchedulePage";
import HomePage from "./Pages/HomePage/HomePage";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/schedule" element={<SchedulePage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
