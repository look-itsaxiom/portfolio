import { HeroCarousel } from "@/components/hero-carousel"
import { ImpactSection } from "@/components/impact-section"
import { LabsSection } from "@/components/labs-section"
import { DevlogSection } from "@/components/devlog-section"
import { ContactSection } from "@/components/contact-section"
import { Separator } from "@/components/ui/separator"

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <Separator className="mx-auto max-w-5xl" />
      <ImpactSection />
      <Separator className="mx-auto max-w-5xl" />
      <LabsSection />
      <Separator className="mx-auto max-w-5xl" />
      <DevlogSection />
      <Separator className="mx-auto max-w-5xl" />
      <ContactSection />
    </>
  )
}
