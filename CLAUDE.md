# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Nuestro Amor" (Our Love) is a romantic anniversary website celebrating a relationship. It features:

- A real-time counter showing days, hours, minutes, and seconds since the relationship started (Nov 24, 2024)
- Photo carousel with captions for special moments
- Interactive elements like a color-changing heart button
- "Will you be my girlfriend?" proposal feature with confetti celebration
- Special themes for occasions like Valentine's Day
- Daily color palette generation

## Technology Stack

- **Frontend**: Vanilla JavaScript (no framework)
- **Animations**: GSAP 3.12.2 (with ScrollTrigger, TextPlugin, MorphSVGPlugin)
- **Icons**: Font Awesome 6.4.0
- **Static Site**: Plain HTML/CSS/JS with no build tools

## Project Structure

The codebase is organized into several key JavaScript modules:

- **script.js**: Core functionality (time counter, carousel)
- **proposal.js**: Proposal feature with celebration effects
- **special-events.js**: Holiday-specific themes (Valentine's Day, etc.)
- **gsap-animations.js**: Animation logic using GSAP
- **daily-color-palette.js**: Dynamic color generation system

CSS files:
- **styles.css**: Main styling with CSS variables
- **proposal.css**: Proposal-specific styles
- **responsive-css.css**: Mobile responsiveness

## Development Workflow

### Running the Project

This is a static website with no build process:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

Then access at `http://localhost:8000`.

### Key Configuration

The main configuration is in `script.js`:

```javascript
config = {
    startDate: '2024-11-24T00:00:00',  // Anniversary date
    photoBasePath: '/img/',
    photosJsonUrl: 'photos.json',
    stardustOptions: {
        enabled: true,
        particleCount: 30,
        colors: ['#ff6b95', '#7e57c2', '#00bcd4']
    }
}
```

### Architecture Patterns

1. **Module Pattern** - Used in `proposalManager`, `specialEvents`, `GSAPAnimations`, and `ColorPaletteManager` for encapsulation
2. **Event-Driven Architecture** - Event listeners for user interactions
3. **CSS Variables** - Dynamic theme switching via JS
4. **localStorage** - Persistent user preferences

## Development Roadmap

Future planned features (from README.md):

- Database for photos and messages
- Admin panel for content management
- Email notification system for special dates
- Memory timeline feature
- More special event categories
- Music integration
- "Story mode" to view relationship progress
- Categorized photo albums
- Bucket list section
- Google Calendar integration

## Working with Special Events

The `special-events.js` file contains logic for applying specific themes on particular dates:

- Valentine's Day (Feb 14) - Red heart colors, special decorations
- Yellow Flowers Day (March 21) - Yellow color theme, flower effects

When adding new special events, follow the established pattern:

```javascript
// Add to the specialEvents.events array
{
    name: 'eventName',
    month: 4,           // Month (1-12)
    day: 15,            // Day (1-31)
    handler: function() {
        // Theme implementation code
    }
}
```

## Animation System

The project uses GSAP extensively for animations. Main animation features:

- **Title animations** - Fade in with glow effects
- **Floating particles** - Hearts and stars moving around screen
- **Mouse tracking** - Particle effects follow cursor
- **Scroll animations** - ScrollTrigger-based effects

When adding new animations, use the existing GSAP instance and follow established patterns in `gsap-animations.js`.

## Daily Color Palette

The site generates a unique color scheme each day using a seeded random algorithm:

- Colors are calculated based on the current date
- A toggle button switches between daily/original palette
- CSS variables are updated dynamically

When working with colors, use the ColorPaletteManager module in `daily-color-palette.js`.

## Important Notes

- The project is entirely frontend with no server-side components
- All dates should be formatted in Spanish
- The site is optimized for both desktop and mobile viewing
- Performance considerations should be made for animations (particle count limited to 30)