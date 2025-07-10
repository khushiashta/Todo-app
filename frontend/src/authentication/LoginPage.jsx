import { useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import api from "../lib/axios";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

    if (!email || !password) {
        toast.error("Both fields required");
        return;
    }

    try {
        const res = await api.post("/todos/auth/login", { email, password });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("email", res.data.email);
        toast.success("Logged in");
        navigate("/");
    } catch (err) {
        toast.error(err.response?.data?.error || "Login failed");
    }
    };

    return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="card w-full max-w-md bg-base-100 shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-primary">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
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
            />
            </div>

            <div className="form-control">
            <label className="label">
                <span className="label-text">Password</span>
            </label>
            <input
                type="password"
                placeholder="Enter your password"
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
            />
            </div>

            <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary w-full">
                    Login
                </button>
            </div>
        </form>
        </div>
    </div>
    );
};

export default LoginPage;
