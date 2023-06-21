import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import DocAITopLevel from "./DocAITopLevel";
import InvoiceForm from "./invoice_gen/components/InvoiceForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/inv-gen" element={<InvoiceForm/>} />
        <Route path="/" element={<div style={{ width: "100%", height: "100%", backgroundColor: "white" }}><DocAITopLevel /></div>} />
      </Routes>
    </Router>
  );
}

export default App;
