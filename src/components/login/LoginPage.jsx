'use client';

import { User, Lock } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';


const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();


    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('/api/login', { username, password });
            console.log('Login response:', response);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }


        router.push('/'); // Default route
    } catch (err) {
        setError('Invalid username or password');
        console.error('Login failed:', err.response?.data?.error || err.message);
    }
    setLoading(false);
};


return (
    <div className="container mt-4">
        <div className="row justify-content-center">
            <div className="col-md-6">
                <form onSubmit={handleLogin} className='' style={{ border: '1px solid #ccc', padding: '50px', borderRadius: '5px' }}>
                    <div className="form-group mb-3">
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text"><User /></span>
                            </div>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="form-group mb-3">
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text"><Lock /></span>
                            </div>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <button disabled={loading} type="submit" className="btn btn-primary">Login</button>
                </form>
            </div>
        </div>
    </div>
);
};

export default LoginPage;