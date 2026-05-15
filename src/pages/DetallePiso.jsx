import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function DetallePiso() {
  const { id } = useParams();
  const [piso, setPiso] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/api/pisos/${id}`)
      .then(res => setPiso(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!piso) return <p>Cargando...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{piso.titulo}</h1>
      <p>📍 {piso.ciudad}</p>
      <p>💶 {piso.precio}€/mes</p>
      <p>{piso.descripcion}</p>
    </div>
  );
}