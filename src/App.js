import { BrowserRouter, Routes, Route } from "react-router-dom";
import WomenPatientsPage from "./pages/WomenPatientsPage";
import NariSangha from "./pages/narisangha/NariSangha";
import WomenChildPage from "./pages/WomenChildPage";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/narisangha" element={<NariSangha />} />
         <Route path="/patients" element={<WomenPatientsPage />} />
         <Route path="/womenChild" element={<WomenChildPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


/*import React from 'react';
import WomenChild from './WomenChildPage'; // Import your new component
import './App.css'; // Optional: for global styles

function App() {
  return (
    <div className="App">
      <WomenChild/>
    </div>
  );
}

export default App;*/