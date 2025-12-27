import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
    const { login } = useAuth();
    const [view, setView] = useState<'signup' | 'signin'>('signin');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        age: '',
        gender: 'Not specified',
        goals: 'General Health'
    });

    const inputStyle = {
        width: '100%',
        padding: '16px',
        borderRadius: '12px',
        background: 'rgba(0,0,0,0.4)',
        border: '1px solid var(--color-card-border)',
        color: 'white',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border-color 0.2s'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '8px',
        fontSize: '0.9rem',
        fontWeight: 500,
        color: 'var(--color-text)'
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login({
            name: formData.name || 'User',
            email: formData.email,
            age: formData.age,
            gender: formData.gender,
            goals: formData.goals
        });
    };

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#000000',
            overflow: 'hidden' // Prevent page scroll
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px', // Slightly tighter
                maxHeight: '100vh',
                overflowY: 'auto', // Internal scroll if absolutely needed on tiny screens
                padding: '20px',
                animation: 'fadeIn 0.6s ease-out scrollbar-width: none'
            }}>
                {/* Logo Section */}
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        margin: '0 auto 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <img src="/logo.png" alt="Encode Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <h1 style={{
                        fontSize: '2.75rem',
                        fontWeight: 800,
                        marginBottom: '4px',
                        letterSpacing: '-0.04em',
                        lineHeight: 1
                    }}>Encode</h1>
                    <p style={{
                        fontSize: '1.2rem',
                        color: 'var(--color-text-dim)',
                        letterSpacing: '0.01em',
                        fontWeight: 500
                    }}>Your AI Health Companion</p>
                </div>

                {/* Card */}
                <div style={{
                    background: 'rgba(255,255,255,0.02)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '28px',
                    padding: '32px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px'
                }}>

                    {view === 'signin' ? (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={labelStyle}>Email Address</label>
                                <input
                                    type="email"
                                    placeholder="name@email.com"
                                    style={inputStyle}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    style={inputStyle}
                                />
                            </div>

                            <button type="submit" style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: '14px',
                                background: 'var(--color-prime)',
                                color: '#000',
                                fontSize: '1rem',
                                fontWeight: 600,
                                marginTop: '8px',
                                cursor: 'pointer'
                            }}>
                                Sign In
                            </button>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ flex: 1, height: '1px', background: 'var(--color-card-border)' }} />
                                <span style={{ color: 'var(--color-text-dim)', fontSize: '0.8rem' }}>or</span>
                                <div style={{ flex: 1, height: '1px', background: 'var(--color-card-border)' }} />
                            </div>

                            <button type="button" onClick={() => setView('signup')} style={{
                                width: '100%',
                                padding: '14px',
                                borderRadius: '14px',
                                background: 'transparent',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'var(--color-text)',
                                fontSize: '0.95rem',
                                fontWeight: 500,
                                cursor: 'pointer'
                            }}>
                                Create Account
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={labelStyle}>Name</label>
                                    <input type="text" placeholder="John" style={inputStyle} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Age</label>
                                    <input type="number" placeholder="25" style={inputStyle} onChange={e => setFormData({ ...formData, age: e.target.value })} />
                                </div>
                            </div>

                            <div>
                                <label style={labelStyle}>Email</label>
                                <input type="email" placeholder="name@email.com" style={inputStyle} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>

                            <div>
                                <label style={labelStyle}>Goal</label>
                                <select
                                    style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                                    onChange={e => setFormData({ ...formData, goals: e.target.value })}
                                >
                                    <option>General Health</option>
                                    <option>Weight Loss</option>
                                    <option>Muscle Gain</option>
                                </select>
                            </div>

                            <button type="submit" style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: '14px',
                                background: 'var(--color-prime)',
                                color: '#000',
                                fontSize: '1rem',
                                fontWeight: 600,
                                marginTop: '12px',
                                cursor: 'pointer'
                            }}>
                                Complete Setup
                            </button>

                            <button type="button" onClick={() => setView('signin')} style={{
                                width: '100%',
                                padding: '12px',
                                background: 'transparent',
                                color: 'var(--color-text-dim)',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                border: 'none'
                            }}>
                                ← Back to Login
                            </button>
                        </form>
                    )}
                </div>
            </div>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                input:focus, select:focus { border-color: var(--color-prime) !important; box-shadow: 0 0 0 2px var(--color-prime-dim); }
            `}</style>
        </div>
    );
};
