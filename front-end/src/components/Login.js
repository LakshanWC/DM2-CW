import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ handleLogin: handleParentLogin }) {
    const [isLoginHoverd, setLoginHoverd] = useState(false);
    const [isRegisterHoverd, setRegisterHoverd] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("customer");
    const [errors, setErrors] = useState({
        username: "",
        password: "",
        api: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegisterOnClick = () => {
        navigate("/register");
    };

    const handleUserLogin = async () => {
        // Reset errors
        setErrors({
            username: "",
            password: "",
            api: ""
        });

        // Validate inputs
        const newErrors = {};
        if (!username) newErrors.username = "Username is required";
        if (!password) newErrors.password = "Password is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);

        try {
            if (role === "admin") {
                try {
                    const response = await axios.get("http://localhost:8081/users", {
                        params: {
                            username: username,
                            password: password,
                            role: role
                        }
                    });

                    const data = response.data;

                    if (data.startsWith("Valid user|")) {
                        const userId = data.split("|")[1]; // Extracts 'ADMIN001', for example
                        handleParentLogin(username, true, "admin", userId);
                        navigate("/admin-dashboard");
                    } else {
                        setErrors(prev => ({
                            ...prev,
                            api: "Invalid admin credentials!"
                        }));
                    }
                } catch (error) {
                    console.error("Admin login error:", error);
                    setErrors(prev => ({
                        ...prev,
                        api: "Server error. Please try again later."
                    }));
                }
            }
            else if (role === "customer") {
                try {
                    const response = await axios.get("http://localhost:8081/users", {
                        params: {
                            username: username,
                            password: password,
                            role: role
                        }
                    });

                    const data = response.data;

                    if (data.startsWith("Valid user|")) {
                        const userId = data.split("|")[1]; // Extracts 'U001'
                        handleParentLogin(username, true, "customer", userId); //passing the userId
                        navigate("/home");
                    } else {
                        setErrors(prev => ({
                            ...prev,
                            api: "Invalid customer credentials!"
                        }));
                    }
                } catch (error) {
                    console.error("Login error:", error);
                    setErrors(prev => ({
                        ...prev,
                        api: "Server error. Please try again later."
                    }));
                }
            }
            else {
                handleParentLogin(username, true, role);
                navigate("/home");
            }

        } catch (error) {
            setErrors(prev => ({
                ...prev,
                api: "An error occurred during login. Please try again."
            }));
            console.error("Login error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.pageBackground}>
            <div style={styles.componentBox}>
                <div style={styles.titleBox}>
                    <h2 style={styles.title}>Welcome to UrbanFood</h2>
                </div>

                {/* API Error Message */}
                {errors.api && (
                    <div style={styles.apiErrorBox}>
                        {errors.api}
                    </div>
                )}

                <div style={styles.formGroup}>
                    <label style={styles.label}>Login as:</label>
                    <select
                        style={styles.select}
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="customer">Customer</option>
                        <option value="supplier">Supplier</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Username:</label>
                    <input
                        type="text"
                        style={styles.input}
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {errors.username && <p style={styles.errorText}>{errors.username}</p>}
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Password:</label>
                    <input
                        type="password"
                        style={styles.input}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && <p style={styles.errorText}>{errors.password}</p>}
                </div>

                <div style={styles.buttonGroup}>
                    <button
                        style={isLoginHoverd ? styles.btnLoginHover : styles.btnLogin}
                        onMouseEnter={() => setLoginHoverd(true)}
                        onMouseLeave={() => setLoginHoverd(false)}
                        onClick={handleUserLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>

                    <button
                        style={isRegisterHoverd ? styles.btnRegisterHover : styles.btnRegister}
                        onMouseEnter={() => setRegisterHoverd(true)}
                        onMouseLeave={() => setRegisterHoverd(false)}
                        onClick={handleRegisterOnClick}
                    >
                        Register
                    </button>
                </div>

                <div style={styles.linksContainer}>
                    <Link to="/forgot-password" style={styles.link}>Forgot Password?</Link>
                </div>
            </div>
        </div>
    );
}

const styles = {
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
    apiErrorBox: {
        backgroundColor: "#fde8e8",
        color: "#e74c3c",
        padding: "12px",
        borderRadius: "6px",
        marginBottom: "20px",
        border: "1px solid #f5c6cb",
        textAlign: "center",
        fontSize: "14px"
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
        boxSizing: "border-box",
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

export default Login;