import { h } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import '../styles/photo-carousel.css';

export function PhotoCarousel() {
  const [photos, setPhotos] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [fullscreenMode, setFullscreenMode] = useState(false);
  const carouselRef = useRef(null);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const response = await fetch('/photos.json');
        if (!response.ok) throw new Error('Failed to load photos');
        const data = await response.json();
        setPhotos(data);
      } catch (error) {
        console.error('Error cargando las fotos:', error);
        setPhotos([
          { id: 1, filename: "1_foto.webp", caption: "Cada segundo a tu lado es un tesoro que guardo en mi corazon" },
          { id: 2, filename: "PXL_20241225_232128125.MP.webp", caption: "Tu sonrisa ilumina mi mundo" },
          { id: 3, filename: "PXL_20250118_125154609.webp", caption: "Contigo, cada momento es inolvidable" }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    loadPhotos();
  }, []);

  const goToSlide = (index) => {
    let newIndex = index;
    if (newIndex < 0) newIndex = photos.length - 1;
    else if (newIndex >= photos.length) newIndex = 0;

    setCurrentSlide(newIndex);

    if (carouselRef.current && typeof gsap !== 'undefined') {
      gsap.to(carouselRef.current.querySelectorAll('.achievement-slide'), {
        opacity: 0,
        duration: 0.15,
        ease: "steps(4)",
      });
      gsap.to(carouselRef.current.querySelector(`.achievement-slide:nth-child(${newIndex + 1})`), {
        opacity: 1,
        duration: 0.15,
        delay: 0.1,
        ease: "steps(4)",
      });
    }
  };

  const nextSlide = () => goToSlide(currentSlide + 1);
  const prevSlide = () => goToSlide(currentSlide - 1);

  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchMove = (e) => {
    if (touchStart === null) return;
    const diff = touchStart - e.touches[0].clientX;
    if (diff > 50) { nextSlide(); setTouchStart(null); }
    else if (diff < -50) { prevSlide(); setTouchStart(null); }
  };
  const handleTouchEnd = () => setTouchStart(null);

  const handleImageClick = (e) => { e.stopPropagation(); setFullscreenMode(true); };
  const exitFullscreenMode = (e) => { e.stopPropagation(); setFullscreenMode(false); };

  if (isLoading) {
    return (
      <div className="achievement-gallery pixel-border loading-state">
        <div className="loading-bar-container">
          <span className="loading-text">LOADING...</span>
          <div className="loading-bar">
            <div className="loading-bar-fill"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`achievement-gallery pixel-border ${fullscreenMode ? 'fullscreen-mode' : ''}`}>
      <div className="gallery-header">
        <span className="gallery-star">{'\u2605'}</span>
        <span className="gallery-title neon-text-cyan">LOGROS DESBLOQUEADOS</span>
        <span className="gallery-count neon-text-yellow">{currentSlide + 1}/{photos.length}</span>
      </div>

      <div
        className="achievement-viewport"
        ref={carouselRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="achievement-inner">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className={`achievement-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ opacity: index === currentSlide ? 1 : 0 }}
            >
              <div
                className="achievement-frame"
                onClick={fullscreenMode ? exitFullscreenMode : handleImageClick}
              >
                <img
                  src={`/img/${photo.filename}`}
                  alt={`Logro ${index + 1}`}
                  loading="lazy"
                />
                <div className="image-scanline-overlay"></div>
              </div>
              {!fullscreenMode && (
                <div className="achievement-info">
                  <div className="achievement-badge">
                    <span className="badge-star neon-text-yellow">{'\u2605'}</span>
                    <span className="badge-text">LOGRO #{photo.id}</span>
                  </div>
                  <p className="achievement-caption">{photo.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {!fullscreenMode && (
          <>
            <button className="nav-btn nav-prev pixel-border" onClick={prevSlide} aria-label="Anterior">
              {'\u25C4'}
            </button>
            <button className="nav-btn nav-next pixel-border" onClick={nextSlide} aria-label="Siguiente">
              {'\u25BA'}
            </button>
          </>
        )}

        {fullscreenMode && (
          <button
            className="nav-btn exit-fullscreen-btn pixel-border"
            onClick={exitFullscreenMode}
            aria-label="Salir de pantalla completa"
          >
            {'\u2715'}
          </button>
        )}
      </div>

      {!fullscreenMode && (
        <div className="gallery-dots">
          {photos.map((_, i) => (
            <span
              key={i}
              className={`dot ${i === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(i)}
            ></span>
          ))}
        </div>
      )}
    </div>
  );
}
