import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../utils/SnackbarProvider';

const Register = () => {
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();

        try {

            const response = await fetch('https://offcorss-test-backend.onrender.com/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    firstName,
                    lastName,
                    email,
                    password
                })
            });
        
            if (!response.ok) {
                throw new Error('Error al registrar usuario');
            }

            showSnackbar('Usuario registrado correctamente. Ahora puedes iniciar sesión.', 'success');
            setErrorMessage('');

            setTimeout(() => navigate('/'), 2000);

        } catch (error: any) {
            console.error("Error al registrar usuario:", error);
            const errorMessage = error.response?.data?.message || 'Error al registrar usuario';
            showSnackbar(errorMessage, 'error');
            setSuccessMessage('');
        }
    };

    return (
        <div className="flex items-center justify-center vh-100">
            <div className="pa4 black-80 ba b--black-10 br3 shadow-2">
                <div
                    onClick={() => navigate('/')}
                    className="f6 fw6 dib no-underline bg-animate mid-gray pointer flex items-center"
                >
                    <svg className="w1 mr2" data-icon="chevronLeft" viewBox="0 0 32 32" style={{ fill: 'currentcolor' }}>
                        <title>chevronLeft icon</title>
                        <path d="M20 1 L24 5 L14 16 L24 27 L20 31 L6 16 z"></path>
                    </svg>
                    Atrás
                </div>
                <h2 className="f3 mb3">Registro de Usuario</h2>
                {errorMessage && <p className="red">{errorMessage}</p>}
                {successMessage && <p className="green">{successMessage}</p>}
                <form onSubmit={handleRegister} className="measure center">
                    <div className="mb4">
                        <label htmlFor="username" className="db fw6 lh-copy f6">Username</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            className="pa2 input-reset ba bg-transparent w-100 br3"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mv2">
                        <label htmlFor="firstName" className="db fw6 lh-copy f6">Nombre</label>
                        <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            className="pa2 input-reset ba bg-transparent w-100 br3"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            pattern="^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$"
                            title="El nombre solo puede contener letras."
                        />
                        <div style={{ minHeight: '20px', visibility: firstName && !/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(firstName) ? 'visible' : 'hidden' }}>
                            <p className="red f6">El nombre solo puede contener letras.</p>
                        </div>
                    </div>
                    <div className="mv2">
                        <label htmlFor="lastName" className="db fw6 lh-copy f6">Apellido</label>
                        <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            className="pa2 input-reset ba bg-transparent w-100 br3"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            pattern="^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$"
                            title="El apellido solo puede contener letras."
                        />
                        <div style={{ minHeight: '20px', visibility: lastName && !/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(lastName) ? 'visible' : 'hidden' }}>
                            <p className="red f6">El apellido solo puede contener letras.</p>
                        </div>
                    </div>
                    <div className="mv2">
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
                    <div className="mv2">
                        <label htmlFor="password" className="db fw6 lh-copy f6">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            className="pa2 input-reset ba bg-transparent w-100 br3"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            title="La contraseña debe tener al menos 6 caracteres."
                        />
                        <div style={{ minHeight: '20px', visibility: password && password.length < 6 ? 'visible' : 'hidden' }}>
                            <p className="red f6">La contraseña debe tener al menos 6 caracteres.</p>
                        </div>
                    </div>
                    <button type="submit" className="f6 link dim br3 ph3 pv2 mv3 dib white bg-mid-gray w-100">
                        Registrarse
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;