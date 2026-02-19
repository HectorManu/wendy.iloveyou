import { useState, useEffect } from 'preact/hooks';

export function useSpecialEvents() {
  const [currentEvent, setCurrentEvent] = useState(null);

  const events = [
    {
      name: 'valentinesDay',
      month: 2,
      day: 14,
      handler: handleValentinesDay
    },
    {
      name: 'yellowFlowersDay',
      month: 3,
      day: 21,
      handler: handleYellowFlowersDay
    }
  ];

  const checkForSpecialEvents = () => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();

    const matchingEvent = events.find(event =>
      event.month === currentMonth && event.day === currentDay
    );

    if (matchingEvent) {
      setCurrentEvent(matchingEvent);
      matchingEvent.handler();
    } else {
      setCurrentEvent(null);
      resetToDefaultTheme();
    }
  };

  // Valentine's Day - Neon red theme
  function handleValentinesDay() {
    document.documentElement.style.setProperty('--primary-color', '#ff0040');
    document.documentElement.style.setProperty('--secondary-color', '#ff3366');
    document.documentElement.style.setProperty('--accent-color', '#ff6699');
    document.documentElement.style.setProperty('--background-color', '#1a0010');
    document.documentElement.style.setProperty('--card-bg', '#1a0015');

    document.body.classList.add('valentines-day');
    createValentinesDecoration();
  }

  // Yellow Flowers Day - Neon yellow theme
  function handleYellowFlowersDay() {
    document.documentElement.style.setProperty('--primary-color', '#ffea00');
    document.documentElement.style.setProperty('--secondary-color', '#ffab00');
    document.documentElement.style.setProperty('--accent-color', '#ffd600');
    document.documentElement.style.setProperty('--background-color', '#1a1a00');
    document.documentElement.style.setProperty('--card-bg', '#1a1a08');

    document.body.classList.add('yellow-flowers-day');
    createYellowFlowersDecoration();
  }

  // Reset to neon default
  function resetToDefaultTheme() {
    document.body.classList.remove('valentines-day', 'yellow-flowers-day');

    const decorationElements = document.querySelectorAll('.special-event-decoration');
    decorationElements.forEach(el => el.remove());

    document.documentElement.style.setProperty('--primary-color', '#ff2d7b');
    document.documentElement.style.setProperty('--secondary-color', '#00ffcc');
    document.documentElement.style.setProperty('--accent-color', '#ffea00');
    document.documentElement.style.setProperty('--background-color', '#0a0a1a');
    document.documentElement.style.setProperty('--card-bg', '#12122a');
  }

  function createValentinesDecoration() {
    const oldDecorations = document.querySelectorAll('.special-event-decoration');
    oldDecorations.forEach(el => el.remove());

    const decorationContainer = document.createElement('div');
    decorationContainer.className = 'special-event-decoration valentines-decoration';
    document.body.appendChild(decorationContainer);

    if (typeof gsap !== 'undefined') {
      for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = '\u2665';
        heart.style.fontFamily = "'Press Start 2P', monospace";
        heart.style.fontSize = (0.5 + Math.random() * 1) + 'rem';
        decorationContainer.appendChild(heart);

        gsap.set(heart, {
          x: Math.random() * 100 + 'vw',
          y: Math.random() * 100 + 'vh',
          scale: 0.5 + Math.random() * 1.5,
          opacity: 0.5
        });

        gsap.to(heart, {
          y: '-=100vh',
          x: '+=20',
          rotation: Math.random() * 360,
          repeat: -1,
          duration: 10 + Math.random() * 20,
          ease: 'steps(16)',
          delay: Math.random() * 5
        });
      }
    }
  }

  function createYellowFlowersDecoration() {
    const oldDecorations = document.querySelectorAll('.special-event-decoration');
    oldDecorations.forEach(el => el.remove());

    const decorationContainer = document.createElement('div');
    decorationContainer.className = 'special-event-decoration yellow-flowers-decoration';
    document.body.appendChild(decorationContainer);

    if (typeof gsap !== 'undefined') {
      for (let i = 0; i < 15; i++) {
        const flower = document.createElement('div');
        flower.className = 'floating-flower';
        flower.textContent = i % 2 === 0 ? '\u2744' : '\u2605';
        flower.style.fontFamily = "'Press Start 2P', monospace";
        flower.style.color = '#ffea00';
        flower.style.fontSize = (0.5 + Math.random() * 0.8) + 'rem';
        decorationContainer.appendChild(flower);

        gsap.set(flower, {
          x: Math.random() * 100 + 'vw',
          y: Math.random() * 100 + 'vh',
          scale: 0.5 + Math.random() * 1.5,
          opacity: 0.5
        });

        gsap.to(flower, {
          rotation: 360,
          repeat: -1,
          duration: 20,
          ease: 'steps(16)'
        });

        gsap.to(flower, {
          y: '+=50',
          x: '+=30',
          repeat: -1,
          yoyo: true,
          duration: 8 + Math.random() * 10,
          ease: 'steps(12)'
        });
      }
    }
  }

  useEffect(() => {
    checkForSpecialEvents();
  }, []);

  return {
    currentEvent,
    checkForSpecialEvents
  };
}
