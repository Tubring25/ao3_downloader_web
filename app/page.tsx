import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[url('/images/home_bg.jpeg')] bg-cover bg-center bg-no-repeat text-zinc-100">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-black/30 to-transparent backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo_kiramman.png"
              alt="AO3 Downloader Logo"
              width={24}
              height={24}
              className="dark:invert"
            />
            <span className="text-xl font-bold">Caitvi Archive</span>
          </div>
          <nav className="flex gap-6">
            <a href="#search" className="text-lg font-bold hover:text-violet-300 transition-colors">
              Search
            </a>
            <a href="#contact" className="text-lg font-bold hover:text-violet-300 transition-colors">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center space-y-8 backdrop-blur-sm bg-black/30 p-8 rounded-2xl">
          <h1 className="text-4xl sm:text-5xl font-bold text-violet-300">
            Caitvi Fanfiction Archive
          </h1>
          <p className="text-xl text-zinc-200">
            Your gateway to the finest Caitlyn & Vi stories from Archive of Our Own
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Enter AO3 story URL or search terms"
              className="flex-1 px-4 py-3 rounded-lg bg-zinc-900/50 border border-violet-500/30 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 text-zinc-100 placeholder-zinc-400"
            />
            <button className="px-6 py-3 bg-violet-600 hover:bg-violet-700 rounded-lg font-semibold transition-colors">
              Search
            </button>
          </div>
          <p className="text-sm text-zinc-400">
            Powered by AO3 • Download and read your favorite Caitvi stories offline
          </p>
        </div>
      </main>
    </div>
  );
}
