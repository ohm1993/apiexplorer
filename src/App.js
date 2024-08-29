import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import DetailPage from "./DetailPage";
import './App.css';

function App() {
  return (
    <Router>
       <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/details/:provider" element={<DetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
