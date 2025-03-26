import { Link } from "react-router-dom";
import { FaComments, FaLock, FaUsers } from 'react-icons/fa';
import { motion } from 'framer-motion';

function Home() {
    return (
        <div className="container home-container">
            <nav className="home-nav">
                <div className="logo">
                    <img src="/logo.svg" alt="ChatApp Logo" />
                    <span>ChatApp</span>
                </div>
                <div className="nav-buttons">
                    <Link to="/login" className="nav-button">Login</Link>
                    <Link to="/register" className="nav-button primary">Get Started</Link>
                </div>
            </nav>

            <motion.div 
                className="hero-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1>Connect with your team in real-time</h1>
                <p className="subtitle">
                    Experience seamless communication with your team through our secure and intuitive platform
                </p>
                <div className="cta-buttons">
                    <Link to="/register" className="cta-button primary">
                        Start for Free
                    </Link>
                    <Link to="/login" className="cta-button secondary">
                        Login to Account
                    </Link>
                </div>
            </motion.div>

            <motion.div 
                className="features-grid"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <div className="feature-card">
                    <div className="feature-icon">
                        <FaComments />
                    </div>
                    <h3>Real-time Chat</h3>
                    <p>Instant messaging with your team members. Stay connected and collaborate effectively.</p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon">
                        <FaUsers />
                    </div>
                    <h3>Team Channels</h3>
                    <p>Create dedicated channels for different topics and keep conversations organized.</p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon">
                        <FaLock />
                    </div>
                    <h3>Secure Communication</h3>
                    <p>End-to-end encrypted messages ensure your team's conversations remain private.</p>
                </div>
            </motion.div>

            <footer className="home-footer">
                <div className="footer-content">
                    <p>© 2024 ChatApp. All rights reserved.</p>
                    <div className="footer-links">
                        <a href="/privacy">Privacy Policy</a>
                        <a href="/terms">Terms of Service</a>
                        <a href="/contact">Contact Us</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home;
