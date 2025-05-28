import api from "../apiService";
import { ICreateCommentRequest, IGetCommentsResponse, IVoteCommentRequest, WorkComment } from "../types";


/**
 * Get comments for a work
 * @param workId - The ID of the work to get comments for
 * @param page - The page number to get
 * @param pageSize - The number of comments per page
 * @param sortBy - The field to sort by
 * @param sortOrder - The order to sort by
 * @returns The comments for the work
 */
export const getWorkComments = async (
  workId: number,
  page: number,
  pageSize: number,
  sortBy: string = 'createdAt',
  sortOrder: string = 'desc'
): Promise<IGetCommentsResponse> => {
  try {
    const response = await api.get(`/comments/works/${workId}`, {
      params: {
        page,
        pageSize,
        sortBy,
        sortOrder
      }
    })
    return response.data.data
  } catch (error) {
    console.error('Error in getWorkComments:', error)
    throw error
  }
}

/**
 * Create a new comment
 */
export const createComment = async (
  comment: ICreateCommentRequest
): Promise<WorkComment> => {
  try {
    const response = await api.post('/comments', comment)
    return response.data
  } catch (error) {
    console.error('Error in createComment:', error)
    throw error
  }
}

/**
 * Vote on a comment
 */
export const voteComment = async (
  vote: IVoteCommentRequest
): Promise<{ ok: boolean, message: string }> => {
  try {
    const response = await api.post('/comments/vote', vote)
    return response.data
  } catch (error) {
    console.error('Error in voteComment:', error)
    throw error
  }
}
