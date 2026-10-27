import { useEffect, useState } from "react";
import Button from "./Button.jsx";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") ?? "dark");

  useEffect(() => {
    const root = window.document.documentElement;
    // Remove previous theme classes and add the current theme
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    // Save preference in local storage
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <Button click={() => setTheme(theme === "dark" ? "light" : "dark")}>
      {theme === "dark" ? <Moon /> : <Sun />}
    </Button>
  );
};

export default ThemeToggle;
