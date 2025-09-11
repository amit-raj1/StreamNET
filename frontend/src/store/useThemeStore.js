import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("streamNET-theme") || "sunset",
  setTheme: (theme) => {
    localStorage.setItem("streamNET-theme", theme);
    set({ theme });
  },
}));
