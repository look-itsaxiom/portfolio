import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginGate from "./components/LoginGate"
import DashboardLayout from "./components/DashboardLayout"
import DashboardPage from "./pages/DashboardPage"
import ImpactListPage from "./pages/ImpactListPage"
import LabsListPage from "./pages/LabsListPage"
import DevlogListPage from "./pages/DevlogListPage"
import ContentEditPage from "./pages/ContentEditPage"
import KnowledgeListPage from "./pages/KnowledgeListPage"
import KnowledgeEditPage from "./pages/KnowledgeEditPage"
import RagEntriesPage from "./pages/RagEntriesPage"
import ProjectsPage from "./pages/ProjectsPage"
import ExhibitsPage from "./pages/ExhibitsPage"
import PromptsPage from "./pages/PromptsPage"
import SeedPage from "./pages/SeedPage"

export default function App() {
  return (
    <BrowserRouter>
      <LoginGate>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<DashboardPage />} />

            <Route path="/impact" element={<ImpactListPage />} />
            <Route path="/impact/new" element={<ContentEditPage type="impact" />} />
            <Route path="/impact/:slug" element={<ContentEditPage type="impact" />} />

            <Route path="/labs" element={<LabsListPage />} />
            <Route path="/labs/new" element={<ContentEditPage type="labs" />} />
            <Route path="/labs/:slug" element={<ContentEditPage type="labs" />} />

            <Route path="/devlog" element={<DevlogListPage />} />
            <Route path="/devlog/new" element={<ContentEditPage type="devlog" />} />
            <Route path="/devlog/:slug" element={<ContentEditPage type="devlog" />} />

            <Route path="/knowledge" element={<KnowledgeListPage />} />
            <Route path="/knowledge/*" element={<KnowledgeEditPage />} />

            <Route path="/rag" element={<RagEntriesPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/exhibits" element={<ExhibitsPage />} />
            <Route path="/prompts" element={<PromptsPage />} />
            <Route path="/seed" element={<SeedPage />} />
          </Route>
        </Routes>
      </LoginGate>
    </BrowserRouter>
  )
}
