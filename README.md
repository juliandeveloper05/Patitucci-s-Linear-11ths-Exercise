# 🎸 Bass Academy

<div align="center">

![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

**Interactive Bass Training Platform**

[Demo](#-demo) • [Features](#-features) • [Installation](#-installation) • [Roadmap](#-roadmap)

</div>

---

## 📖 About

A comprehensive bass practice platform featuring a **selectable exercise library** with techniques from legendary artists like **John Patitucci**.

Practice arpeggios, scales, and patterns with real-time tablature, fretboard visualization, and Web Audio synthesis - all transposable to any key.

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📚 **Exercise Library** | 8+ arpeggio patterns: Maj7, m7, dom7, dim7, Linear 11ths, and more |
| 🎹 **Root Transposition** | Practice any pattern in all 12 chromatic keys |
| 🎯 **Interactive Tablature** | Real-time visual feedback highlighting notes as they play |
| 🎸 **Fretboard View** | Alternative visualization showing the bass neck |
| 🔊 **Web Audio Engine** | Custom synthesizer built with Web Audio API |
| 🥁 **Metronome** | Beat indicator with triplet subdivisions |
| ⏱️ **Tempo Control** | Adjustable BPM from 40-160 |
| 🔄 **Loop Mode** | Continuous practice without interruption |
| 🌓 **Dark/Light Theme** | Toggle between themes with persistence |
| 📱 **Responsive Design** | Optimized for desktop and mobile |

## 📚 Exercise Library

### Artist Techniques
| Pattern | Category | Difficulty |
|---------|----------|------------|
| Linear 11ths (Major) | John Patitucci | ★★★★☆ |
| Linear 11ths (Minor) | John Patitucci | ★★★★☆ |

### Basic 7th Arpeggios
| Pattern | Intervals | Difficulty |
|---------|-----------|------------|
| Major 7th | 1, 3, 5, 7 | ★★☆☆☆ |
| Minor 7th | 1, b3, 5, b7 | ★★☆☆☆ |
| Dominant 7th | 1, 3, 5, b7 | ★★☆☆☆ |
| Half Diminished | 1, b3, b5, b7 | ★★★☆☆ |
| Diminished 7th | 1, b3, b5, bb7 | ★★★☆☆ |

### Advanced 7th Arpeggios
| Pattern | Intervals | Difficulty |
|---------|-----------|------------|
| Minor Major 7th | 1, b3, 5, 7 | ★★★★☆ |
| Augmented 7th | 1, 3, #5, 7 | ★★★★☆ |

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/juliandeveloper05/Bass-Academy-Interactive-Bass-Training.git

# Navigate to project
cd Bass-Academy-Interactive-Bass-Training

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 🛠️ Tech Stack

- **Framework:** React 19.2 with React Compiler
- **Build Tool:** Vite 7.2
- **Styling:** Tailwind CSS 4.1
- **Icons:** Lucide React
- **Audio:** Web Audio API

## 📁 Project Structure

```
bass-academy/
├── src/
│   ├── components/
│   │   ├── ExerciseSelector.jsx  # Pattern & root selection
│   │   ├── FretboardView.jsx     # Fretboard visualization
│   │   └── Footer.jsx
│   ├── data/
│   │   └── exerciseLibrary.js    # Patterns & generation
│   ├── App.jsx                   # Main component
│   ├── index.css                 # Design system
│   └── main.jsx
├── index.html
└── package.json
```

## 🗺️ Roadmap

### ✅ Completed
- [x] Exercise library with selectable patterns
- [x] Root note transposition (12 keys)
- [x] Metronome with triplet subdivisions
- [x] Fretboard visualization mode
- [x] Light/Dark theme toggle
- [x] Countdown timer before playback

### 🔜 Upcoming
- [ ] More artist techniques (Victor Wooten, Marcus Miller)
- [ ] Scale patterns (Major, Minor, Modes)
- [ ] PWA support for offline use
- [ ] Real bass samples
- [ ] Practice session statistics

## 🎓 Resources

- [John Patitucci Official](https://johnpatitucci.com/)
- [Linear Arpeggios Explained (YouTube)](https://www.youtube.com/results?search_query=john+patitucci+linear+arpeggios)
- [Web Audio API Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

## 📄 License

MIT © 2025

---

<div align="center">

**Made with ❤️ for bass players**

**Bass Academy · 2026**

</div>