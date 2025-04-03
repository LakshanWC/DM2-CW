import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login({ handleLogin: handleParentLogin }) {
    const [isLoginHoverd, setLoginHoverd] = useState(false);
    const [isRegisterHoverd, setRegisterHoverd] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("customer");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleRegisterOnClick = () => {
        navigate("/register");
    };

    const handleUserLogin = () => {  // Renamed from handleLogin to handleUserLogin
        const validationErrors = {};

        if (!username) {
            validationErrors.username = "Username is required";
        }

        if (!password) {
            validationErrors.password = "Password is required";
        }

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            // If username and password are provided, navigate to /home
            if (username && password) {
                handleParentLogin(username, true);
                navigate("/home");
            } else {
                handleParentLogin(null, false);
                alert("Invalid login credentials!");
            }
        }
    };

    return (
        <div style={LoginComponentStyle.pageBackground}>
            <div style={LoginComponentStyle.componentBox}>
                <div style={LoginComponentStyle.titleBox}>
                    <h2 style={LoginComponentStyle.title}>Welcome to UrbanFood</h2>
                </div>

                <div style={LoginComponentStyle.formGroup}>
                    <label style={LoginComponentStyle.label}>Login as:</label>
                    <select
                        style={LoginComponentStyle.select}
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="customer">Customer</option>
                        <option value="supplier">Supplier</option>
                        <option value="admin">Admin</option>
                    </select>
                    {errors.role && <p style={LoginComponentStyle.errorText}>{errors.role}</p>}
                </div>

                <div style={LoginComponentStyle.formGroup}>
                    <label style={LoginComponentStyle.label}>Username:</label>
                    <input
                        type="text"
                        style={LoginComponentStyle.input}
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {errors.username && <p style={LoginComponentStyle.errorText}>{errors.username}</p>}
                </div>
                <div style={LoginComponentStyle.formGroup}>
                    <label style={LoginComponentStyle.label}>Password:</label>
                    <input
                        type="password"
                        style={LoginComponentStyle.input}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && <p style={LoginComponentStyle.errorText}>{errors.password}</p>}
                </div>

                <div style={LoginComponentStyle.buttonGroup}>
                    <button
                        style={isLoginHoverd ? LoginComponentStyle.btnLoginHover : LoginComponentStyle.btnLogin}
                        onMouseEnter={() => setLoginHoverd(true)}
                        onMouseLeave={() => setLoginHoverd(false)}
                        onClick={handleUserLogin}
                    >
                        Login
                    </button>

                    <button
                        style={isRegisterHoverd ? LoginComponentStyle.btnRegisterHover : LoginComponentStyle.btnRegister}
                        onMouseEnter={() => setRegisterHoverd(true)}
                        onMouseLeave={() => setRegisterHoverd(false)}
                        onClick={handleRegisterOnClick}
                    >
                        Register
                    </button>
                </div>

                <div style={LoginComponentStyle.linksContainer}>
                    <Link to="/forgot-password" style={LoginComponentStyle.link}>Forgot Password?</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;


const LoginComponentStyle = {
    pageBackground: {
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f8e7",
        backgroundImage: "linear-gradient(to right, #a8e063, #56ab2f)",
    },
    componentBox: {
        width: "400px",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 6px 16px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#ffffff",
        textAlign: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    titleBox: {
        backgroundColor: "#f8f9fa",
        padding: "20px",
        borderRadius: "8px",
        marginBottom: "30px",
        border: "1px solid #e9ecef",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)"
    },
    title: {
        color: "#2c3e50",
        margin: "0",
        fontSize: "26px",
        fontWeight: "700"
    },
    formGroup: {
        marginBottom: "20px",
        textAlign: "left"
    },
    label: {
        display: "block",
        marginBottom: "8px",
        color: "#333",
        fontSize: "15px",
        fontWeight: "600"
    },
    select: {
        width: "100%",
        padding: "12px 15px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "15px",
        backgroundColor: "#fff",
        cursor: "pointer",
        transition: "all 0.3s",
    },
    input: {
        width: "100%",
        padding: "12px 15px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "15px",
        boxSizing: "border-box", // Ensures padding does not cause overflow
        transition: "border 0.3s",
    },
    buttonGroup: {
        display: "flex",
        gap: "15px",
        marginTop: "20px"
    },
    btnLogin: {
        flex: 1,
        padding: "14px",
        backgroundColor: "#27ae60",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "600",
        transition: "all 0.3s",
    },
    btnLoginHover: {
        flex: 1,
        padding: "14px",
        backgroundColor: "#1e8449",
        transform: "scale(1.05)",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "600",
        transition: "all 0.3s",
    },
    btnRegister: {
        flex: 1,
        padding: "14px",
        backgroundColor: "#f39c12",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "600",
        transition: "all 0.3s",
    },
    btnRegisterHover: {
        flex: 1,
        padding: "14px",
        backgroundColor: "#e67e22",
        transform: "scale(1.05)",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "600",
        transition: "all 0.3s",
    },
    linksContainer: {
        marginTop: "20px",
        textAlign: "center"
    },
    link: {
        color: "#27ae60",
        textDecoration: "none",
        fontSize: "14px",
        fontWeight: "500",
        transition: "color 0.2s",
    },
    errorText: {
        color: "#e74c3c",
        fontSize: "12px",
        marginTop: "5px",
        textAlign: "left"
    }
};
