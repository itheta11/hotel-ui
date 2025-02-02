import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Button } from "./components/ui/button";
import { ModeToggle } from "./components/theme/ThemeModeToggle";
import { Route, Routes, HashRouter as Router } from "react-router-dom";
import Header from "./components/header/Header";
import Booking from "./components/booking/Booking";
import { API_URL } from "./constants";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { GetAllRooms } from "./api/rooms";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <Router>
      <main
        className="w-screen h-screen light bg-slate-100 dark:bg-zinc-900 text-zinc-900 dark:text-slate-100
    font-sans "
      >
        <Header />
        <Routes>
          <Route path="/" element={<Booking />} />
        </Routes>
      </main>
      <Toaster />
    </Router>
  );
}

export default App;
