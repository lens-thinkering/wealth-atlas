export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-8 px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-neon-blue text-xs tracking-widest uppercase">
          &gt; Loading Atlas_v0.1...
        </p>
        <h1 className="text-neon-green text-2xl leading-loose">
          THE WEALTH ATLAS
        </h1>
        <p className="text-neon-green/60 text-xs leading-loose max-w-xs">
          How much does it cost to be wealthy — everywhere on Earth?
        </p>
      </div>

      <div className="border border-neon-green/30 px-8 py-6 text-center">
        <p className="text-neon-green/50 text-xs leading-loose">
          [ GLOBE INITIALIZING ]
        </p>
      </div>

      <p className="text-neon-green/30 text-xs">
        &gt; Select a location to begin_
      </p>
    </main>
  );
}
