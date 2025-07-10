import { Link, useNavigate } from "react-router";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";

const Navbar = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check token on component mount
    useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        setIsLoggedIn(false);
        navigate("/login");
    };

    return (
        <header className="bg-base-300 border-b border-base-content/10">
            <div className="mx-auto max-w-6xl p-4">
            <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-primary font-mono tracking-tighter">
                Todo App
            </h1>

            <div className="flex items-center gap-4">
                {isLoggedIn ? (
                <>
                    <Link to="/create" className="btn btn-primary">
                    <PlusIcon className="size-5" />
                    <span>Add Todo</span>
                    </Link>
                    <button onClick={handleLogout} className="btn btn-outline btn-error">
                    Logout
                    </button>
                </>
                ) : (
                <>
                <Link to="/login" className="btn btn-outline">
                    Login
                </Link>
                <Link to="/signup" className="btn btn-outline btn-primary">
                    Signup
                </Link>
                </>
            )}
            </div>
        </div>
        </div>
    </header>
    );
};

export default Navbar;
