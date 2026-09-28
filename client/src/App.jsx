import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Home from "./pages/Home";
import About from "./pages/About";
import Parking from "./pages/Parking";
import History from "./pages/History";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Home />} />

          <Route path="/about" element={<About />} />

          <Route
            path="/parking"
            element={
              <ProtectedRoute>
                <Parking />
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;