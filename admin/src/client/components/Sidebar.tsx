import { NavLink, useNavigate } from "react-router-dom"

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/impact", label: "Impact" },
  { to: "/labs", label: "Labs" },
  { to: "/devlog", label: "Devlog" },
  { to: "/knowledge", label: "Knowledge" },
  { to: "/rag", label: "RAG Entries" },
  { to: "/projects", label: "Projects" },
  { to: "/exhibits", label: "Exhibits" },
  { to: "/prompts", label: "Prompts" },
  { to: "/seed", label: "Seed" },
]

export default function Sidebar() {
  const navigate = useNavigate()

  function handleLogout() {
    sessionStorage.removeItem("admin-secret")
    window.location.reload()
  }

  return (
    <aside className="w-56 shrink-0 h-screen bg-zinc-900 border-r border-zinc-800 flex flex-col">
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">
          Admin
        </h2>
      </div>

      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              `block px-3 py-2 rounded text-sm transition-colors ${
                isActive
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-2 border-t border-zinc-800">
        <button
          onClick={handleLogout}
          className="w-full px-3 py-2 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 rounded text-left transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  )
}
