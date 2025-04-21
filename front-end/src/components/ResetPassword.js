import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function PasswordReset() {
    const [username, setUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({
        username: "",
        newPassword: "",
        confirmPassword: "",
        api: ""
    });
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate("/login");
    };

    const handleReset = async () => {
        setErrors({
            username: "",
            newPassword: "",
            confirmPassword: "",
            api: ""
        });
        setSuccessMessage("");

        const newErrors = {};

        if (!username) newErrors.username = "Username is required";
        if (!newPassword) newErrors.newPassword = "New password is required";
        if (!confirmPassword) newErrors.confirmPassword = "Please retype the new password";
        if (newPassword && confirmPassword && newPassword !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(prev => ({ ...prev, ...newErrors }));
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.patch("http://localhost:8081/users", {
                username: username,
                password: newPassword
            });

            const result = response.data;

            if (result === "Password Reset Successful") {
                setSuccessMessage("✅ Password has been updated successfully!");
            } else if (result === "No active user found") {
                setErrors(prev => ({
                    ...prev,
                    api: "❌ No active user found with this username."
                }));
            } else if (result.startsWith("ERROR")) {
                setErrors(prev => ({
                    ...prev,
                    api: "❌ An unexpected error occurred. Please try again."
                }));
            } else {
                setErrors(prev => ({
                    ...prev,
                    api: `⚠️ Unexpected response: ${result}`
                }));
            }
        } catch (error) {
            console.error("Password reset error:", error);
            setErrors(prev => ({
                ...prev,
                api: "❌ Server error. Please try again later."
            }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.pageBackground}>
            <div style={styles.componentBox}>
                <div style={styles.titleBox}>
                    <h2 style={styles.title}>Reset Your Password</h2>
                </div>

                {errors.api && (
                    <div style={styles.apiErrorBox}>
                        {errors.api}
                    </div>
                )}

                {successMessage && (
                    <div style={styles.successBox}>
                        {successMessage}
                    </div>
                )}

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
                    <label style={styles.label}>New Password:</label>
                    <input
                        type="password"
                        style={styles.input}
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    {errors.newPassword && <p style={styles.errorText}>{errors.newPassword}</p>}
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Retype New Password:</label>
                    <input
                        type="password"
                        style={styles.input}
                        placeholder="Retype new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {errors.confirmPassword && <p style={styles.errorText}>{errors.confirmPassword}</p>}
                </div>

                <div style={styles.buttonGroup}>
                    <button
                        style={styles.btnReset}
                        onClick={handleReset}
                        disabled={isLoading}
                    >
                        {isLoading ? "Resetting..." : "Reset"}
                    </button>

                    <button
                        style={styles.btnLogin}
                        onClick={handleLoginRedirect}
                    >
                        Login
                    </button>
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
        fontSize: "14px"
    },
    successBox: {
        backgroundColor: "#e9f8ec",
        color: "#2ecc71",
        padding: "12px",
        borderRadius: "6px",
        marginBottom: "20px",
        border: "1px solid #b2f2bb",
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
    input: {
        width: "100%",
        padding: "12px 15px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "15px",
        boxSizing: "border-box",
        transition: "border 0.3s"
    },
    buttonGroup: {
        display: "flex",
        gap: "15px",
        marginTop: "20px"
    },
    btnReset: {
        flex: 1,
        padding: "14px",
        backgroundColor: "#2980b9",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "600",
        transition: "all 0.3s"
    },
    btnLogin: {
        flex: 1,
        padding: "14px",
        backgroundColor: "#f39c12",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "600",
        transition: "all 0.3s"
    },
    errorText: {
        color: "#e74c3c",
        fontSize: "12px",
        marginTop: "5px",
        textAlign: "left"
    }
};

export default PasswordReset;
