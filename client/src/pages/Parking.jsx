import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Parking() {
  const [slots, setSlots] = useState([]);
  const [slotNumber, setSlotNumber] = useState("");
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalSessions: 0,
    totalRevenue: 0,
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("User data error:", error);
    localStorage.removeItem("user");
  }

  // ==========================================
  // FORMAT DATE
  // ==========================================
  const formatDateTime = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ==========================================
  // DURATION
  // ==========================================
  const calculateDuration = (entryTime, exitTime) => {
    if (!entryTime) return "—";

    const start = new Date(entryTime);
    const end = exitTime ? new Date(exitTime) : new Date();

    const difference = end - start;

    if (difference < 0) return "—";

    const totalMinutes = Math.floor(
      difference / (1000 * 60)
    );

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) {
      return `${minutes} min`;
    }

    return `${hours} hr ${minutes} min`;
  };

  // ==========================================
  // PARKING FEE
  // ==========================================
  const calculateFee = (entryTime, exitTime) => {
    if (!entryTime) return 0;

    const start = new Date(entryTime);
    const end = exitTime ? new Date(exitTime) : new Date();

    const difference = end - start;

    if (difference <= 0) {
      return 20;
    }

    const totalMinutes = Math.ceil(
      difference / (1000 * 60)
    );

    const hours = Math.ceil(totalMinutes / 60);

    return Math.max(hours * 20, 20);
  };

  // ==========================================
  // FETCH PARKING
  // ==========================================
  const fetchParkingSlots = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(
        "/api/parking/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSlots(response.data);
    } catch (error) {
      console.error("FETCH PARKING ERROR:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        alert(
          error.response?.data?.message ||
            "Failed to fetch parking slots"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH STATS
  // ==========================================
  const fetchParkingStats = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(
        "/api/parking/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(response.data);
    } catch (error) {
      console.error("FETCH STATS ERROR:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    }
  };

  // ==========================================
  // AI DETECTION
  // ==========================================
  const handleAIDetection = async () => {
    if (!selectedImage) {
      alert("Please select an image first");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setAiLoading(true);
      setAiResult(null);

      const formData = new FormData();

      formData.append("file", selectedImage);

      const response = await axios.post(
        "/api/ai/detect",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAiResult(response.data);
    } catch (error) {
      console.error("AI DETECTION ERROR:", error);

      alert(
        error.response?.data?.message ||
          "AI detection failed"
      );
    } finally {
      setAiLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================
  useEffect(() => {
    fetchParkingSlots();
    fetchParkingStats();
  }, []);

  // ==========================================
  // ADD SLOT
  // ==========================================
  const handleAddSlot = async (e) => {
    e.preventDefault();

    if (!slotNumber.trim()) {
      alert("Please enter slot number");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "/api/parking/",
        {
          slotNumber: slotNumber.trim(),
          status: "available",
          vehicleNumber: "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSlots((prev) => [...prev, response.data]);

      setSlotNumber("");

      alert("Parking slot added successfully");
    } catch (error) {
      console.error("ADD SLOT ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to add parking slot"
      );
    }
  };

  // ==========================================
  // UPDATE SLOT
  // ==========================================
  const handleUpdateSlot = async (
    id,
    currentStatus,
    currentVehicleNumber
  ) => {
    const token = localStorage.getItem("token");

    const newStatus =
      currentStatus === "available"
        ? "occupied"
        : "available";

    let vehicleNumber = currentVehicleNumber || "";

    if (newStatus === "occupied") {
      vehicleNumber = prompt(
        "Enter vehicle number:"
      );

      if (
        !vehicleNumber ||
        !vehicleNumber.trim()
      ) {
        alert("Vehicle number is required");
        return;
      }

      vehicleNumber = vehicleNumber
        .trim()
        .toUpperCase();
    }

    try {
      const response = await axios.put(
        `/api/parking/${id}`,
        {
          status: newStatus,
          vehicleNumber:
            newStatus === "occupied"
              ? vehicleNumber
              : "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSlots((prev) =>
        prev.map((slot) =>
          slot._id === id
            ? response.data
            : slot
        )
      );

      if (newStatus === "available") {
        fetchParkingStats();
      }

      alert(
        newStatus === "occupied"
          ? "Vehicle entered successfully"
          : "Vehicle exited successfully"
      );
    } catch (error) {
      console.error(
        "UPDATE SLOT ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update parking slot"
      );
    }
  };

  // ==========================================
  // DELETE SLOT
  // ==========================================
  const handleDeleteSlot = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this parking slot?"
    );

    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `/api/parking/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSlots((prev) =>
        prev.filter(
          (slot) => slot._id !== id
        )
      );

      alert(
        "Parking slot deleted successfully"
      );
    } catch (error) {
      console.error(
        "DELETE SLOT ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete parking slot"
      );
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("Logged out successfully");

    navigate("/login");
  };

  // ==========================================
  // COUNTS
  // ==========================================
  const totalSlots = slots.length;

  const availableSlots = slots.filter(
    (slot) => slot.status === "available"
  ).length;

  const occupiedSlots = slots.filter(
    (slot) => slot.status === "occupied"
  ).length;

  // ==========================================
  // AI VEHICLE COUNTS
  // ==========================================
  const vehicleCounts = {};

  if (aiResult?.detections) {
    aiResult.detections.forEach((item) => {
      const vehicle = item.class;

      vehicleCounts[vehicle] =
        (vehicleCounts[vehicle] || 0) + 1;
    });
  }

  const detectedVehicles =
    aiResult?.total_objects || 0;

  const parkingStatus =
    detectedVehicles >= availableSlots
      ? "Parking Full"
      : "Parking Space Available";

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-800">

      {/* =================================================
          HEADER
      ================================================= */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#0b1220]/95 shadow-xl backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">

          {/* BRAND */}
          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-xl shadow-lg shadow-blue-500/20">
              🅿️
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-400 sm:text-xs">
                Smart Parking AI
              </p>

              <h1 className="text-lg font-bold text-white sm:text-xl">
                Parking Dashboard
              </h1>
            </div>

          </div>

          {/* USER ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-4">

            <div className="hidden text-right lg:block">

              <p className="text-sm font-semibold text-white">
                {user?.name || "User"}
              </p>

              <p className="max-w-[200px] truncate text-xs text-slate-400">
                {user?.email || ""}
              </p>

            </div>

            <button
              onClick={() => navigate("/history")}
              className="rounded-xl border border-blue-400/30 bg-blue-500/10 px-3 py-2.5 text-sm font-semibold text-blue-300 transition hover:border-blue-400/60 hover:bg-blue-500/20 active:scale-95 sm:px-5"
            >
              <span className="hidden sm:inline">
                📋 History
              </span>

              <span className="sm:hidden">
                📋
              </span>
            </button>

            <button
              onClick={handleLogout}
              className="rounded-xl bg-white px-3 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-slate-200 active:scale-95 sm:px-5"
            >
              Logout
            </button>

          </div>
        </div>
      </header>

      {/* =================================================
          MAIN
      ================================================= */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">

        {/* WELCOME */}
        <section className="mb-8">

          <div className="rounded-3xl bg-gradient-to-r from-[#0b1220] via-[#111c35] to-[#172554] p-7 shadow-2xl shadow-slate-300/40 sm:p-9">

            <div className="max-w-3xl">

              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-400"></span>
                System Online
              </div>

              <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                Parking Overview
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
                Manage parking slots, vehicles,
                duration, fees and AI-powered
                vehicle detection from one place.
              </p>

            </div>

          </div>

        </section>

        {/* =================================================
            STATISTICS
        ================================================= */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

          {/* TOTAL */}
          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Total Slots
                </p>

                <p className="mt-2 text-3xl font-black text-slate-900">
                  {totalSlots}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl">
                🅿️
              </div>

            </div>

          </div>

          {/* AVAILABLE */}
          <div className="group rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Available
                </p>

                <p className="mt-2 text-3xl font-black text-emerald-700">
                  {availableSlots}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-xl">
                ✓
              </div>

            </div>

          </div>

          {/* OCCUPIED */}
          <div className="group rounded-2xl border border-red-100 bg-gradient-to-br from-white to-red-50 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-red-600">
                  Occupied
                </p>

                <p className="mt-2 text-3xl font-black text-red-700">
                  {occupiedSlots}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-xl">
                🚗
              </div>

            </div>

          </div>

          {/* SESSIONS */}
          <div className="group rounded-2xl border border-violet-100 bg-gradient-to-br from-white to-violet-50 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-violet-600">
                  Sessions
                </p>

                <p className="mt-2 text-3xl font-black text-violet-700">
                  {stats.totalSessions}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-xl">
                📊
              </div>

            </div>

          </div>

          {/* REVENUE */}
          <div className="group rounded-2xl border border-amber-100 bg-gradient-to-br from-white to-amber-50 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-600">
                  Revenue
                </p>

                <p className="mt-2 text-3xl font-black text-amber-700">
                  ₹{stats.totalRevenue}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-xl">
                ₹
              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            AI DETECTION
        ================================================= */}
        <section className="mt-8 overflow-hidden rounded-3xl border border-blue-200/70 bg-white shadow-xl shadow-blue-100/40">

          {/* AI HEADER */}
          <div className="bg-gradient-to-r from-[#0b1220] via-[#172554] to-[#1d4ed8] p-6 sm:p-7">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-2xl ring-1 ring-white/20">
                  🤖
                </div>

                <div>

                  <h2 className="text-xl font-black text-white sm:text-2xl">
                    AI Vehicle Detection
                  </h2>

                  <p className="mt-1 text-sm text-blue-100">
                    YOLO-powered automatic vehicle detection
                  </p>

                </div>

              </div>

              <span className="w-fit rounded-full border border-green-300/20 bg-green-400/10 px-3 py-1 text-xs font-bold text-green-300">
                ● AI READY
              </span>

            </div>

          </div>

          {/* AI BODY */}
          <div className="p-6 sm:p-7">

            <p className="mb-5 text-sm text-slate-500">
              Upload a parking image and let the AI
              identify vehicles automatically.
            </p>

            <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-blue-300 bg-blue-50/50 p-4 sm:flex-row sm:items-center">

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setSelectedImage(
                    e.target.files?.[0] || null
                  );

                  setAiResult(null);
                }}
                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-600 shadow-sm file:mr-3 file:rounded-lg file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-xs file:font-bold file:text-white hover:file:bg-blue-700"
              />

              <button
                onClick={handleAIDetection}
                disabled={aiLoading}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-700 hover:to-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {aiLoading
                  ? "⏳ Detecting..."
                  : "🔍 Detect Vehicle"}
              </button>

            </div>

            {/* SELECTED IMAGE */}
            {selectedImage && (
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  🖼️
                </div>

                <div className="min-w-0">

                  <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                    Selected Image
                  </p>

                  <p className="truncate text-sm font-semibold text-slate-700">
                    {selectedImage.name}
                  </p>

                </div>

              </div>
            )}

            {/* AI RESULT */}
            {aiResult && (
              <div className="mt-7 space-y-5">

                {/* SUCCESS */}
                <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 p-5">

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                      <p className="text-sm font-black text-emerald-700">
                        ✓ AI Detection Successful
                      </p>

                      <p className="mt-1 text-sm text-emerald-600">
                        YOLO successfully analysed the image.
                      </p>

                    </div>

                    <div className="rounded-2xl bg-white px-6 py-4 text-center shadow-sm">

                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Total Vehicles
                      </p>

                      <p className="mt-1 text-3xl font-black text-slate-900">
                        {aiResult.total_objects || 0}
                      </p>

                    </div>

                  </div>

                </div>

                {/* PARKING STATUS */}
                <div
                  className={`rounded-2xl border p-5 ${
                    parkingStatus === "Parking Full"
                      ? "border-red-200 bg-gradient-to-r from-red-50 to-rose-50"
                      : "border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50"
                  }`}
                >

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                      <p
                        className={`text-xs font-black uppercase tracking-wider ${
                          parkingStatus === "Parking Full"
                            ? "text-red-600"
                            : "text-emerald-600"
                        }`}
                      >
                        🅿️ Parking Status
                      </p>

                      <p
                        className={`mt-1 text-2xl font-black ${
                          parkingStatus === "Parking Full"
                            ? "text-red-700"
                            : "text-emerald-700"
                        }`}
                      >
                        {parkingStatus}
                      </p>

                    </div>

                    <div className="rounded-2xl bg-white px-6 py-4 text-center shadow-sm">

                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Available Slots
                      </p>

                      <p className="mt-1 text-3xl font-black text-slate-900">
                        {availableSlots}
                      </p>

                    </div>

                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">

                    <span className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm">
                      Detected:{" "}
                      <b className="text-blue-600">
                        {detectedVehicles}
                      </b>
                    </span>

                    <span className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm">
                      Available:{" "}
                      <b className="text-emerald-600">
                        {availableSlots}
                      </b>
                    </span>

                  </div>

                </div>

                {/* VEHICLE COUNTS */}
                {Object.keys(vehicleCounts).length > 0 && (
                  <div>

                    <div className="mb-4 flex items-center gap-2">

                      <div className="h-8 w-1 rounded-full bg-blue-600"></div>

                      <h3 className="text-lg font-black text-slate-900">
                        Vehicle Count
                      </h3>

                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                      {Object.entries(
                        vehicleCounts
                      ).map(([vehicle, count]) => (

                        <div
                          key={vehicle}
                          className="rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                        >

                          <div className="flex items-center justify-between">

                            <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                              {vehicle}
                            </p>

                            <span className="text-xl">
                              🚗
                            </span>

                          </div>

                          <p className="mt-3 text-4xl font-black text-blue-700">
                            {count}
                          </p>

                          <p className="mt-1 text-xs font-semibold text-slate-400">
                            Vehicle detected
                          </p>

                        </div>

                      ))}

                    </div>

                  </div>
                )}

                {/* DETECTION DETAILS */}
                {aiResult.detections?.length > 0 && (
                  <div>

                    <div className="mb-4 flex items-center gap-2">

                      <div className="h-8 w-1 rounded-full bg-indigo-600"></div>

                      <h3 className="text-lg font-black text-slate-900">
                        Detection Details
                      </h3>

                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200">

                      <div className="overflow-x-auto">

                        <table className="min-w-full text-sm">

                          <thead className="bg-slate-900">

                            <tr>

                              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">
                                Object
                              </th>

                              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-300">
                                Confidence
                              </th>

                            </tr>

                          </thead>

                          <tbody className="bg-white">

                            {aiResult.detections.map(
                              (item, index) => (

                                <tr
                                  key={index}
                                  className="border-t border-slate-100 transition hover:bg-blue-50/50"
                                >

                                  <td className="px-5 py-4 font-bold capitalize text-slate-800">
                                    {item.class}
                                  </td>

                                  <td className="px-5 py-4">

                                    <div className="flex items-center gap-3">

                                      <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200">

                                        <div
                                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
                                          style={{
                                            width: `${Math.min(
                                              item.confidence * 100,
                                              100
                                            )}%`,
                                          }}
                                        ></div>

                                      </div>

                                      <span className="font-black text-blue-700">
                                        {(
                                          item.confidence *
                                          100
                                        ).toFixed(0)}
                                        %
                                      </span>

                                    </div>

                                  </td>

                                </tr>

                              )
                            )}

                          </tbody>

                        </table>

                      </div>

                    </div>

                  </div>
                )}

              </div>
            )}

          </div>

        </section>

        {/* =================================================
            ADD PARKING SLOT
        ================================================= */}
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-7">

          <div className="mb-5 flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl">
              ➕
            </div>

            <div>

              <h2 className="text-xl font-black text-slate-900">
                Add Parking Slot
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Create a new parking slot.
              </p>

            </div>

          </div>

          <form
            onSubmit={handleAddSlot}
            className="flex flex-col gap-3 sm:flex-row"
          >

            <input
              type="text"
              value={slotNumber}
              onChange={(e) =>
                setSlotNumber(e.target.value)
              }
              placeholder="Enter slot number e.g. A-05"
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />

            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3.5 font-bold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-700 hover:to-indigo-700 active:scale-95"
            >
              + Add Slot
            </button>

          </form>

        </section>

        {/* =================================================
            PARKING SLOTS
        ================================================= */}
        <section className="mt-8">

          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <h2 className="text-2xl font-black text-slate-900">
                Parking Slots
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Monitor and manage all parking spaces.
              </p>

            </div>

            <div className="flex gap-2">

              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                ● {availableSlots} Available
              </span>

              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                ● {occupiedSlots} Occupied
              </span>

            </div>

          </div>

          {/* LOADING */}
          {loading ? (

            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">

              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>

              <p className="font-semibold text-slate-600">
                Loading parking slots...
              </p>

            </div>

          ) : slots.length === 0 ? (

            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">

              <div className="text-5xl">
                🅿️
              </div>

              <p className="mt-4 font-bold text-slate-700">
                No parking slots found
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Add your first parking slot above.
              </p>

            </div>

          ) : (

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

              {slots.map((slot) => {

                const isAvailable =
                  slot.status === "available";

                const fee = calculateFee(
                  slot.entryTime,
                  slot.exitTime
                );

                return (

                  <div
                    key={slot._id}
                    className={`group overflow-hidden rounded-3xl border bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                      isAvailable
                        ? "border-emerald-100"
                        : "border-red-100"
                    }`}
                  >

                    {/* CARD TOP */}
                    <div
                      className={`h-2 ${
                        isAvailable
                          ? "bg-gradient-to-r from-emerald-400 to-green-600"
                          : "bg-gradient-to-r from-red-400 to-rose-600"
                      }`}
                    ></div>

                    <div className="p-5">

                      {/* SLOT HEADER */}
                      <div className="flex items-start justify-between">

                        <div>

                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            Parking Slot
                          </p>

                          <h3 className="mt-1 text-3xl font-black text-slate-900">
                            {slot.slotNumber}
                          </h3>

                        </div>

                        <span
                          className={`rounded-full px-3 py-1.5 text-[10px] font-black tracking-wide ${
                            isAvailable
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {isAvailable
                            ? "● AVAILABLE"
                            : "● OCCUPIED"}
                        </span>

                      </div>

                      {/* VEHICLE INFO */}
                      <div className="mt-5 rounded-2xl bg-slate-50 p-4">

                        <div className="flex items-center gap-3">

                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                              isAvailable
                                ? "bg-emerald-100"
                                : "bg-red-100"
                            }`}
                          >
                            🚗
                          </div>

                          <div className="min-w-0">

                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                              Vehicle
                            </p>

                            <p className="truncate text-sm font-black uppercase text-slate-800">
                              {slot.vehicleNumber ||
                                "No vehicle parked"}
                            </p>

                          </div>

                        </div>

                        {/* TIMES */}
                        <div className="mt-5 grid grid-cols-2 gap-4">

                          <div>

                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Entry Time
                            </p>

                            <p className="mt-1 text-xs font-bold text-slate-700">
                              {formatDateTime(
                                slot.entryTime
                              )}
                            </p>

                          </div>

                          <div>

                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Exit Time
                            </p>

                            <p className="mt-1 text-xs font-bold text-slate-700">
                              {formatDateTime(
                                slot.exitTime
                              )}
                            </p>

                          </div>

                        </div>

                        {/* DURATION */}
                        <div className="mt-4 border-t border-slate-200 pt-4">

                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Total Duration
                          </p>

                          <p className="mt-1 text-lg font-black text-slate-800">
                            {slot.entryTime
                              ? calculateDuration(
                                  slot.entryTime,
                                  slot.exitTime
                                )
                              : "—"}
                          </p>

                        </div>

                        {/* FEE */}
                        <div className="mt-4 flex items-center justify-between rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3">

                          <div>

                            <p className="text-[10px] font-black uppercase tracking-wider text-blue-600">
                              Parking Fee
                            </p>

                            <p className="mt-1 text-[10px] font-semibold text-blue-400">
                              ₹20 / started hour
                            </p>

                          </div>

                          <p className="text-2xl font-black text-blue-700">
                            ₹{fee}
                          </p>

                        </div>

                      </div>

                      {/* BUTTONS */}
                      <div className="mt-5 grid grid-cols-2 gap-3">

                        <button
                          onClick={() =>
                            handleUpdateSlot(
                              slot._id,
                              slot.status,
                              slot.vehicleNumber
                            )
                          }
                          className={`rounded-xl p-3 text-sm font-bold text-white shadow-md transition active:scale-95 ${
                            isAvailable
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                              : "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                          }`}
                        >
                          {isAvailable
                            ? "🚗 Park Vehicle"
                            : "✓ Vehicle Exit"}
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteSlot(
                              slot._id
                            )
                          }
                          className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-600 transition hover:bg-red-100 active:scale-95"
                        >
                          🗑 Delete
                        </button>

                      </div>

                    </div>

                  </div>

                );
              })}

            </div>

          )}

        </section>

        {/* FOOTER */}
        <footer className="mt-12 border-t border-slate-200 py-6 text-center">

          <p className="text-xs font-semibold text-slate-400">
            Smart Parking AI • AI Powered Parking Management System
          </p>

        </footer>

      </main>
    </div>
  );
}

export default Parking;