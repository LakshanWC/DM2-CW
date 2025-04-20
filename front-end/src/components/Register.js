import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        phone: '',
        email: '',
        address: '',
        type: 'Customer'
    });

    const [errors, setErrors] = useState({});
    const [registerHover, setRegisterHover] = useState(false);
    const [loginHover, setLoginHover] = useState(false);
    const [responseMsg, setResponseMsg] = useState(null);

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        else if (formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';

        if (!formData.username.trim()) newErrors.username = 'Username is required';
        else if (formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';

        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address';

        if (!formData.phone) newErrors.phone = 'Phone number is required';
        else if (!/^[0-9]{10,15}$/.test(formData.phone)) newErrors.phone = 'Enter a valid phone number (10–15 digits)';

        if (!formData.address.trim()) newErrors.address = 'Address is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleTypeChange = (type) => {
        setFormData(prev => ({ ...prev, type }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResponseMsg(null);

        if (validate()) {
            const roleValue = formData.type === 'Customer' ? "1" : "2";

            const payload = {
                name: formData.name,
                username: formData.username,
                password: formData.password,
                phoneNo: formData.phone,
                email: formData.email,
                address: formData.address,
                role: roleValue
            };

            try {
                const res = await axios.post("http://localhost:8081/users", payload);
                setResponseMsg({ type: "success", text: res.data.message || "Registration successful!" });


            } catch (error) {
                const errMsg = error.response?.data?.message || "Registration failed. Please try again.";
                setResponseMsg({ type: "error", text: errMsg });
                console.error("Axios registration error:", error);
            }
        }
    };

    const handleLoginClick = () => {
        navigate("/");
    };

    return (
        <div style={styles.pageContainer}>
            <div style={styles.formContainer}>
                <h2 style={styles.title}>Create an Account</h2>
                {responseMsg && (
                    <div style={{
                        marginBottom: "16px",
                        padding: "10px",
                        borderRadius: "8px",
                        color: responseMsg.type === "success" ? "#2E7D32" : "#D32F2F",
                        backgroundColor: responseMsg.type === "success" ? "#E8F5E9" : "#FFEBEE",
                        border: `1px solid ${responseMsg.type === "success" ? "#C8E6C9" : "#EF9A9A"}`
                    }}>
                        {responseMsg.text}
                    </div>
                )}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Account Type</label>
                        <div style={styles.toggleContainer}>
                            <button type="button" style={{
                                ...styles.toggleOption,
                                ...(formData.type === 'Customer' ? styles.toggleActive : styles.toggleInactive),
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0
                            }} onClick={() => handleTypeChange('Customer')}>Customer</button>
                            <button type="button" style={{
                                ...styles.toggleOption,
                                ...(formData.type === 'Supplier' ? styles.toggleActive : styles.toggleInactive),
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0
                            }} onClick={() => handleTypeChange('Supplier')}>Supplier</button>
                        </div>
                    </div>

                    {["name", "username", "password", "phone", "email", "address"].map((field, idx) => (
                        <div style={styles.formGroup} key={idx}>
                            <label style={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1).replace("No", " Number")}</label>
                            <input
                                type={field === "password" ? "password" : field === "email" ? "email" : "text"}
                                name={field}
                                placeholder={`Enter your ${field}`}
                                style={{
                                    ...styles.input,
                                    ...(errors[field] && styles.inputError)
                                }}
                                value={formData[field]}
                                onChange={handleChange}
                            />
                            {errors[field] && <div style={styles.errorContainer}><span style={styles.error}>{errors[field]}</span></div>}
                        </div>
                    ))}

                    <div style={styles.buttonGroup}>
                        <button
                            type="submit"
                            style={{ ...styles.btnRegister, ...(registerHover && styles.btnRegisterHover) }}
                            onMouseEnter={() => setRegisterHover(true)}
                            onMouseLeave={() => setRegisterHover(false)}
                        >
                            Register
                        </button>
                        <button
                            type="button"
                            style={{ ...styles.btnLogin, ...(loginHover && styles.btnLoginHover) }}
                            onMouseEnter={() => setLoginHover(true)}
                            onMouseLeave={() => setLoginHover(false)}
                            onClick={handleLoginClick}
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;

const styles = {
    pageContainer: {
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #4CAF50, #2E7D32)",
        padding: "20px",
        boxSizing: "border-box",
    },
    formContainer: {
        width: "100%",
        maxWidth: "420px",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fff",
        textAlign: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    form: {
        width: "100%",
    },
    title: {
        color: "#2E7D32",
        fontSize: "26px",
        fontWeight: "600",
        marginBottom: "24px",
    },
    formGroup: {
        marginBottom: "20px",
        textAlign: "left",
        width: "100%",
    },
    label: {
        display: "block",
        fontSize: "14px",
        fontWeight: "500",
        marginBottom: "8px",
        color: "#555",
    },
    toggleContainer: {
        display: "flex",
        width: "100%",
        marginTop: "8px",
    },
    toggleOption: {
        flex: 1,
        padding: "12px",
        textAlign: "center",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        border: "1px solid #ddd",
        transition: "all 0.3s ease",
        outline: "none",
    },
    toggleActive: {
        backgroundColor: "#4CAF50",
        color: "white",
        borderColor: "#4CAF50",
    },
    toggleInactive: {
        backgroundColor: "white",
        color: "#555",
    },
    input: {
        width: "100%",
        padding: "12px 16px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        fontSize: "15px",
        transition: "all 0.3s ease",
        outline: "none",
        boxSizing: "border-box",
    },
    inputError: {
        borderColor: "#ff4444",
        backgroundColor: "#fff9f9",
    },
    errorContainer: {
        marginTop: "6px",
        padding: "6px 8px",
        backgroundColor: "#fff0f0",
        borderRadius: "4px",
        display: "inline-block",
    },
    error: {
        color: "#ff4444",
        fontSize: "13px",
        display: "flex",
        alignItems: "center",
    },
    buttonGroup: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "24px",
        gap: "12px",
        width: "100%",
    },
    btnRegister: {
        flex: 1,
        padding: "14px",
        backgroundColor: "#FF9800",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    },
    btnLogin: {
        flex: 1,
        padding: "14px",
        backgroundColor: "#388E3C",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    },
    btnRegisterHover: {
        backgroundColor: "#F57C00",
        transform: "translateY(-1px)",
        boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
    },
    btnLoginHover: {
        backgroundColor: "#2E7D32",
        transform: "translateY(-1px)",
        boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
    },
};
