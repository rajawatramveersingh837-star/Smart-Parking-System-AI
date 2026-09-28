import { Link } from "react-router-dom";

function About() {
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

          <Link to="/about" className="text-blue-400">
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

      {/* About Section */}
      <section className="px-6 py-20">

        <div className="mx-auto max-w-4xl text-center">

          <p className="mb-4 font-semibold tracking-wider text-blue-400">
            ABOUT THE PROJECT
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Design of a Smart Parking
            <span className="block text-blue-500">
              System Using AI Techniques
            </span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            This project aims to develop an intelligent parking management
            system using Artificial Intelligence and modern web technologies.
            The system helps users find available parking spaces and provides
            efficient parking management.
          </p>

        </div>

        {/* Objectives */}
        <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-3">

          {/* AI Detection */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">

            <div className="mb-4 text-3xl">
              🤖
            </div>

            <h2 className="text-xl font-bold">
              AI Based Detection
            </h2>

            <p className="mt-3 text-slate-400">
              Detect vehicles in parking images using AI and computer vision
              techniques such as YOLO and OpenCV.
            </p>

          </div>

          {/* Parking Management */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">

            <div className="mb-4 text-3xl">
              🅿️
            </div>

            <h2 className="text-xl font-bold">
              Parking Management
            </h2>

            <p className="mt-3 text-slate-400">
              Manage parking spaces and help users identify available slots.
            </p>

          </div>

          {/* Fee Calculation */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">

            <div className="mb-4 text-3xl">
              💰
            </div>

            <h2 className="text-xl font-bold">
              Fee Calculation
            </h2>

            <p className="mt-3 text-slate-400">
              Calculate parking fees according to the duration of parking.
            </p>

          </div>

        </div>

        {/* Technology Stack */}
        <div className="mx-auto mt-16 max-w-4xl rounded-xl border border-slate-800 bg-slate-900 p-8">

          <h2 className="text-center text-2xl font-bold">
            Technology Stack
          </h2>

          <div className="mt-6 flex flex-wrap justify-center gap-3">

            <span className="rounded-lg bg-slate-800 px-4 py-2">
              React.js
            </span>

            <span className="rounded-lg bg-slate-800 px-4 py-2">
              Tailwind CSS
            </span>

            <span className="rounded-lg bg-slate-800 px-4 py-2">
              Node.js
            </span>

            <span className="rounded-lg bg-slate-800 px-4 py-2">
              Express.js
            </span>

            <span className="rounded-lg bg-slate-800 px-4 py-2">
              MongoDB
            </span>

            <span className="rounded-lg bg-slate-800 px-4 py-2">
              Python
            </span>

            <span className="rounded-lg bg-slate-800 px-4 py-2">
              FastAPI
            </span>

            <span className="rounded-lg bg-slate-800 px-4 py-2">
              YOLO
            </span>

            <span className="rounded-lg bg-slate-800 px-4 py-2">
              OpenCV
            </span>

          </div>

        </div>

      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-8 py-6 text-center text-sm text-slate-500">

        © 2026 Design of a Smart Parking System Using AI Techniques

      </footer>

    </div>
  );
}

export default About;