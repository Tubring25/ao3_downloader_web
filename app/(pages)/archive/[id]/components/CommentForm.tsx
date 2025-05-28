import React from 'react';
import { createComment } from '@/app/api/comments';
import { useQueryClient } from '@tanstack/react-query';

interface CommentFormProps {
  workId: number;
}

export const CommentForm: React.FC<CommentFormProps> = ({ workId }) => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [authorName, setAuthorName] = React.useState('');
  const [content, setContent] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    if (!authorName.trim()) {
      setError('Name cannot be empty');
      return;
    }

    setIsSubmitting(true);

    try {
      await createComment({
        workId,
        content: content.trim(),
        authorName: authorName.trim() || 'Anonymous',
      });

      // Clear form
      setContent('');

      // Invalidate and refetch the comments
      queryClient.invalidateQueries({ queryKey: ['comments', workId] });
    } catch (error) {
      console.error('Error creating comment:', error);
      setError('Failed to post comment. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-8 border border-gray-700 rounded-md p-4 bg-gray-900">
      <h3 className="text-xl font-semibold mb-4 text-purple-300">Add a Comment</h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="authorName" className="block text-sm font-medium text-gray-300 mb-1">
            Your Name
          </label>
          <input
            type="text"
            id="authorName"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Anonymous"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">
            Comment
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            placeholder="Write your comment here..."
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
          />
        </div>

        {error && (
          <div className="mb-4 text-red-400 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
    </div>
  );
} 