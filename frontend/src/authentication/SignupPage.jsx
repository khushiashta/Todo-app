import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import toast from "react-hot-toast";
import api from "../lib/axios";

const SignupPage = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

    if (!username || !email || !password) {
        toast.error("All fields are required");
        return;
    }

    try {
        await api.post("/todos/auth/signup", {
            username,
            email,
            password,
        });

        toast.success("Signup successful!");
        navigate("/login");
    } catch (err) {
        toast.error(err.response?.data?.error || "Signup failed");
    }
    };

    return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="card w-full max-w-md bg-base-100 shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-primary">
            Signup
        </h2>
        <form onSubmit={handleSignup} className="space-y-4">
            <div className="form-control">
            <label className="label">
                <span className="label-text">Username</span>
            </label>
            <input
                type="text"
                placeholder="Choose a username"
                className="input input-bordered"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
            />
            </div>

            <div className="form-control">
            <label className="label">
                <span className="label-text">Email</span>
            </label>
            <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
            />
            </div>

            <div className="form-control">
            <label className="label">
                <span className="label-text">Password</span>
            </label>
            <input
                type="password"
                placeholder="Create a password"
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
            />
            </div>

            <div className="form-control mt-6">
            <button type="submit" className="btn btn-primary w-full">
                Signup
            </button>
            </div>
        </form>

        <p className="text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-primary underline">
            Login
            </Link>
        </p>
        </div>
    </div>
    );
};

export default SignupPage;
