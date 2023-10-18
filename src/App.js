import Editor from "./components/Editor";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import {v4 as uuid} from 'uuid'
import SavedDocs from "./components/SavedDocs";

function App() {
  return (
    <Router>
      <Routes>
        {/* Corrected path to capture dynamic 'id' parameter */}
        <Route path="/docs/:id" element={<Editor />} />
        {/* Redirect to a new 'uuid' route when the app starts */}
        <Route path="/" element={<Navigate replace to={`/docs/${uuid()}`} />} />
        <Route path="/save-docs" element={<SavedDocs />} />
      </Routes>
    </Router>
  );
}

export default App;

