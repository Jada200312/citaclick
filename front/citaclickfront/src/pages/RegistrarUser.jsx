import { useState } from 'react';
import Logo from '../assets/log.png';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
function CrearUser() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  document.title = "Registrarse";
  const [username, setUsername] = useState('');
  const [name, setname] = useState('');
  const [lastname, setlastname] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [esPeluqueria, setEsPeluqueria] = useState(false);
  const [celular, setCelular] = useState('');
  const [imagen, setImagen] = useState(null);
  const [cedula, setCedula] = useState('');
  const [alerta, setAlerta] = useState(null);

  const manejarEnvio = async (e) => {
    e.preventDefault();

    if (!username || !password || !email || !celular || !imagen || !cedula) {
      setAlerta({
        tipo: 'error',
        mensaje: 'Todos los campos son obligatorios.'
      });
      return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('first_name', name);
    formData.append('last_name', lastname);
    formData.append('password', password);
    formData.append('email', email);
    formData.append('es_peluqueria', esPeluqueria ? 'true' : 'false');
    formData.append('celular', celular);
    formData.append('imagen', imagen);
    formData.append('cedula', cedula);

    try {
      const res = await fetch('http://localhost:8000/api/usuarios/registrar/', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json();
        const mensaje =
          errorData.detail ||
          Object.values(errorData).flat().join('\n') ||
          'Error desconocido';
        setAlerta({
          tipo: 'error',
          mensaje: `Error del servidor:\n${mensaje}`
        });
        return;
      }

      // Login automático
      const loginRes = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!loginRes.ok) {
        setAlerta({
          tipo: 'error',
          mensaje: 'El usuario se registró pero hubo un problema al iniciar sesión automáticamente.'
        });
        return;
      }

      const loginData = await loginRes.json();
      localStorage.setItem('token', loginData.access); // Guardas el token
      localStorage.setItem('refresh', loginData.refresh);
      login(loginData.access);
      setAlerta({
        tipo: 'exito',
        mensaje: 'Usuario registrado y autenticado correctamente'
      });
manejarRedireccion();
    } catch (err) {
      console.error('Error inesperado:', err);
      setAlerta({
        tipo: 'error',
        mensaje: 'Error inesperado al registrar usuario.'
      });
    }
  };

  const manejarRedireccion = () => {
    if (esPeluqueria) {
      navigate('/peluqueria');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="bg-black min-h-screen flex justify-center items-center px-6 py-4 mt-6 mb-2">
      {alerta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`p-6 rounded-lg shadow-lg max-w-md w-full mx-4 bg-black border border-orange-600 text-orange-600`}>
            <h2 className="text-xl font-semibold mb-2">
              {alerta.tipo === 'exito' ? 'Registro exitoso' : 'Error'}
            </h2>
            <pre className="mb-4 whitespace-pre-wrap">{alerta.mensaje}</pre>
            <div className="text-right">
              {alerta.tipo === 'exito' ? (
                <button
                  onClick={manejarRedireccion}
                  className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-400"
                >
                  Aceptar
                </button>
              ) : (
                <button
                  onClick={() => setAlerta(null)}
                  className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-400"
                >
                  Cerrar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={manejarEnvio}
        encType="multipart/form-data"
        className="md:w-[60%] space-y-3 w-full max-w-md bg-zinc-950 p-4 rounded shadow"
      >
        <h1 className="text-xl font-bold text-white">Bienve<span className="text-orange-500">nido</span></h1>
        <p className="text-base text-white leading-relaxed">Complete Los Siguientes Campos:</p>

        <div className="flex justify-end">
          <button className="block text-sm font-medium text-orange-600">Iniciar Sesión</button>
        </div>

        {/* Campos de registro */}
        <div>
          <label className="block text-sm font-medium text-white">Nombre de usuario:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 shadow-sm" />
        </div>

        <div>
          <label className="block text-sm font-medium text-white">Nombre:</label>
          <input type="text" value={name} onChange={(e) => setname(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 shadow-sm" />
        </div>

        <div>
          <label className="block text-sm font-medium text-white">Apellido:</label>
          <input type="text" value={lastname} onChange={(e) => setlastname(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 shadow-sm" />
        </div>

        <div>
          <label className="block text-sm font-medium text-white">Contraseña:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 shadow-sm" />
        </div>

        <div>
          <label className="block text-sm font-medium text-white">Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 shadow-sm" />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" checked={esPeluqueria} onChange={(e) => setEsPeluqueria(e.target.checked)} className="w-5 h-5 text-orange-400 accent-orange-500 rounded" />
          <label className="text-sm text-white">¿Es peluquería?</label>
        </div>

        <div>
          <label className="block text-sm font-medium text-white">Celular:</label>
          <input type="text" value={celular} onChange={(e) => setCelular(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 shadow-sm" />
        </div>

        <div>
          <label className="block text-sm font-medium text-white">Foto de perfil:</label>
          <input type="file" accept="image/*" onChange={(e) => setImagen(e.target.files[0])} required className="mt-1 block w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600 cursor-pointer" />
        </div>

        <div>
          <label className="block text-sm font-medium text-white">Cédula:</label>
          <input type="text" value={cedula} onChange={(e) => setCedula(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 shadow-sm" />
        </div>

        <button type="submit" className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-400 transition">
          Registrar
        </button>
      </form>

      <div className="px-8 py-4 mt-6 mb-2">
        <img src={Logo} alt="Logo" className="w-300 h-200" />
      </div>
    </div>
  );
}

export default CrearUser;
