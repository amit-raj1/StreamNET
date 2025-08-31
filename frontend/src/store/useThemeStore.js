import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("streamNET-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("streamNET-theme", theme);
    set({ theme });
  },
}));
