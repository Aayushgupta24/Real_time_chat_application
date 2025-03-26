import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import ChatLayout from "./components/ChatLayout";
import { useState } from "react";

function App() {
    const [token, setToken] = useState(localStorage.getItem("token"));

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login setToken={setToken} />} />
                <Route path="/register" element={<Register />} />
                <Route 
                    path="/chat" 
                    element={
                        token ? <ChatLayout /> : <Login setToken={setToken} />
                    } 
                />
            </Routes>
        </Router>
    );
}

export default App;


