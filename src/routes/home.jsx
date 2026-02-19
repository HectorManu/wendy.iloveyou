import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

// Importar componentes
import { TimeCounter } from '../components/time-counter';
import { PhotoCarousel } from '../components/photo-carousel';
import { HeartButton } from '../components/heart-button';
import { Proposal } from '../components/proposal';
import { ComingSoon } from '../components/coming-soon';

// Utilidades
import { useGsapAnimations } from '../hooks/use-gsap-animations';
import { useSpecialEvents } from '../hooks/use-special-events';
import { useColorPalette } from '../hooks/use-color-palette';
import '../styles/home.css';

export function Home() {
  // Hook para animaciones GSAP
  const { initAnimations } = useGsapAnimations();
  // Hook para eventos especiales
  const { checkForSpecialEvents } = useSpecialEvents();
  // Hook para paleta de colores
  const { applyColorPalette } = useColorPalette();

  useEffect(() => {
    // Inicializar animaciones
    initAnimations();
    // Verificar eventos especiales
    checkForSpecialEvents();
    // Aplicar paleta de colores
    applyColorPalette();
  }, []);

  return (
    <>
      {/* Contenedor de flores para eventos especiales */}
      <div className="flowers"></div>

      {/* Contenedor de partículas dinámicas */}
      <div className="dynamic-particles" id="dynamic-particles"></div>

      {/* Contador de tiempo */}
      <TimeCounter />

      {/* Carrusel de fotos */}
      <PhotoCarousel />

      {/* Botón de corazón */}
      <HeartButton />

      {/* Componente de propuesta */}
      <Proposal />

      {/* Sección de próximas actualizaciones */}
      <ComingSoon />
    </>
  );
}