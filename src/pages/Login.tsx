import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import  {useSnackbar}  from '../utils/SnackbarProvider';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:4000/api/auth/login', {
                email,
                password,
            });

            const token = response.data.token;
            if (token) {
                localStorage.setItem('token', token);
                navigate('/dashboard');
            } else {
                setErrorMessage('Error: No se recibió un token de autenticación.');
            }
        } catch (error: any) {
            console.error("Error al iniciar sesión:", error);
            const errorMessage = error.response?.status === 401
                ? 'Credenciales incorrectas. Por favor verifica tu correo y contraseña.'
                : error.response?.data?.message || 'Error al iniciar sesión';
            showSnackbar(errorMessage, 'error');
            setErrorMessage(errorMessage);
        }
    };

    return (
        <div className="flex items-center justify-center vh-100">
        <div className="pa4 black-80 ba b--black-10 br3 shadow-2">
            <h2 className="f3 mb3 tc">Iniciar Sesión</h2>
            <form onSubmit={handleLogin} className="measure center">
                <div className="mv3">
                    <label htmlFor="email" className="db fw6 lh-copy f6">Correo Electrónico</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        className="pa2 input-reset ba bg-transparent w-100 br3"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                        title="Por favor ingresa un correo electrónico válido."
                    />
                    <div style={{ minHeight: '20px', visibility: email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'visible' : 'hidden' }}>
                        <p className="red f6">El correo electrónico no es válido.</p>
                    </div>
                </div>
                
                <div className="mv3">
                    <label htmlFor="password" className="db fw6 lh-copy f6">Contraseña</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        className="pa2 input-reset ba bg-transparent w-100 br3"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        title="Ingresa tu contraseña."
                    />
                </div>

                <button type="submit" className="f6 link dim br3 ph3 pv2 mv3 dib white bg-mid-gray w-100">
                    Iniciar Sesión
                </button>
            </form>
            <p className="mt3 tc">
                ¿No tienes una cuenta?{" "}
                <a href="/register" className="link b black underline hover-blue">
                    Regístrate aquí
                </a>
            </p>
        </div>
        </div>
    );
};

export default Login;