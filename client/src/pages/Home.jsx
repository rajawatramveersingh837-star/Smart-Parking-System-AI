import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between border-b border-slate-800 px-8 py-5">

        <Link to="/" className="text-lg font-bold">
          Smart Parking
          <span className="text-blue-500"> AI</span>
        </Link>

        <div className="flex gap-6">
          <Link to="/" className="hover:text-blue-400">
            Home
          </Link>

          <Link to="/about" className="hover:text-blue-400">
            About
          </Link>

          <Link to="/parking" className="hover:text-blue-400">
            Parking
          </Link>

          <Link to="/login" className="hover:text-blue-400">
            Login
          </Link>
        </div>

      </nav>

      {/* Hero Section */}
      <section className="flex min-h-[75vh] items-center justify-center px-6 text-center">

        <div className="max-w-4xl">

          <p className="mb-5 font-semibold tracking-wider text-blue-400">
            AI-POWERED SMART PARKING SYSTEM
          </p>

          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            Design of a Smart Parking
            <span className="block text-blue-500">
              System Using AI Techniques
            </span>
          </h1>

          {/* Developer */}
          <p className="mt-5 text-lg text-slate-400">
            Developed by{" "}
            <span className="font-semibold text-white">
              Ramveer Singh
            </span>
          </p>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            An intelligent parking management system that combines
            Artificial Intelligence, computer vision, and modern web
            technologies to detect vehicles, manage parking spaces,
            and calculate parking fees efficiently.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex justify-center gap-4">

            <Link
              to="/parking"
              className="rounded-lg bg-blue-600 px-7 py-3 font-semibold transition hover:bg-blue-700"
            >
              Find Parking
            </Link>

            <Link
              to="/about"
              className="rounded-lg border border-slate-600 px-7 py-3 font-semibold transition hover:bg-slate-800"
            >
              Learn More
            </Link>

          </div>

        </div>

      </section>

      {/* Features Section */}
      <section className="grid gap-6 px-8 pb-14 md:grid-cols-3">

        {/* Feature 1 */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 transition hover:border-blue-500">

          <div className="mb-4 text-3xl">
            🚗
          </div>

          <h2 className="text-xl font-bold">
            Smart Parking
          </h2>

          <p className="mt-3 text-slate-400">
            Quickly find available parking spaces and manage parking
            efficiently.
          </p>

        </div>

        {/* Feature 2 */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 transition hover:border-blue-500">

          <div className="mb-4 text-3xl">
            🤖
          </div>

          <h2 className="text-xl font-bold">
            AI Vehicle Detection
          </h2>

          <p className="mt-3 text-slate-400">
            Use AI and computer vision techniques such as YOLO and
            OpenCV to detect vehicles in parking images.
          </p>

        </div>

        {/* Feature 3 */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 transition hover:border-blue-500">

          <div className="mb-4 text-3xl">
            💳
          </div>

          <h2 className="text-xl font-bold">
            Smart Fee Calculation
          </h2>

          <p className="mt-3 text-slate-400">
            Calculate parking fees based on parking duration and
            vehicle usage.
          </p>

        </div>

      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-8 py-6 text-center text-sm text-slate-500">

        <p>
          © 2026 Design of a Smart Parking System Using AI Techniques
        </p>

        <p className="mt-2">
          Made by{" "}
          <span className="font-semibold text-blue-400">
            Ramveer Singh
          </span>
        </p>

      </footer>

    </div>
  );
}

export default Home;