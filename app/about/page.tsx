import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-24">

      <div className="max-w-6xl mx-auto">

        {/* PHOTO + BIO */}
        <div className="grid md:grid-cols-2 gap-16 items-start">

          {/* Portrait + Credential */}
          <div className="flex flex-col items-center">

       <Image
  src="/terry.jpg"
  alt="Terry Richardson"
  width={500}
  height={600}
  className="rounded-2xl object-cover shadow-2xl
             ring-1 ring-white/10
             shadow-[0_0_80px_rgba(255,255,255,0.08)]
             opacity-0 scale-[0.96]
             animate-[portraitReveal_2s_cubic-bezier(0.22,1,0.36,1)_forwards]"
/>
           
            {/* Working With Children Badge */}
            <div className="mt-8 border border-white/20 rounded-xl px-8 py-6 text-center
                bg-white/[0.02] backdrop-blur-sm
                opacity-0
                animate-[badgeReveal_1.2s_cubic-bezier(0.22,1,0.36,1)_forwards]
                [animation-delay:1.2s]">

              <p className="text-[11px] uppercase tracking-[0.35em] text-white/60 mb-3">
                ✓ Working With Children Clearance
              </p>

              <p className="text-white/90 text-sm font-medium">
                Terry Byrne Richardson
              </p>

              <p className="text-white/60 text-sm">
                Born 9 May 1948
              </p>

              <p className="text-white/40 text-xs tracking-wide mt-2">
                SRN 1255-4136
              </p>

            </div>

          </div>

          {/* Bio */}
<div>

  <h1 className="text-4xl md:text-5xl font-serif mb-4">
    Terry Richardson
  </h1>

  {/* Leica Style Signature Strip */}
  <div className="flex items-center gap-4 mb-8">

    <div className="flex-1 h-[1px] bg-white/20"></div>

    <p className="text-[11px] uppercase tracking-[0.35em] text-white/60 whitespace-nowrap">
      Photographer • Adelaide South Australia
    </p>

    <div className="flex-1 h-[1px] bg-white/20"></div>

  </div>

  {/* Animated Bio */}
  <div className="opacity-0 animate-[bioReveal_1.2s_cubic-bezier(0.22,1,0.36,1)_forwards] [animation-delay:1.8s]">

    <p className="text-white/70 leading-relaxed mb-6">
      Terry Richardson is an Adelaide based hobby photographer specialising in
      family, sport, travel and commercial photography. His work focuses
      on capturing authentic moments with natural light and strong visual
      storytelling.
    </p>

    <p className="text-white/70 leading-relaxed">
      With a passion for documenting people and places, Terry creates
      images that feel timeless and honest while maintaining a clean
      editorial style.
    </p>

  </div>

          </div>

        </div>

        {/* CONTACT */}
        <div className="mt-24 text-center">

          <h2 className="text-xs uppercase tracking-[0.35em] text-white/60 mb-6">
            Contact
          </h2>

          <p className="text-white/80">
            terry@terryrichardsonphotography.au
          </p>

          <p className="text-white/80 mt-2">
            0424 578 110
          </p>

        </div>

        {/* GEAR */}
        <div className="mt-20 text-center">

          <h2 className="text-xs uppercase tracking-[0.35em] text-white/60 mb-6">
            Camera Gear
          </h2>

          <div className="text-white/70 space-y-2">

            <p>Canon R5 Mark II</p>

            <p>RF 15–35mm</p>
            <p>RF 24–70mm</p>
            <p>RF 70–200mm</p>

            <p className="text-white/50 mt-4">
              Editing: Lightroom / Photolab
            </p>

          </div>

        </div>

      </div>

    </main>
  );
}