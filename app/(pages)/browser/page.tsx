"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useInfiniteQuery } from "@tanstack/react-query";
import { Search, Info } from 'lucide-react';
import { queryWorks } from '@/app/api/search/index'
import StoryCard from '@/components/shared/storycard/StoryCard';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import InstructionsDialog from '@/components/shared/storycard/InstructionsDialog';
import { Suspense } from 'react'
import { Work } from '@/app/api/types';
import ScrollToTopButton from '@/components/shared/ScrollToTopButton';

function BrowserContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialKeyword = searchParams.get('keyword') || '';
  const [keyword, setKeyword] = useState<string>(initialKeyword);
  const currentKeyword = searchParams.get('keyword') || '';
  const [isInstructionsDialogOpen, setIsInstructionsDialogOpen] = useState<boolean>(false);

  const loaderRef = useRef<HTMLDivElement>(null);

  // Use the query with proper error handling
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error, refetch } = useInfiniteQuery({
    queryKey: ['stories', currentKeyword],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const result = await queryWorks(pageParam, 10, currentKeyword);
        console.log('Query result for page', pageParam, ':', result);
        const nextPage = result.data.works && result.data.works.length === 10 ? pageParam + 1 : undefined;
        return { data: result.data, nextPage };
      } catch (err) {
        console.error('Error in query function:', err);
        throw err;
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: true,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 1000 * 60 * 5,
    initialPageParam: 1
  });

  // Intersection observer callback
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries
    if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: '0px 0px 20% 0px',
      threshold: 0.1,
    })

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current)
      }
    }
  }, [handleObserver, loaderRef])

  useEffect(() => {
    // Debounce the keyword change to prevent excessive re-renders
    const handler = setTimeout(() => {
      const trimmedInput = keyword.trim()

      const newTargetHref = trimmedInput ?
        `/browser?keyword=${encodeURIComponent(trimmedInput)}` :
        '/browser'

      const currentHref = currentKeyword
        ? `/browser?keyword=${encodeURIComponent(currentKeyword)}`
        : '/browser';

      if (newTargetHref !== currentHref) {
        router.push(newTargetHref)
      }
    }, 1000)

    return () => clearTimeout(handler)
  }, [keyword, currentKeyword, router])

  // Update URL when keyword changes and trigger search
  const handleSearch = () => {
    const trimmedKeyword = keyword.trim()

    const targetHref = trimmedKeyword
      ? `/browser?keyword=${encodeURIComponent(trimmedKeyword)}`
      : '/browser'

    const currentHref = currentKeyword
      ? `/browser?keyword=${encodeURIComponent(currentKeyword)}`
      : '/browser'

    if (targetHref !== currentHref) {
      router.push(targetHref)
    } else {
      refetch()
    }
  };

  const allWorks = data?.pages.flatMap(page => page.data.works || []) || []

  return (
    <div className="h-full py-8 px-4">
      {/* Search Section */}
      <div className="max-w-2xl mx-auto mb-8 w-full">
        <h1 className="text-3xl font-bold text-purple-100 mb-6 text-center">
          <span>Browser Stories</span>
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild aria-label='info instructions button'>
                <Info className="w-4 h-4 inline-block ml-3 hover:text-purple-300 cursor-pointer"
                  onClick={() => setIsInstructionsDialogOpen(true)}
                />
              </TooltipTrigger>
              <TooltipContent side="right" className='bg-purple-950/70 text-purple-100'>
                <p>Click to check the instructions of the Story Card</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h1>
        <div className="relative">
          <input
            type="text"
            className="block w-full p-4 pl-5 pr-12 text-sm text-purple-100 bg-purple-950/50 
                     rounded-lg border border-purple-300/20 focus:ring-2 focus:ring-purple-500 
                     focus:border-purple-500 placeholder-purple-400/50"
            placeholder="Search for stories..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
          />
          <Button
            onClick={handleSearch}
            disabled={isLoading}
            variant="ghost"
            size="icon"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 text-purple-400 
                     rounded-lg hover:bg-purple-800/50 focus:ring-2 focus:ring-purple-500 
                     disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Search className="w-5 h-5" />
          </Button>
        </div>

        <InstructionsDialog open={isInstructionsDialogOpen} onOpenChange={setIsInstructionsDialogOpen} />
      </div>

      {/* Results Section */}
      <div className="max-w-6xl mx-auto w-full">
        {isLoading && (
          <div className="text-center text-purple-200">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
            <p>Searching stories...</p>
          </div>
        )}

        {error && (
          <div className="text-center text-red-400 bg-red-900/20 rounded-lg p-4">
            <p>Error: {error instanceof Error ? error.message : 'An error occurred while searching.'}</p>
          </div>
        )}

        {!isLoading && !error && allWorks && allWorks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
            {allWorks.map((story: Work) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        ) : !isLoading && !error && allWorks && allWorks.length === 0 && currentKeyword ? (
          <div className="text-center text-purple-200 bg-purple-900/20 rounded-lg p-8">
            <p>No stories found for &ldquo;{currentKeyword}&rdquo;</p>
          </div>
        ) : null}

        {/* Loader element that will trigger next page fetch */}
        <div ref={loaderRef} className="h-10 w-full">
          {isFetchingNextPage && (
            <div className="text-center text-purple-200 py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto mb-1"></div>
              <p className="text-sm">Loading more stories...</p>
            </div>
          )}
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
}

export default function Browser() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrowserContent />
    </Suspense>
  );
}