import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // ===============================
  // Normal Email/Password Login
  // ===============================
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", response.data);

      localStorage.setItem("token", response.data.token);

      if (response.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );
      }

      alert("Login successful");

      navigate("/parking");
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    }
  };

  // ===============================
  // Google Login
  // ===============================
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      console.log("GOOGLE LOGIN SUCCESS");

      const googleCredential = credentialResponse.credential;

      if (!googleCredential) {
        alert("Google credential not received");
        return;
      }

      // Send Google credential to backend
      const response = await axios.post("/api/auth/google", {
        credential: googleCredential,
      });

      console.log("GOOGLE BACKEND RESPONSE:", response.data);

      // Save our application's JWT
      localStorage.setItem("token", response.data.token);

      // Save user information
      if (response.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );
      }

      alert("Google login successful");

      // Go to parking dashboard
      navigate("/parking");

    } catch (error) {
      console.error("GOOGLE LOGIN ERROR:", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Google login failed"
      );
    }
  };

  // ===============================
  // Google Login Error
  // ===============================
  const handleGoogleError = () => {
    console.error("Google Login Failed");
    alert("Google login failed");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">

      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">

        <div className="mb-8 text-center">

          <p className="mb-2 text-sm font-bold uppercase tracking-wider text-blue-600">
            Smart Parking System
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            Login
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Login to access your parking dashboard
          </p>

        </div>

        {/* Email / Password Login */}

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-3.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-3.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 p-3.5 font-semibold text-white hover:bg-blue-700"
          >
            Login
          </button>

        </form>

        {/* Divider */}

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200"></div>

          <span className="text-sm text-slate-400">
            OR
          </span>

          <div className="h-px flex-1 bg-slate-200"></div>
        </div>

        {/* Google Login */}

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap={false}
          />
        </div>

      </div>
    </div>
  );
}

export default Login;