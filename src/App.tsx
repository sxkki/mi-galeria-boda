import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PublicGallery from './components/PublicGallery';
import Dashboard from './components/Dashboard';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicGallery />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;