// Daily Color Palette Generator
const ColorPaletteManager = (function() {
    // Original color palette (from styles.css)
    const originalPalette = {
        primaryColor: '#ff6b95',
        secondaryColor: '#7e57c2',
        accentColor: '#00bcd4',
        backgroundColor: '#fef6fb',
        textColor: '#333333',
        gradient: 'linear-gradient(135deg, #ff6b95, #7e57c2)',
        shadowColor: 'rgba(255, 107, 149, 0.25)'
    };

    // Seeded random function to ensure consistent colors for a given day
    function seededRandom(seed) {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }
    
    // Function to generate a vibrant, readable color
    function generateColor(baseHue, seed) {
        // Use seeded random to get consistent but varied colors
        const saturation = 70 + seededRandom(seed * 1000) * 20; // 70-90%
        const lightness = 50 + seededRandom(seed * 2000) * 10; // 50-60%
        return `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
    }
    
    // Generate daily color palette
    function generateDailyColorPalette() {
        // Use the current date to seed the random color generation
        const today = new Date();
        const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
        
        // Generate base hues using the seed
        const primaryHue = Math.floor(seededRandom(seed * 100) * 360);
        const secondaryHue = (primaryHue + 180) % 360;
        const accentHue = (primaryHue + 90) % 360;
        
        // Generate color palette
        return {
            primaryColor: generateColor(primaryHue, seed),
            secondaryColor: generateColor(secondaryHue, seed * 2),
            accentColor: generateColor(accentHue, seed * 3),
            backgroundColor: 'hsl(0, 0%, 98%)', // Soft white background
            textColor: 'hsl(0, 0%, 20%)', // Dark gray for text
            gradient: `linear-gradient(135deg, ${generateColor(primaryHue, seed)}, ${generateColor(secondaryHue, seed * 2)})`,
            shadowColor: 'rgba(0, 0, 0, 0.1)' // Consistent, subtle shadow
        };
    }

    // Function to apply a color palette
    function applyColorPalette(palette) {
        // Update CSS variables
        const variables = [
            'primary-color', 'secondary-color', 'accent-color', 
            'background-color', 'text-color', 'gradient', 'shadow-color'
        ];

        variables.forEach(variable => {
            document.documentElement.style.setProperty(`--${variable}`, palette[variable.replace(/-/g, '')]);
            document.documentElement.style.setProperty(`--new-${variable}`, palette[variable.replace(/-/g, '')]);
        });

        // Store current palette in localStorage
        localStorage.setItem('currentColorPalette', JSON.stringify(palette));
    }

    // Function to create color palette toggle button
    function createPaletteToggleButton() {
        // Check if button already exists
        if (document.getElementById('palette-toggle-btn')) return;

        const button = document.createElement('button');
        button.id = 'palette-toggle-btn';
        button.className = 'palette-toggle-btn';
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3-13h-2v5h5v-2h-3z"/>
            </svg>
        `;
        
        button.style.position = 'fixed';
        button.style.bottom = '1rem';
        button.style.right = '1rem';
        button.style.zIndex = '1000';
        button.style.background = 'var(--primary-color)';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '50%';
        button.style.width = '50px';
        button.style.height = '50px';
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        button.style.cursor = 'pointer';
        button.style.transition = 'transform 0.3s ease';

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });

        button.addEventListener('click', toggleColorPalette);

        document.body.appendChild(button);
    }

    // Toggle between daily and original palette
    function toggleColorPalette() {
        const storedPalette = localStorage.getItem('currentColorPalette');
        const isDailyPalette = storedPalette && JSON.parse(storedPalette).primaryColor !== originalPalette.primaryColor;

        if (isDailyPalette) {
            // Switch to original palette
            applyColorPalette(originalPalette);
        } else {
            // Switch to daily palette
            applyColorPalette(generateDailyColorPalette());
        }
    }

    // Initialize color palette
    function init() {
        // Check if there's a stored palette
        const storedPalette = localStorage.getItem('currentColorPalette');
        
        if (storedPalette) {
            // Apply the stored palette
            applyColorPalette(JSON.parse(storedPalette));
        } else {
            // Apply daily palette by default
            applyColorPalette(generateDailyColorPalette());
        }

        // Create toggle button
        createPaletteToggleButton();
    }

    // Expose public methods
    return {
        init: init,
        toggleColorPalette: toggleColorPalette
    };
})();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    ColorPaletteManager.init();
});