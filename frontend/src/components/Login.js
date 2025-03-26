import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login({ setToken }) {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            // Validate input
            if (!formData.username || !formData.password) {
                throw new Error("Username and password are required");
            }

            const requestData = {
                username: formData.username.trim().toLowerCase(), // Add toLowerCase()
                password: formData.password
            };

            console.log('Sending login request with data:', {
                username: requestData.username,
                passwordLength: requestData.password.length
            });

            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                requestData
            );

            console.log('Login response:', response.data);

            // Store token and user data
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userId", response.data.user.id);
            localStorage.setItem("username", response.data.user.username);
            
            // Update app state
            setToken(response.data.token);
            
            // Navigate to chat
            navigate("/chat");

        } catch (error) {
            console.error("Login error details:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            setError(
                error.response?.data?.error || 
                error.message || 
                "Login failed. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-form">
            <form onSubmit={handleSubmit}>
                <h2>Welcome Back</h2>
                
                {error && (
                    <div className="error-message">{error}</div>
                )}
                
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Enter your username"
                        disabled={isLoading}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        disabled={isLoading}
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className={isLoading ? 'loading' : ''}
                >
                    {isLoading ? "Logging in..." : "Login"}
                </button>

                <div className="auth-links">
                    <p>
                        Don't have an account? <Link to="/register">Register</Link>
                    </p>
                </div>
            </form>
        </div>
    );
}

export default Login;
