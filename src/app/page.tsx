import Link from "next/link";
import Balloons from "@/components/Balloons";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFF0F3] relative overflow-hidden">
      <Balloons />
      <main className="container mx-auto px-6 py-12 md:py-20 max-w-2xl relative z-10">
        {/* Header */}
        <header className="mb-16">
          <div className="text-sm text-[#b07d8a] mb-2">a tiny web app for</div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#2d2d2d] leading-tight">
            asking someone out
            <br />
            <span className="italic">without the awkwardness</span>
          </h1>
        </header>

        {/* Main content */}
        <div className="space-y-12">
          <p className="text-lg text-[#5c4a4f] leading-relaxed max-w-lg">
            Write a message. Get a link. Send it to them. They respond. You find
            out. Simple as that.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/create"
              className="inline-block bg-[#e53e5f] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#d63555] transition-colors"
            >
              Create your invite
            </Link>
            <span className="text-[#c49aa3] self-center text-sm">
              takes about 30 seconds
            </span>
          </div>

          {/* How it works */}
          <div className="border-t border-[#f5d0d8] pt-12 mt-16">
            <h2 className="text-xs uppercase tracking-wider text-[#c49aa3] mb-8">
              How it works
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="text-[#f472b6] font-mono text-sm">01</span>
                <p className="text-[#5c4a4f]">
                  Write what you want to say (or pick a starter)
                </p>
              </div>
              <div className="flex gap-4">
                <span className="text-[#f472b6] font-mono text-sm">02</span>
                <p className="text-[#5c4a4f]">
                  Send the link however you want — text, DM, carrier pigeon
                </p>
              </div>
              <div className="flex gap-4">
                <span className="text-[#f472b6] font-mono text-sm">03</span>
                <p className="text-[#5c4a4f]">
                  They click yes, no, or maybe. You get notified.
                </p>
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="bg-white/60 border border-[#f9a8d4] rounded-lg p-6 mt-12">
            <p className="text-[#7a5a63] text-sm leading-relaxed">
              No sign up. No tracking. No weird stuff. Just a simple way to
              shoot your shot without having to see their face when they read
              it.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-[#c49aa3] text-sm relative z-10">
        <p>made for the brave ones</p>
      </footer>
    </div>
  );
}
