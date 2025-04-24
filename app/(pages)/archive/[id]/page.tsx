'use client';
import { useRouter } from 'next/navigation';
import { Work } from '@/app/api/types';
import { useQuery } from '@tanstack/react-query';
import { queryWorkById } from '@/app/api/search';
import React from 'react';
import WorkInfo from './components/WorkInfo';

export default function WorkDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);
  console.log("Work ID:", id);

  const { data, isLoading, error } = useQuery({
    queryKey: ['work', id],
    queryFn: async () => {
      try {
        const result = await queryWorkById(parseInt(id));
        console.log('Query result:', result);
        return result.data || {};
      } catch (err) {
        console.error('Error in query function:', err);
        throw err;
      }
    }
  })

  const work: Work = data || {};

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <svg className="animate-spin h-10 w-10 text-purple-500" viewBox="3 3 18 18">
          <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v2a6 6 0 100 12v2a8 8 0 01-8-8z" />
        </svg>
      </div>
    )
  }

  return (
    <>
      <main className="container mx-auto p-4 md:p-6">
        {/* Back button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-purple-300 hover:text-white"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to results
          </button>
        </div>

        {/* Work header */}
        <WorkInfo work={work} />

        {/* Action buttons */}


        {/* Comments section */}

      </main>
    </>
  );
};