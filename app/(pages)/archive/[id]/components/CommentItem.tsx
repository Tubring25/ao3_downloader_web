'use client'
import { WorkComment } from '@/app/api/types'
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useMemo, useState } from 'react'
import { formatDistanceToNow } from 'date-fns';
import { voteComment } from '@/app/api/comments';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface CommentItemProps {
  comment: WorkComment;
  workId: number;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment, workId }) => {
  const queryClient = useQueryClient()

  const [isVoting, setIsVoting] = useState(false)
  const [votedList, setVotedList] = useState<Record<string, number | undefined>>({});

  const localStorageKey = 'ao3_comment_votes';
  const commentVoteKey = `${workId}_${comment.id}`;

  useEffect(() => {
    const storedVotes = JSON.parse(localStorage.getItem(localStorageKey) || '{}');
    setVotedList(storedVotes);
  }, [])

  const currentVoteStatus = votedList[commentVoteKey];

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
  const handleVote = async (clickedVoteType: number) => {
    if (isVoting) return;
    setIsVoting(true);

    let newVoteTypeForApi: number;
    const previousVoteTypeForApi: number | undefined = currentVoteStatus;

    if (currentVoteStatus === clickedVoteType) {
      // Case 1.1: Clicking the same button again -> Unvote
      newVoteTypeForApi = 0; // 0 signifies unvoting to the backend
    } else {
      // Case 1.2 (if currentVoteStatus is defined) or Case 2 (currentVoteStatus is undefined): New vote or change vote
      newVoteTypeForApi = clickedVoteType;
    }

    try {
      const result = await voteComment({
        commentId: comment.id,
        workId,
        newVoteType: newVoteTypeForApi,
        prevVoteType: previousVoteTypeForApi
      })

      console.log("result", result)
      if (result.ok) {
        queryClient.invalidateQueries({ queryKey: ['comments', workId] })
        const updatedVotes = { ...votedList };
        if (newVoteTypeForApi === 0) {
          delete updatedVotes[commentVoteKey];
        } else {
          updatedVotes[commentVoteKey] = newVoteTypeForApi;
        }
        localStorage.setItem(localStorageKey, JSON.stringify(updatedVotes));
        setVotedList(updatedVotes);
      } else {
        console.error('Failed to vote:', result.message);
      }
    } catch (error) {
      console.error('Error voting on comment:', error)
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <div className="border border-purple-500/30 rounded-lg p-4 mb-4 bg-gradient-to-br from-purple-900/40 to-pink-900/30 backdrop-blur-sm shadow-lg">
      <div className="flex justify-between mb-2">
        <span className="font-semibold text-sm text-purple-200">{comment.authorName}</span>
        <span className="text-xs text-purple-300/70">{formattedDate}</span>
      </div>

      <div className="my-2 text-purple-100 break-words">
        {comment.content}
      </div>

      <div className="flex justify-between items-center mt-3">
        <div className="flex items-center gap-2">
          {/* Upvote button */}
          <button
            onClick={() => handleVote(1)}
            disabled={isVoting || comment.voteStatus === 1}
            className={`flex min-w-10 items-center text-sm transition-colors duration-200 ${currentVoteStatus === 1
              ? 'text-green-400'
              : 'text-purple-300/70 hover:text-green-400'
              }`}
          >
            <ThumbsUp className="w-4 h-4 mr-1" />
            <span>{comment.upvotes || 0}</span>
          </button>

          {/* Downvote button */}
          <button
            onClick={() => handleVote(-1)}
            disabled={isVoting || comment.voteStatus === -1}
            className={`flex min-w-10 items-center text-sm transition-colors duration-200 ${currentVoteStatus === -1
              ? 'text-red-400'
              : 'text-purple-300/70 hover:text-red-400'
              }`}
          >
            <ThumbsDown className="w-4 h-4 mr-1" />
            <span>{comment.downvotes || 0}</span>
          </button>
        </div>
      </div>
    </div>
  )
}