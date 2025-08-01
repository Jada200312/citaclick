import { useState, useContext } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Logo from '../assets/log.png';

function Login() {
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1️⃣ Hacer login
      const response = await axios.post('http://localhost:8000/api/token/', {
        username,
        password,
      });

      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // 2️⃣ Obtener datos completos del usuario
      const userResponse = await axios.get('http://localhost:8000/api/usuarios/tipo-usuario-logueado/', {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      const user = userResponse.data;

      // 3️⃣ Guardar en localStorage
      localStorage.setItem('user_id', user.id);
      localStorage.setItem('es_peluqueria', user.es_peluqueria);
      if (user.peluqueria_id) {
        localStorage.setItem('peluqueria_id', user.peluqueria_id);
      }

      // 4️⃣ Redirigir
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="bg-black min-h-screen flex justify-center items-center px-6 py-4 mt-6 mb-2">
      <div className="space-y-3 w-full max-w-md bg-zinc-950 p-4 rounded shadow">
        <h1 className="text-xl font-bold text-white">Bienve<span className="text-orange-500">nido</span></h1>
        <p className="text-base text-white leading-relaxed">Bienvenido a tu sitio:</p>
        <div className="flex justify-end">
          <button className="text-orange-600 hover:bg-orange-500 hover:text-white font-medium py-2 px-4 rounded transition-colors duration-200">Registrarse</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-white">Nombre de usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && <p className="text-orange-600 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-500 transition duration-200"
          >
            Entrar
          </button>
        </form>
      </div>
      <div className="px-8 py-4 mt-6 mb-2">
        <img src={Logo} alt="Logo" className="w-300 h-200" />
      </div>
    </div>
  );
}

export default Login;
