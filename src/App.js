import { BrowserRouter, Routes, Route } from "react-router-dom";


import WomenHealthConditionsPage from "./pages/WomenHealthConditionsPage";

import WomenHealthPostsDashboard from "./pages/WomenHealthPostsDashboard";
import WomenHealthCommunitiesDashboard from "./pages/WomenHealthCommunitiesDashboard";

import WomenHealthProducts from "./pages/WomenHealthProducts";
import WomenInsuranceProductCatlg from "./pages/WomenInsuranceProductCatlg";
import WomenDiscordHealthApp from "./pages/WomenDiscordHealthApp";
import DemoHtmlPage from "./pages/DemoHtmlPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>

         <Route path="/wmhealthconditions" element={<WomenHealthConditionsPage />} />

         <Route path="/wmhealthpostsdashboard" element={<WomenHealthPostsDashboard />} />
         <Route path="/wmhealthcommhdashboard" element={<WomenHealthCommunitiesDashboard />} />
       
         <Route path="/Womenhealthproducts" element={<WomenHealthProducts/>} />
         <Route path="/Womeninsuranceprods" element={<WomenInsuranceProductCatlg/>} />
         <Route path="/discordapp" element={<WomenDiscordHealthApp/>} />
         
         <Route path="/demohtml/:fileName?" element={<DemoHtmlPage/>} />
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