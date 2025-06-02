import { Env } from "@/lib/utils";
import { ICreateCommentRequest, IGetCommentsQuery, IGetCommentsResponse, IVoteCommentRequest, workComment } from "../types";
import { getDb } from "@/lib/db";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { workComments } from "@/lib/db/schema";


/**
 * Get comments for a specific work
 */
export async function getWorkComments(env: Env, params: IGetCommentsQuery): Promise<IGetCommentsResponse> {

  const db = getDb(env)
  const { workId, page = 1, pageSize = 10, sortBy = 'createdAt', sortOrder = 'desc' } = params

  const offset = (page - 1) * pageSize

  // Query to get total count
  const totalCount = await db
    .select({ count: sql`count(*)`.as('count') })
    .from(workComments)
    .where(and(
      eq(workComments.workId, workId),
      eq(workComments.isHidden, 0)
    ))
    .execute()

  const total = totalCount[0]?.count || 0

  // Determine sort column and direction
  const sortColumn = sortBy === 'upvotes' ? workComments.upvotes : workComments.createdAt
  const orderDirection = sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn)

  // Query to get paginated comments
  const comments = await db
    .select()
    .from(workComments)
    .where(and(
      eq(workComments.workId, workId),
      eq(workComments.isHidden, 0)
    ))
    .orderBy(orderDirection)
    .limit(pageSize)
    .offset(offset)
    .execute()

  return {
    comments,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize)
    }
  }
}

/**
 * Create a new comment
 */
export async function createComment(env: Env, data: ICreateCommentRequest): Promise<workComment> {

  const db = getDb(env)
  const result = await db.insert(workComments).values({
    workId: data.workId,
    content: data.content,
    authorName: data.authorName,
    upvotes: 0,
    downvotes: 0,
    isHidden: 0,
    createdAt: new Date(),
  }).returning()

  return result[0]
}

/**
 * Vote on a comment
 */
export async function voteComment(env: Env, data: IVoteCommentRequest): Promise<{ success: boolean; message: string }> {

  const db = getDb(env)
  const { commentId, newVoteType, prevVoteType, workId } = data

  const commentResult = await db
    .select()
    .from(workComments)
    .where(and(
      eq(workComments.id, commentId),
      eq(workComments.workId, workId)
    ))
    .execute()

  if (!commentResult || commentResult.length === 0) {
    return { success: false, message: 'Comment not found' };
  }
  const currentComment = commentResult[0];

  let finalUpvotes = currentComment.upvotes;
  let finalDownvotes = currentComment.downvotes;

  if (prevVoteType === 1) {
    finalUpvotes--;
  } else if (prevVoteType === -1) {
    finalDownvotes--;
  }

  if (newVoteType === 1) {
    finalUpvotes++;
  } else if (newVoteType === -1) {
    finalDownvotes++;
  }

  const updateData: Partial<Pick<workComment, 'upvotes' | 'downvotes' | 'isHidden'>> = {
    upvotes: Math.max(0, finalUpvotes),
    downvotes: Math.max(0, finalDownvotes),
  }

  if (updateData.downvotes !== undefined) {
    if (updateData.downvotes >= 10 && currentComment.isHidden === 0) {
      updateData.isHidden = 1;
    } else if (updateData.downvotes < 10 && currentComment.isHidden === 1) {
      updateData.isHidden = 0;
    }
  }

  await db
    .update(workComments)
    .set(updateData)
    .where(eq(workComments.id, commentId))
    .execute();

  return { success: true, message: 'Vote updated successfully' }
}
