import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import '../styles/memories.css';

// Componente para la página de recuerdos
export function Memories() {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulamos cargar datos de recuerdos
  useEffect(() => {
    // En una implementación real, esto cargaría desde una API o BD
    setTimeout(() => {
      setTimeline([
        {
          id: 1,
          date: '24 de Noviembre, 2024',
          title: 'Nuestro primer día',
          description: 'El día que comenzó nuestra historia de amor',
          category: 'special'
        },
        {
          id: 2,
          date: '24 de Diciembre, 2024',
          title: 'Nuestro primer mes juntos',
          description: 'Un mes lleno de momentos increíbles y descubrimientos',
          category: 'milestone'
        },
        {
          id: 3,
          date: '14 de Febrero, 2025',
          title: 'Nuestro primer San Valentín',
          description: 'Celebrando el amor en nuestro primer día de San Valentín juntos',
          category: 'holiday'
        },
        {
          id: 4,
          date: '18 de Enero, 2025',
          title: 'Nuestra primera aventura',
          description: 'Una escapada sorpresa que nunca olvidaremos',
          category: 'adventure'
        },
        {
          id: 5,
          date: '24 de Mayo, 2025',
          title: 'Seis meses juntos',
          description: '¡Medio año de amor, risas y crecer juntos!',
          category: 'milestone'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Renderizar estado de carga
  if (loading) {
    return (
      <div className="memories-container loading">
        <div className="loading-indicator">
          <i className="fas fa-heart-circle-pulse fa-spin"></i>
          <p>Cargando nuestros recuerdos especiales...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="memories-container">
      <h2 className="page-title">Nuestros Recuerdos</h2>
      <p className="page-description">
        Una línea del tiempo con nuestros momentos más especiales juntos.
      </p>

      <div className="timeline-container">
        {timeline.map((event, index) => (
          <div
            key={event.id}
            className={`timeline-item ${event.category} ${index % 2 === 0 ? 'left' : 'right'}`}
          >
            <div className="timeline-date">{event.date}</div>
            <div className="timeline-content">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <div className="timeline-icon">
                {event.category === 'special' && <i className="fas fa-star"></i>}
                {event.category === 'milestone' && <i className="fas fa-flag"></i>}
                {event.category === 'holiday' && <i className="fas fa-gift"></i>}
                {event.category === 'adventure' && <i className="fas fa-mountain"></i>}
              </div>
            </div>
          </div>
        ))}
        <div className="timeline-line"></div>
      </div>

      <div className="future-memories">
        <h3>¡Y muchos más momentos por venir!</h3>
        <div className="future-icon">
          <i className="fas fa-heart"></i>
        </div>
      </div>
    </div>
  );
}