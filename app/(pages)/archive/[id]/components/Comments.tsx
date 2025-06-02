"use client"
import { getWorkComments } from "@/app/api/comments"
import { useQuery } from "@tanstack/react-query"
import { CommentItem } from "./CommentItem"
import { CommentForm } from "./CommentForm"
import { useState } from "react"

interface CommentsProps {
  workId: number;
}

export const Comments: React.FC<CommentsProps> = ({ workId }) => {

  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<'createdAt' | 'upvotes'>('upvotes')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const { data, isLoading, error } = useQuery({
    queryKey: ['comments', workId, page, sortBy, sortOrder],
    queryFn: () => getWorkComments(workId, page, 10, sortBy, sortOrder),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })

  const handleSortChange = (value: string) => {
    switch (value) {
      case 'newest':
        setSortBy('createdAt')
        setSortOrder('desc')
        break
      case 'oldest':
        setSortBy('createdAt')
        setSortOrder('asc')
        break
      case 'popular':
        setSortBy('upvotes')
        setSortOrder('desc')
        break
    }
    setPage(1) // Reset to first page when sorting changes
  }

  console.log(data?.comments)

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6 text-purple-200">Comments</h2>

      {/* Comment form */}
      <CommentForm workId={workId} />

      {/* Comment sorting */}
      {data?.comments && data.comments.length > 0 && (
        <div className="flex justify-between items-center mb-6">
          <span className="text-purple-200">
            {data.pagination.total} {data.pagination.total === 1 ? 'Comment' : 'Comments'}
          </span>

          <div className="flex items-center">
            <label htmlFor="sort" className="mr-2 text-sm text-purple-300/70">
              Sort by:
            </label>
            <select
              id="sort"
              value={
                sortBy === 'createdAt'
                  ? (sortOrder === 'desc' ? 'newest' : 'oldest')
                  : 'popular'
              }
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-purple-900/50 border border-purple-500/30 rounded-md text-purple-100 text-sm p-1 focus:border-purple-400 focus:outline-none"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="popular">Most Upvoted</option>
            </select>
          </div>
        </div>
      )}

      {/* Comments list */}
      <div>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <svg className="animate-spin h-8 w-8 text-purple-400" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : error ? (
          <div className="text-red-400 py-4">
            Failed to load comments. Please try again.
          </div>
        ) : data?.comments && data.comments.length > 0 ? (
          <>
            {data.comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} workId={workId} />
            ))}

            {/* Pagination */}
            {data.pagination.totalPages > 1 && (
              <div className="flex justify-center mt-6 space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 bg-purple-900/50 border border-purple-500/30 rounded-md text-purple-100 disabled:opacity-50 hover:bg-purple-800/50 transition-colors"
                >
                  Previous
                </button>

                <span className="px-3 py-1 bg-purple-700/50 border border-purple-400/30 rounded-md text-purple-100">
                  {page} of {data.pagination.totalPages}
                </span>

                <button
                  onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                  disabled={page === data.pagination.totalPages}
                  className="px-3 py-1 bg-purple-900/50 border border-purple-500/30 rounded-md text-purple-100 disabled:opacity-50 hover:bg-purple-800/50 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-purple-300/70 py-8 text-center">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </div>
  )
}