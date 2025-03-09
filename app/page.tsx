"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./components/ui/button";
import { Search, Loader2 } from "lucide-react";

export default function Home() {
  const [keyword, setKeyword] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const router = useRouter();
  
  const onSearch = () => {
    if (keyword.trim()) {
      setIsSearching(true);
      // Add a small delay to show the searching state
      setTimeout(() => {
        router.push(`/browser?keyword=${encodeURIComponent(keyword.trim())}`);
      }, 300);
    }
  }

  return (
    <div className="flex items-center justify-center h-full py-8 px-6">
      <div className="text-center w-full max-w-4xl mx-auto">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="space-y-6">
            <h1 className="text-6xl sm:text-7xl font-bold">
              <span className="bg-gradient-to-r from-purple-400 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                Caitvi Stories
              </span>
            </h1>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto">
              Discover and download your favorite stories from Archive of Our Own
            </p>
          </div>

          {/* Search Section */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                className="block w-full p-4 pl-5 pr-12 text-sm text-purple-100 bg-purple-950/50 
                         rounded-lg border border-purple-300/20 focus:ring-2 focus:ring-purple-500 
                         focus:border-purple-500 placeholder-purple-400/50"
                placeholder="Search by author name..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') onSearch(); }}
                disabled={isSearching}
              />
              <Button
                onClick={onSearch}
                disabled={isSearching}
                variant="ghost"
                size="icon"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 text-purple-400 
                         rounded-lg hover:bg-purple-800/50 focus:ring-2 focus:ring-purple-500 
                         disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isSearching ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-purple-950/30 p-6 rounded-lg border border-purple-300/10 hover:border-purple-300/30 transition-all duration-300">
              <h3 className="text-xl font-semibold text-purple-100 mb-2">Search</h3>
              <p className="text-purple-200/70">Find stories by your favorite authors</p>
            </div>
            <div className="bg-purple-950/30 p-6 rounded-lg border border-purple-300/10 hover:border-purple-300/30 transition-all duration-300">
              <h3 className="text-xl font-semibold text-purple-100 mb-2">Browse</h3>
              <p className="text-purple-200/70">Explore stories with our intuitive interface</p>
            </div>
            <div className="bg-purple-950/30 p-6 rounded-lg border border-purple-300/10 hover:border-purple-300/30 transition-all duration-300">
              <h3 className="text-xl font-semibold text-purple-100 mb-2">Download</h3>
              <p className="text-purple-200/70">Save stories for offline reading</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
