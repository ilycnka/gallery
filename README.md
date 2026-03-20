# Gallery — 3D Art Space

A minimalist 3D digital gallery for displaying and selling graphic works. Paintings float in a volumetric space with a clean white aesthetic.

## Tech Stack

- Three.js
- Vanilla JavaScript (ES modules)
- HTML / CSS

## Project Structure

```
gallery/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js       # Entry point — initializes scene and controls
│   ├── scene.js      # Three.js scene setup
│   ├── gallery.js    # Gallery logic
│   └── controls.js   # Camera controls (mouse, touch, gyroscope)
└── assets/
    └── images/       # Artwork images
```

## Getting Started

Open `index.html` in a browser, or serve it locally:

```bash
npx serve .
```

## Design

- Background: `#f5f5f5`
- Text: `#1a1a1a`
- Style: minimalism, lots of whitespace

## Platform Support

- Desktop and mobile
- Touch controls and gyroscope support
