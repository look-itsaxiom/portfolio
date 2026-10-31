import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ContactSection() {
  return (
    <section id="contact" className="py-12 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Card className="mx-auto max-w-xl text-center">
          <CardHeader>
            <CardTitle className="text-2xl">
              If you&apos;re building something interesting, let&apos;s talk.
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              I&apos;m always looking for the next challenge, whether
              that&apos;s a product team that ships fast or a collaboration on
              something new.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="mailto:itsaxiom.dev@proton.me"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Get in Touch
              </a>
              <a
                href="https://skibbysoft.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center justify-center rounded-md border border-primary/50 px-6 text-sm font-medium transition-colors hover:border-primary hover:bg-primary/10"
              >
                Hire me through SkibbySoft →
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
