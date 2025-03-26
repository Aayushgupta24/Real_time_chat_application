import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaCheck, FaTimes } from 'react-icons/fa';
import '../styles/Auth.css';

function Register() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const passwordRequirements = {
        minLength: formData.password.length >= 8,
        hasUppercase: /[A-Z]/.test(formData.password),
        hasLowercase: /[a-z]/.test(formData.password),
        hasNumber: /[0-9]/.test(formData.password),
        hasSpecial: /[!@#$%^&*]/.test(formData.password),
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError("");
    };

    const validateForm = () => {
        if (!formData.username.trim()) {
            setError("Username is required");
            return false;
        }
        if (!formData.email.trim()) {
            setError("Email is required");
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError("Invalid email format");
            return false;
        }
        if (!Object.values(passwordRequirements).every(Boolean)) {
            setError("Password does not meet all requirements");
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        
        try {
            const response = await axios.post("http://localhost:5000/api/auth/register", {
                username: formData.username.trim(),
                email: formData.email.trim(),
                password: formData.password
            });
            
            setSuccess("Registration successful! Redirecting...");
            localStorage.setItem("token", response.data.token);
            
            setTimeout(() => {
                navigate("/chat");
            }, 1500);
        } catch (error) {
            console.error("Registration error:", error);
            const errorMessage = error.response?.data?.error || 
                               "Registration failed. Please try again.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Create Account</h2>
                
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            disabled={isLoading}
                            required
                            minLength={3}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            disabled={isLoading}
                            required
                        />
                        <div className="password-requirements">
                            <div className={`requirement ${passwordRequirements.minLength ? 'met' : ''}`}>
                                {passwordRequirements.minLength ? <FaCheck /> : <FaTimes />}
                                At least 8 characters
                            </div>
                            <div className={`requirement ${passwordRequirements.hasUppercase ? 'met' : ''}`}>
                                {passwordRequirements.hasUppercase ? <FaCheck /> : <FaTimes />}
                                One uppercase letter
                            </div>
                            <div className={`requirement ${passwordRequirements.hasLowercase ? 'met' : ''}`}>
                                {passwordRequirements.hasLowercase ? <FaCheck /> : <FaTimes />}
                                One lowercase letter
                            </div>
                            <div className={`requirement ${passwordRequirements.hasNumber ? 'met' : ''}`}>
                                {passwordRequirements.hasNumber ? <FaCheck /> : <FaTimes />}
                                One number
                            </div>
                            <div className={`requirement ${passwordRequirements.hasSpecial ? 'met' : ''}`}>
                                {passwordRequirements.hasSpecial ? <FaCheck /> : <FaTimes />}
                                One special character
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <div className="loading-spinner"></div>
                        ) : (
                            "Create Account"
                        )}
                    </button>

                    <div className="nav-links">
                        Already have an account? <Link to="/login">Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
