import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Clientes from "./pages/Clientes";
import ClienteEmails from "./pages/ClienteEmails";
import FirstDisk from "./pages/FirstDisk";
import ReinforcingDisk from "./pages/ReinforcingDisk";
import FirstPowerDown from "./pages/FirstPowerDown";
import ReinforcingPowerDown from "./pages/ReinforcingPowerDown";
import TicketByEmail from "./pages/TicketByEmail";
import AlertAutomatic from "./pages/AlertAutomatic";
import Triagens from "./pages/Triagens";
import "./styles.css";

export type Theme = "light" | "dark";

function temaInicial(): Theme {
  const salvo = localStorage.getItem("theme");
  if (salvo === "light" || salvo === "dark") return salvo;

  // Sem preferência salva, segue o sistema — o plantão noturno já chega escuro.
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function App() {
  const [theme, setTheme] = useState<Theme>(temaInicial);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);

    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#080C15" : "#0B1226");
  }, [theme]);

  function handleToggleTheme() {
    setTheme((atual) => (atual === "dark" ? "light" : "dark"));
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <MainLayout theme={theme} onToggleTheme={handleToggleTheme} />
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route
            path="/clientes/:clienteId/emails"
            element={<ClienteEmails />}
          />
          <Route path="/first-disk" element={<FirstDisk />} />
          <Route path="/reinforcing-disk" element={<ReinforcingDisk />} />
          <Route path="/first-powerdown" element={<FirstPowerDown />} />
          <Route
            path="/reinforcing-powerdown"
            element={<ReinforcingPowerDown />}
          />
          <Route path="/ticket" element={<TicketByEmail />} />
          <Route path="/alert" element={<AlertAutomatic />} />
          <Route path="/triagens" element={<Triagens />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
