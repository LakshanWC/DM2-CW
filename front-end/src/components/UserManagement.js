import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8082/api/admin/users');
            // Use the exact field names from your API response (uppercase)
            const formattedUsers = response.data.map(user => ({
                USERID: user.USERID || '',
                NAME: user.NAME || '',
                USERNAME: user.USERNAME || '',
                EMAIL: user.EMAIL || '',
                ADDRESS: user.ADDRESS || '',
                STATUS: user.STATUS || 'inactive'
            }));
            setUsers(formattedUsers);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleRemoveUser = async (username) => {
        if (window.confirm(`Are you sure you want to remove user ${username}?`)) {
            try {
                const response = await axios.delete(`http://localhost:8082/api/admin/remove-user/${username}`);
                alert(response.data);
                fetchUsers();
            } catch (err) {
                alert(`Error removing user: ${err.response?.data || err.message}`);
            }
        }
    };

    const filteredUsers = users.filter(user => {
        const safeUsername = (user.USERNAME || '').toLowerCase();
        const safeEmail = (user.EMAIL || '').toLowerCase();
        const safeName = (user.NAME || '').toLowerCase();
        const safeSearchTerm = (searchTerm || '').toLowerCase();


        return safeUsername.includes(safeSearchTerm) ||
            safeEmail.includes(safeSearchTerm) ||
            safeName.includes(safeSearchTerm);
    });

    if (loading) return <div style={styles.loading}>Loading users...</div>;
    if (error) return <div style={styles.error}>Error: {error}</div>;

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>User Management</h2>

            <div style={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                />
            </div>

            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                    <tr style={styles.tableHeaderRow}>
                        <th style={styles.tableHeader}>User ID</th>
                        <th style={styles.tableHeader}>Name</th>
                        <th style={styles.tableHeader}>Username</th>
                        <th style={styles.tableHeader}>Email</th>
                        <th style={styles.tableHeader}>Address</th>
                        <th style={styles.tableHeader}>Status</th>
                        <th style={styles.tableHeader}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <tr key={user.USERID} style={styles.tableRow}>
                                <td style={styles.tableCell}>{user.USERID}</td>
                                <td style={styles.tableCell}>{user.NAME}</td>
                                <td style={styles.tableCell}>{user.USERNAME}</td>
                                <td style={styles.tableCell}>{user.EMAIL}</td>
                                <td style={styles.tableCell}>{user.ADDRESS}</td>
                                <td style={styles.tableCell}>
                                        <span style={{
                                            color: user.STATUS.toLowerCase() === 'active' ? '#27ae60' : '#e74c3c',
                                            fontWeight: 'bold'
                                        }}>
                                            {user.STATUS}
                                        </span>
                                </td>
                                <td style={styles.tableCell}>
                                    <button
                                        onClick={() => handleRemoveUser(user.USERNAME)}
                                        style={styles.removeButton}
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr style={styles.tableRow}>
                            <td colSpan="7" style={{...styles.tableCell, textAlign: 'center'}}>
                                No users found
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    title: {
        color: '#2c3e50',
        fontSize: '24px',
        marginBottom: '20px',
        textAlign: 'center'
    },
    searchContainer: {
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'center'
    },
    searchInput: {
        padding: '10px 15px',
        width: '300px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        fontSize: '16px'
    },
    tableContainer: {
        overflowX: 'auto',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        borderRadius: '8px'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: 'white'
    },
    tableHeaderRow: {
        backgroundColor: '#2c3e50',
        color: 'white'
    },
    tableHeader: {
        padding: '12px 15px',
        textAlign: 'left',
        fontWeight: '600'
    },
    tableRow: {
        borderBottom: '1px solid #eee',
        '&:hover': {
            backgroundColor: '#f9f9f9'
        }
    },
    tableCell: {
        padding: '12px 15px',
        textAlign: 'left'
    },
    removeButton: {
        backgroundColor: '#e74c3c',
        color: 'white',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        '&:hover': {
            backgroundColor: '#c0392b'
        }
    },
    loading: {
        textAlign: 'center',
        padding: '20px',
        fontSize: '18px'
    },
    error: {
        textAlign: 'center',
        padding: '20px',
        fontSize: '18px',
        color: '#e74c3c'
    }
};

export default UserManagement;