import { Link } from "react-router-dom";

function Register() {
  const handleSubmit = (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    alert("Registration form submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <nav className="flex items-center justify-between border-b border-slate-800 px-8 py-5">
        <Link to="/" className="text-lg font-bold">
          Smart Parking
          <span className="text-blue-500"> AI</span>
        </Link>

        <Link to="/" className="text-slate-400 hover:text-blue-400">
          Back to Home
        </Link>
      </nav>

      <section className="flex min-h-[80vh] items-center justify-center px-6 py-10">

        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">

          <div className="mb-8 text-center">
            <p className="font-semibold tracking-wider text-blue-400">
              SMART PARKING SYSTEM
            </p>

            <h1 className="mt-3 text-3xl font-bold">
              Create Account
            </h1>

            <p className="mt-2 text-slate-400">
              Register to use the smart parking system
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="mb-2 block text-sm font-medium">
                Full Name
              </label>

              <input
                name="name"
                type="text"
                placeholder="Enter your full name"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Email Address
              </label>

              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Password
              </label>

              <input
                name="password"
                type="password"
                placeholder="Create a password"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Confirm Password
              </label>

              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold transition hover:bg-blue-700"
            >
              Create Account
            </button>

          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-400 hover:text-blue-300"
            >
              Login
            </Link>
          </p>

        </div>
      </section>

      <footer className="border-t border-slate-800 px-8 py-6 text-center text-sm text-slate-500">
        © 2026 Design of a Smart Parking System Using AI Techniques
      </footer>

    </div>
  );
}

export default Register;
