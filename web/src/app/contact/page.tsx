"use client"

import { Mail, Github, Linkedin, MapPin } from "lucide-react"

const contactLinks = [
  {
    icon: Mail,
    label: "Email",
    value: "itsaxiom.dev@proton.me",
    href: "mailto:itsaxiom.dev@proton.me",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "look-itsaxiom",
    href: "https://github.com/look-itsaxiom",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "chase-skibeness",
    href: "https://linkedin.com/in/chase-skibeness",
  },
]

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="text-2xl font-semibold sm:text-3xl md:text-4xl">
        Let&apos;s Talk
      </h1>
      <p className="mt-3 text-muted-foreground">
        Open to collaboration, consulting, and conversations about what you&apos;re building.
        Currently available for contract work and interesting full-time opportunities.
      </p>

      <div className="mt-10 space-y-6">
        {contactLinks.map(({ icon: Icon, label, value, href }) => (
          <a
            key={label}
            href={href}
            target={label !== "Email" ? "_blank" : undefined}
            rel={label !== "Email" ? "noopener noreferrer" : undefined}
            className="flex items-center gap-4 rounded-lg border border-border/40 bg-card/50 p-4 transition-colors hover:border-primary/50"
          >
            <Icon className="h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium">{label}</p>
              <p className="text-sm text-muted-foreground">{value}</p>
            </div>
          </a>
        ))}

        <div className="flex items-center gap-4 rounded-lg border border-border/40 bg-card/50 p-4">
          <MapPin className="h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-medium">Location</p>
            <p className="text-sm text-muted-foreground">Seattle, WA area</p>
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-lg border border-primary/30 bg-card/40 p-6 text-center">
        <p className="text-muted-foreground">
          Want a quick overview of Chase&apos;s work? Ask the AI curator.
        </p>
        <button
          type="button"
          className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          onClick={() => {
            window.dispatchEvent(
              new CustomEvent("open-axiom-chat", {
                detail: { prompt: "What is Chase working on right now?" },
              })
            )
          }}
        >
          Ask Axiom
        </button>
      </div>
    </section>
  )
}
