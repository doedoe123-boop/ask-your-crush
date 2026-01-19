import Link from "next/link";
import Balloons from "@/components/Balloons";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFF8F0] relative overflow-hidden">
      <Balloons />
      <main className="container mx-auto px-6 py-12 md:py-20 max-w-2xl">
        {/* Header */}
        <header className="mb-16">
          <div className="text-sm text-[#666] mb-2">a tiny web app for</div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#1a1a1a] leading-tight">
            asking someone out
            <br />
            <span className="italic">without the awkwardness</span>
          </h1>
        </header>

        {/* Main content */}
        <div className="space-y-12">
          <p className="text-lg text-[#444] leading-relaxed max-w-lg">
            Write a message. Get a link. Send it to them. They respond. You find
            out. Simple as that.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/create"
              className="inline-block bg-[#1a1a1a] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#333] transition-colors"
            >
              Create your invite
            </Link>
            <span className="text-[#999] self-center text-sm">
              takes about 30 seconds
            </span>
          </div>

          {/* How it works */}
          <div className="border-t border-[#e5e5e5] pt-12 mt-16">
            <h2 className="text-xs uppercase tracking-wider text-[#999] mb-8">
              How it works
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="text-[#ccc] font-mono text-sm">01</span>
                <p className="text-[#444]">
                  Write what you want to say (or pick a starter)
                </p>
              </div>
              <div className="flex gap-4">
                <span className="text-[#ccc] font-mono text-sm">02</span>
                <p className="text-[#444]">
                  Send the link however you want — text, DM, carrier pigeon
                </p>
              </div>
              <div className="flex gap-4">
                <span className="text-[#ccc] font-mono text-sm">03</span>
                <p className="text-[#444]">
                  They click yes, no, or maybe. You get notified.
                </p>
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="bg-[#FFFDF5] border border-[#f0e6d3] rounded-lg p-6 mt-12">
            <p className="text-[#666] text-sm leading-relaxed">
              No sign up. No tracking. No weird stuff. Just a simple way to
              shoot your shot without having to see their face when they read
              it.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-[#bbb] text-sm">
        <p>made for the brave ones</p>
      </footer>
    </div>
  );
}
