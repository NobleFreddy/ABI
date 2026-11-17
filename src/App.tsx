import { HashRouter, Navigate, Route, Routes } from 'react-router'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Noten } from './pages/Noten'
import { Rechner } from './pages/Rechner'
import { Simulation } from './pages/Simulation'
import { Lernplan } from './pages/Lernplan'
import { Karteikarten } from './pages/Karteikarten'
import { Quiz } from './pages/Quiz'
import { Timer } from './pages/Timer'
import { Kalender } from './pages/Kalender'
import { Einstellungen } from './pages/Einstellungen'

export function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/noten" element={<Noten />} />
          <Route path="/rechner" element={<Rechner />} />
          <Route path="/simulation" element={<Simulation />} />
          <Route path="/lernplan" element={<Lernplan />} />
          <Route path="/karteikarten" element={<Karteikarten />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/timer" element={<Timer />} />
          <Route path="/kalender" element={<Kalender />} />
          <Route path="/einstellungen" element={<Einstellungen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  )
}
