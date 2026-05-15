import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function DetallePiso() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [piso, setPiso] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/api/pisos/${id}`)
      .then(res => setPiso(res.data))
      .catch(() => setError(true));
  }, [id]);

  if (error) return <p style={{ padding: '2rem' }}>Piso no encontrado.</p>;
  if (!piso) return <p style={{ padding: '2rem' }}>Cargando...</p>;

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>

      {/* Botón volver */}
      <button onClick={() => navigate('/pisos')} style={{
        background: 'none', border: '1px solid #ccc', padding: '0.4rem 1rem',
        borderRadius: '8px', cursor: 'pointer', marginBottom: '1.5rem', fontSize: '0.9rem'
      }}>
        ← Volver al listado
      </button>

      {/* Imagen */}
      <div style={{
        width: '100%', height: '300px', background: '#e8f0fe',
        borderRadius: '16px', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '5rem', marginBottom: '1.5rem'
      }}>
        🏠
      </div>

      {/* Título y ciudad */}
      <h1 style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>{piso.titulo}</h1>
      <p style={{ color: '#666', fontSize: '1rem', marginBottom: '1.5rem' }}>
        📍 {piso.ciudad}
      </p>

      {/* Tarjetas de info */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <div style={cardStyle}>💶 <strong>{piso.precio}€</strong>/mes</div>
        <div style={cardStyle}>🛏 <strong>{piso.habitaciones}</strong> habitaciones</div>
        {piso.tipoEstancia && (
          <div style={cardStyle}>📅 {piso.tipoEstancia}</div>
        )}
        {piso.disponible !== undefined && (
          <div style={{ ...cardStyle, background: piso.disponible ? '#d4edda' : '#f8d7da' }}>
            {piso.disponible ? '✅ Disponible' : '❌ No disponible'}
          </div>
        )}
      </div>

      {/* Descripción */}
      {piso.descripcion && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Descripción</h2>
          <p style={{ color: '#444', lineHeight: '1.6' }}>{piso.descripcion}</p>
        </div>
      )}

      {/* Contacto */}
      {piso.contacto && (
        <div style={{
          background: '#f0f4ff', borderRadius: '12px', padding: '1rem 1.5rem',
          display: 'flex', alignItems: 'center', gap: '0.8rem'
        }}>
          <span style={{ fontSize: '1.5rem' }}>📞</span>
          <div>
            <p style={{ margin: 0, fontWeight: 'bold' }}>Contacto</p>
            <p style={{ margin: 0, color: '#555' }}>{piso.contacto}</p>
          </div>
        </div>
      )}
    </div>
  );
}

const cardStyle = {
  background: '#f5f5f5',
  borderRadius: '10px',
  padding: '0.6rem 1.2rem',
  fontSize: '0.95rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem'
};