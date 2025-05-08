import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductList from '../components/ProductList';

interface User {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  createdAt: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/');

        const response = await axios.get('http://localhost:4000/api/auth/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        navigate('/');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="pa4">
      {user ? (
        <>
          <h2 className="f3 mb3">Bienvenido, {user.firstName} {user.lastName}</h2>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Nombre:</strong> {user.firstName}</p>
          <p><strong>Apellido:</strong> {user.lastName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Tipo de Usuario:</strong> {user.userType}</p>
          <p><strong>Fecha de Creación:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
          <button onClick={handleLogout} className="mt3 b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib">
            Cerrar Sesión
          </button>
          <ProductList />
        </>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
};

export default Dashboard;