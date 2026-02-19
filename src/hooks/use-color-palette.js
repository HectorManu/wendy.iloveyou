import { useState, useEffect } from 'preact/hooks';

export function useColorPalette() {
  const [isDailyPalette, setIsDailyPalette] = useState(false);

  // Paleta retro neon original
  const originalPalette = {
    primaryColor: '#ff2d7b',
    secondaryColor: '#00ffcc',
    accentColor: '#ffea00',
    backgroundColor: '#0a0a1a',
    textColor: '#e0e0ff',
    gradient: 'linear-gradient(135deg, #ff2d7b, #7b2dff)',
    shadowColor: 'rgba(255, 45, 123, 0.4)'
  };

  const seededRandom = (seed) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // Generar color neon de alta saturacion
  const generateColor = (baseHue, seed) => {
    const saturation = 90 + seededRandom(seed * 1000) * 10; // 90-100%
    const lightness = 50 + seededRandom(seed * 2000) * 10;  // 50-60%
    return `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
  };

  const generateDailyColorPalette = () => {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

    const primaryHue = Math.floor(seededRandom(seed * 100) * 360);
    const secondaryHue = (primaryHue + 180) % 360;
    const accentHue = (primaryHue + 90) % 360;

    return {
      primaryColor: generateColor(primaryHue, seed),
      secondaryColor: generateColor(secondaryHue, seed * 2),
      accentColor: generateColor(accentHue, seed * 3),
      backgroundColor: 'hsl(240, 20%, 7%)',
      textColor: 'hsl(240, 30%, 90%)',
      gradient: `linear-gradient(135deg, ${generateColor(primaryHue, seed)}, ${generateColor(secondaryHue, seed * 2)})`,
      shadowColor: 'rgba(0, 0, 0, 0.3)'
    };
  };

  const applyColorPalette = (useDaily = false) => {
    const savedPreference = localStorage.getItem('useDailyPalette');
    const shouldUseDailyPalette = useDaily || (savedPreference === 'true');

    setIsDailyPalette(shouldUseDailyPalette);

    const palette = shouldUseDailyPalette
      ? generateDailyColorPalette()
      : originalPalette;

    Object.entries(palette).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });

    localStorage.setItem('useDailyPalette', shouldUseDailyPalette);
    return palette;
  };

  const toggleColorPalette = () => {
    const newValue = !isDailyPalette;
    applyColorPalette(newValue);
  };

  useEffect(() => {
    applyColorPalette();

    const addToggleButton = () => {
      if (document.getElementById('palette-toggle')) return;

      const toggleButton = document.createElement('button');
      toggleButton.id = 'palette-toggle';
      toggleButton.className = 'palette-toggle-btn';
      toggleButton.title = 'Cambiar paleta de colores';

      // Create icon element safely
      const icon = document.createElement('i');
      icon.className = 'fas fa-palette';
      toggleButton.appendChild(icon);

      toggleButton.addEventListener('click', toggleColorPalette);
      document.body.appendChild(toggleButton);

      const style = document.createElement('style');
      style.textContent = `
        .palette-toggle-btn {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 40px;
          height: 40px;
          border-radius: 0;
          background-color: var(--card-bg);
          border: var(--pixel-size) solid var(--pixel-border);
          box-shadow: 0 0 10px rgba(123, 45, 255, 0.3);
          color: var(--neon-purple);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 100;
          transition: box-shadow 0.3s ease;
          font-size: 1rem;
        }
        .palette-toggle-btn:hover {
          box-shadow: 0 0 20px rgba(123, 45, 255, 0.6);
          color: var(--secondary-color);
          border-color: var(--secondary-color);
        }
      `;
      document.head.appendChild(style);
    };

    addToggleButton();

    return () => {
      const toggleButton = document.getElementById('palette-toggle');
      if (toggleButton) {
        toggleButton.removeEventListener('click', toggleColorPalette);
        toggleButton.remove();
      }
    };
  }, []);

  return {
    isDailyPalette,
    applyColorPalette,
    toggleColorPalette,
    generateDailyColorPalette
  };
}
