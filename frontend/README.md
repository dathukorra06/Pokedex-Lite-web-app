# Pokedex Lite 🚀

A modern, high-performance, and premium Pokemon web application built with **Next.js 16** and **React 19**. This app provides a seamless experience for browsing, searching, and managing your favorite Pokemon.

![Pokedex Lite Demo](https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png)

## ✨ Features

- **SSR (Server-Side Rendering)**: Fast initial loads and SEO optimization.
- **Real-time Search**: Instant name-based filtering across 1000+ Pokemon.
- **Type-based Filtering**: Dynamic category browsing with element-specific color coding.
- **Persistent Favorites**: Save your favorite Pokemon to local storage.
- **Detailed Stats**: Rich modal views with base stats, abilities, and physical traits.
- **Premium UI/UX**: Glassmorphism, smooth gradients, and high-quality animations.
- **Full Responsiveness**: Optimized for mobile, tablet, and desktop screens.

## 🛠️ Technologies & Libraries

- **Next.js 16 (App Router)**: Chosen for its robust SSR capabilities, optimized routing, and performance-first architecture.
- **React 19**: Leverages the latest React features and improved rendering engine.
- **Vanilla CSS (CSS Modules)**: Used for complete styling control and zero runtime overhead, ensuring a unique and lightweight design system.
- **Framer Motion**: Integrated for advanced layout transitions and micro-animations that provide a "premium" feel.
- **Lucide React**: Provides a modern, consistent, and lightweight icon set.
- **PokéAPI**: The definitive source for Pokemon data.

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20 or higher (Latest LTS recommended)
- **npm** or **yarn**

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd pokedex-lite
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

To start the development server:
```bash
npm run dev
```
The app will be available at [http://localhost:3000](http://localhost:3000).

### Production Build

To create and run a production-optimized build:
```bash
npm run build
npm run start
```

## 🧠 Challenges & Solutions

### 1. Handling Large Datasets (1000+ Items)
**Challenge**: Fetching and rendering 1000+ Pokemon without compromising performance or SEO.
**Solution**: We implemented a hybrid approach where basic data (names/IDs) is fetched on the server (SSR) to ensure fast initial paint and SEO. On the client, we use an efficient pagination system (20 items per page) and `useMemo` for instant filtering/searching, avoiding expensive API re-calls during browsing.

### 2. Hydration & Client-Only State
**Challenge**: Managing state that depends on browser APIs (like `localStorage` for Favorites) in a Next.js environment can lead to hydration mismatches.
**Solution**: We utilized the `useEffect` hook to load the Favorites from `localStorage` only after the initial mount, ensuring the server-rendered HTML matches the initial client render while still providing persistence.

### 3. Modal Animation Lifecycle
**Challenge**: Exit animations for the detail view were being cut off because the component was unmounting immediately when the ID became null.
**Solution**: Refactored the `PokemonModal` to wrap the conditional rendering within `AnimatePresence`. This allows Framer Motion to track the exit state and play the full fade-out/scale-down animation before the component is actually removed from the DOM.

### 4. Interactive Layering (Z-Index)
**Challenge**: On certain devices, pagination buttons were being intercepted by the Next.js dev overlay or invisible modal remnants.
**Solution**: Implemented a strict `z-index` hierarchy and `pointer-events` management, ensuring the pagination layer is always accessible and interactive.

---

Developed with ❤️ as a Frontend Developer Assignment.
