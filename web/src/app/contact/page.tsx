import type { Metadata } from "next"
import { ContactContent } from "@/components/contact-content"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Chase Skibeness — open to full-time opportunities, contract work, and collaboration. Based in Seattle, WA.",
  openGraph: {
    title: "Contact Chase Skibeness",
    description:
      "Open to full-time opportunities, contract work, and collaboration. Based in Seattle, WA.",
  },
}

export default function ContactPage() {
  return <ContactContent />
}
