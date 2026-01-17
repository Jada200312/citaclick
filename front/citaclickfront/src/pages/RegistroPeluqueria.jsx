import { useState, useEffect } from "react";
import Logo from "../assets/log.png";
import { useNavigate } from "react-router-dom";

function Registrarpeluqueria() {
  document.title = "Registrar Peluqueria";
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [intervalo_tiempo, setIntervaloTiempo] = useState("");
  const [imagen, setImagen] = useState(null);
  const [alerta, setAlerta] = useState(null);
  const [cantidadRecursos, setCantidadRecursos] = useState("");
  const [nombreRecurso, setNombreRecurso] = useState("");
  const tipoNegocioId = localStorage.getItem("tipoNegocioId");

  useEffect(() => {
    const cargarTipoNegocio = async () => {
      const res = await fetch(
        "http://localhost:8000/api/negocios/tipos-negocio/"
      );
      const data = await res.json();

      const tipoSeleccionado = data.find(
        (t) => t.id === parseInt(tipoNegocioId)
      );

      if (tipoSeleccionado) {
        setNombreRecurso(tipoSeleccionado.recurso_nombre);
      }
    };

    cargarTipoNegocio();
  }, []);

  const manejarEnvio = async (e) => {
    e.preventDefault();

    // Validar campos
    if (
      !nombre ||
      !direccion ||
      !ciudad ||
      !horaInicio ||
      !horaFin ||
      !intervalo_tiempo ||
      !imagen ||
      !cantidadRecursos ||
      parseInt(cantidadRecursos) <= 0
    ) {
      setAlerta({
        tipo: "error",
        mensaje:
          "Todos los campos son obligatorios y la cantidad de puestos debe ser mayor a 0.",
      });
      return;
    }

    try {
      // 1️⃣ Crear horario
      const resHorario = await fetch(
        "http://localhost:8000/api/negocios/horarios-negocio/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            horaInicio,
            horaFin,
            intervalo_tiempo,
          }),
        }
      );

      if (!resHorario.ok) {
        const errorData = await resHorario.json();
        const mensaje =
          errorData.detail ||
          Object.values(errorData).flat().join("\n") ||
          "Error al crear el horario.";
        setAlerta({
          tipo: "error",
          mensaje: `Error en el horario:\n${mensaje}`,
        });
        return;
      }

      const horarioCreado = await resHorario.json();
      const horario_Id = horarioCreado.id;

      // 2️⃣ Crear peluquería con el horario
      const fechaRegistro = new Date();
      const fechaVencimiento = new Date();
      fechaVencimiento.setMonth(fechaVencimiento.getMonth() + 1);

      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("direccion", direccion);
      formData.append("ciudad", ciudad);
      formData.append("imagen", imagen);
      formData.append(
        "fecha_registro",
        fechaRegistro.toISOString().split("T")[0]
      );
      formData.append(
        "fecha_vencimiento",
        fechaVencimiento.toISOString().split("T")[0]
      );
      formData.append("horario_general", horario_Id);
      formData.append("tipo", tipoNegocioId);

      const resPeluqueria = await fetch("http://localhost:8000/api/negocios/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!resPeluqueria.ok) {
        const errorData = await resPeluqueria.json();
        const mensaje =
          errorData.detail ||
          Object.values(errorData).flat().join("\n") ||
          "Error al registrar la peluquería.";
        setAlerta({ tipo: "error", mensaje: `Error:\n${mensaje}` });
        return;
      }

      const peluqueriaCreada = await resPeluqueria.json();
      const negocioId = peluqueriaCreada.id;

      // 3️⃣ Crear recursos automáticamente
      const resRecursos = await fetch(
        "http://localhost:8000/api/negocios/recursos/crear-masivo/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            negocio: negocioId,
            cantidad: parseInt(cantidadRecursos),
          }),
        }
      );

      if (!resRecursos.ok) {
        const errorData = await resRecursos.json();
        console.error("Error creando recursos:", errorData);
        setAlerta({
          tipo: "error",
          mensaje:
            "La peluquería se creó, pero hubo un error generando los puestos.",
        });
        return;
      }

      // ✅ Todo salió bien
      setAlerta({
        tipo: "exito",
        mensaje: "Peluquería y recursos registrados correctamente.",
      });

      // Limpiar campos
      setNombre("");
      setDireccion("");
      setCiudad("");
      setHoraInicio("");
      setHoraFin("");
      setIntervaloTiempo("");
      setImagen(null);
      setCantidadRecursos("");

      // Navegar al inicio
      navigate("/");
    } catch (err) {
      console.error("Error inesperado:", err);
      setAlerta({
        tipo: "error",
        mensaje: "Error inesperado al registrar la peluquería.",
      });
    }
  };

  return (
    <div className="bg-black min-h-screen flex justify-center items-center px-6 py-4 mt-6 mb-2">
      {alerta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className={`p-6 rounded-lg shadow-lg max-w-md w-full mx-4 ${
              alerta.tipo === "exito"
                ? "bg-black border border-orange-600 text-orange-600"
                : "bg-black border border-orange-600 text-orange-600"
            }`}
          >
            <h2 className="text-xl font-semibold mb-2">
              {alerta.tipo === "exito" ? "Registro exitoso" : "Error"}
            </h2>
            <pre className="mb-4 whitespace-pre-wrap">{alerta.mensaje}</pre>
            <div className="text-right">
              <button
                onClick={() => setAlerta(null)}
                className={`px-4 py-2 rounded font-semibold ${
                  alerta.tipo === "exito"
                    ? "bg-orange-500 hover:bg-orange-500 text-white"
                    : "bg-orange-500 hover:bg-white text-white"
                }`}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={manejarEnvio}
        className="md:w-[60%] space-y-3 w-full max-w-md bg-zinc-950 p-4 rounded shadow"
      >
        <h1 className="text-xl font-bold text-white">
          Bienve<span className="text-orange-500">nido</span>
        </h1>

        <p className="text-base text-white leading-relaxed">
          Complete Los Siguientes Campos para terminar tu registro:
        </p>

        <div>
          <label className="block text-sm font-medium text-white">
            Nombre del negocio:
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white">
            Dirección:
          </label>
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white">
            Ciudad:
          </label>
          <input
            type="text"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white">
            Horario Inicio:
          </label>
          <div className="grid grid-cols-1 gap-2 mt-1">
            <input
              type="time"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 shadow-sm"
              required
            />
            <label className="block text-sm font-medium text-white">
              Horario Fin:
            </label>
            <input
              type="time"
              value={horaFin}
              onChange={(e) => setHoraFin(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 shadow-sm"
              required
            />
            <label className="block text-sm font-medium text-white">
              Intervalo de Tiempo:
            </label>
            <input
              type="number"
              placeholder="Intervalo en minutos"
              value={intervalo_tiempo}
              onChange={(e) => setIntervaloTiempo(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 shadow-sm"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white">
            Tipo de recurso que tendrá tu negocio:
          </label>
          <input
            type="text"
            value={nombreRecurso}
            readOnly
            className="mt-1 block w-full border border-gray-400 bg-gray-100 rounded px-3 py-2 shadow-sm cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white">
            Cantidad de {nombreRecurso}:
          </label>
          <input
            type="number"
            value={cantidadRecursos}
            onChange={(e) => setCantidadRecursos(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 shadow-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white">
            Foto de perfil:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImagen(e.target.files[0])}
            required
            className="mt-1 block w-full text-sm text-white file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0 file:text-sm file:font-semibold
            file:bg-orange-500 file:text-white hover:file:bg-orange-600 cursor-pointer"
          />
        </div>

        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-400 text-white font-bold py-2 px-4 rounded w-full"
        >
          Registrar peluquería
        </button>
      </form>

      <div className="px-8 py-4 mt-6 mb-2">
        <img src={Logo} alt="Logo" className="w-300 h-200" />
      </div>
    </div>
  );
}
export default Registrarpeluqueria;
