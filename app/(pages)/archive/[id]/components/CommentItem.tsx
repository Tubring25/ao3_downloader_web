'use client'
import { WorkComment } from '@/app/api/types'
import { useQueryClient } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react'
import { formatDistanceToNow } from 'date-fns';
import { voteComment } from '@/app/api/comments';

interface CommentItemProps {
  comment: WorkComment;
  workId: number;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment, workId }) => {
  const queryClient = useQueryClient()

  const [isVoting, setIsVoting] = useState(false)

  // Format the date
  const formattedDate = useMemo(() => {
    if (!comment.createdAt) return ''

    // Convert to local time
    const date = typeof comment.createdAt === 'string' ?
      new Date(comment.createdAt)
      :
      comment.createdAt

    return formatDistanceToNow(date, { addSuffix: true })
  }, [comment.createdAt])

  // Handle vote
  const handleVote = async (voteType: number) => {
    if (isVoting || comment.voteStatus === voteType) return

    // FIXME: Saving vote type and ids
    const existingVote = JSON.parse(localStorage.getItem(`ao3_comment_votes`) || '[]')
    if (existingVote.includes(comment.id)) {
      return
    }

    setIsVoting(true)

    try {
      const result = await voteComment({
        commentId: comment.id,
        workId,
        voteType
      })

      console.log("result", result)
      if (result.ok) {
        queryClient.invalidateQueries({ queryKey: ['comments', workId] })
        localStorage.setItem(`ao3_comment_votes`, JSON.stringify([...existingVote, comment.id]))
      }
    } catch (error) {
      console.error('Error voting on comment:', error)
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <div className="border border-gray-700 rounded-md p-4 mb-4 bg-gray-900">
      <div className="flex justify-between mb-2">
        <span className="font-semibold text-sm text-purple-300">{comment.authorName}</span>
        <span className="text-xs text-gray-400">{formattedDate}</span>
      </div>

      <div className="my-2 text-gray-200 break-words">
        {comment.content}
      </div>

      <div className="flex justify-between items-center mt-3">
        <div className="flex items-center gap-4">
          {/* Upvote button */}
          <button
            onClick={() => handleVote(1)}
            disabled={isVoting || comment.voteStatus === 1}
            className={`flex items-center text-sm ${comment.voteStatus === 1
              ? 'text-green-400'
              : 'text-gray-400 hover:text-green-400'
              }`}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            <span>{comment.upvotes || 0}</span>
          </button>

          {/* Downvote button */}
          <button
            onClick={() => handleVote(-1)}
            disabled={isVoting || comment.voteStatus === -1}
            className={`flex items-center text-sm ${comment.voteStatus === -1
              ? 'text-red-400'
              : 'text-gray-400 hover:text-red-400'
              }`}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span>{comment.downvotes || 0}</span>
          </button>
        </div>
      </div>
    </div>
  )
}