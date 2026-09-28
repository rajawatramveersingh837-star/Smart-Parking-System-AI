import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function History() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            const response = await axios.get("/api/parking/history", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setHistory(response.data);
        } catch (error) {
            console.error("HISTORY FETCH ERROR:", error);

            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
            } else {
                alert(
                    error.response?.data?.message ||
                    "Failed to load parking history"
                );
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const formatDateTime = (date) => {
        if (!date) return "—";

        return new Date(date).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short"
        });
    };

    const formatDuration = (minutes) => {
        if (!minutes) return "—";

        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (hours === 0) {
            return `${remainingMinutes} min`;
        }

        if (remainingMinutes === 0) {
            return `${hours} hr`;
        }

        return `${hours} hr ${remainingMinutes} min`;
    };

    return (
        <div className="min-h-screen bg-slate-50">

            {/* Header */}
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

                    <div>
                        <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
                            Smart Parking AI
                        </p>

                        <h1 className="text-2xl font-bold text-slate-900">
                            Parking History
                        </h1>
                    </div>

                    <div className="flex gap-3">

                        <button
                            onClick={() => navigate("/parking")}
                            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                            ← Dashboard
                        </button>

                        <button
                            onClick={() => {
                                localStorage.removeItem("token");
                                localStorage.removeItem("user");
                                navigate("/login");
                            }}
                            className="rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
                        >
                            Logout
                        </button>

                    </div>

                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-6 py-8">

                {/* Page Introduction */}
                <div className="mb-8">

                    <h2 className="text-3xl font-bold text-slate-900">
                        Previous Parking Records
                    </h2>

                    <p className="mt-2 text-slate-500">
                        View completed parking sessions, duration and fees.
                    </p>

                </div>

                {/* Loading */}
                {loading && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                        <p className="text-slate-500">
                            Loading parking history...
                        </p>
                    </div>
                )}

                {/* Empty History */}
                {!loading && history.length === 0 && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

                        <div className="mb-4 text-5xl">
                            📋
                        </div>

                        <h3 className="text-xl font-bold text-slate-800">
                            No Parking History
                        </h3>

                        <p className="mt-2 text-slate-500">
                            Completed parking sessions will appear here.
                        </p>

                        <button
                            onClick={() => navigate("/parking")}
                            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                        >
                            Go to Dashboard
                        </button>

                    </div>
                )}

                {/* History Table */}
                {!loading && history.length > 0 && (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[900px]">

                                <thead className="bg-slate-100">

                                    <tr>

                                        <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                                            Slot
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                                            Vehicle Number
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                                            Entry Time
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                                            Exit Time
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                                            Duration
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                                            Parking Fee
                                        </th>

                                    </tr>

                                </thead>

                                <tbody className="divide-y divide-slate-200">

                                    {history.map((record) => (

                                        <tr
                                            key={record._id}
                                            className="transition hover:bg-slate-50"
                                        >

                                            <td className="px-6 py-5">

                                                <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-700">
                                                    {record.slotNumber}
                                                </span>

                                            </td>

                                            <td className="px-6 py-5 text-sm font-semibold text-slate-800">
                                                {record.vehicleNumber}
                                            </td>

                                            <td className="px-6 py-5 text-sm text-slate-600">
                                                {formatDateTime(record.entryTime)}
                                            </td>

                                            <td className="px-6 py-5 text-sm text-slate-600">
                                                {formatDateTime(record.exitTime)}
                                            </td>

                                            <td className="px-6 py-5 text-sm font-medium text-slate-700">
                                                {formatDuration(record.durationMinutes)}
                                            </td>

                                            <td className="px-6 py-5">

                                                <span className="font-bold text-green-600">
                                                    ₹{record.parkingFee}
                                                </span>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    </div>
                )}

            </main>

        </div>
    );
}

export default History;