import { works } from "@/lib/db/schema"
import { and, eq, like, or } from "drizzle-orm"
import { z } from "zod"
import { SearchQueryParams } from "../types"

export const buildWhereConditions = (params: SearchQueryParams) => {
  const conditions = []
  if (params.title) conditions.push(like(works.title, `%${params.title}%`))
  if (params.author) conditions.push(like(works.author, `%${params.author}%`))
  if (params.isSingleCharacter) conditions.push(eq(works.chapters, 1))
  if (params.rating) conditions.push(eq(works.rating, params.rating))
  if (params.keyword) conditions.push(or(like(works.title, `%${params.keyword}%`), like(works.summary, `%${params.keyword}%`)))

  return conditions.length > 0 ? and(...conditions) : undefined
}