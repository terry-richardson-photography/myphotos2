export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-24 py-10 text-center text-white/60 text-sm">

      <div className="max-w-6xl mx-auto px-6">

        <p className="font-serif text-white/80 mb-2">
          Terry Richardson Photography
        </p>

        <p className="tracking-wide">
          © {new Date().getFullYear()} Terry Richardson
        </p>

        <div className="mt-4 space-x-4">

          <a
            href="mailto:terry@terryrichardsonphotography.au"
            className="hover:text-white transition"
          >
            terry@terryrichardsonphotography.au
          </a>

          <span className="text-white/30">•</span>

          <a
            href="tel:0424578110"
            className="hover:text-white transition"
          >
            0424 578 110
          </a>

        </div>

      </div>

    </footer>
  );
}