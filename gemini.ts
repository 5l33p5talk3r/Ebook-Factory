@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
}

:root {
  --ui-font: 'Inter', sans-serif;
}

body {
  font-family: var(--ui-font);
}

.dark {
  color-scheme: dark;
}

/* Custom scrollbar for dark mode */
.dark ::-webkit-scrollbar {
  width: 10px;
}

.dark ::-webkit-scrollbar-track {
  background: #1e293b;
}

.dark ::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 5px;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #475569;
}

.fact-check-highlight {
  cursor: help;
  transition: all 0.2s ease-in-out;
}

.fact-check-highlight:hover {
  filter: brightness(0.95);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.high-contrast {
  filter: contrast(150%) saturate(120%);
}
