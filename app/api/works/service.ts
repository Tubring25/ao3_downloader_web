import { getDb } from "@/lib/db";
import { works } from "@/lib/db/schema";
import { and, desc, eq, innerProduct, like, count } from "drizzle-orm";
import { IGetWorksResponse, SearchQueryParams, Work } from "../types";
import { buildWhereConditions } from "./utils";
import { formatResponse } from "../utils";

/**
 * Fetches works based on search parameters.
 * @param {any} env - The environment variable.
 * @param {SearchQueryParams} params - The search parameters.
 * 
 * @returns {Promise<IGetWorksResponse>} - A promise that resolves to the works data and pagination info.
 */
export const getWorksList = async (env: any, params: SearchQueryParams): Promise<IGetWorksResponse> => {
    const { page, pageSize, sortBy, sortOrder } = params;
    const offset = (parseInt(page) - 1) * parseInt(pageSize);

    const db = getDb(env);
    const whereConditions = buildWhereConditions(params);

    const sortColumn = works[sortBy];
    const sortFunction = sortOrder === 'asc' ? sortColumn : desc(sortColumn);

    const works_data = await db.select().from(works)
        .where(whereConditions)
        .orderBy(sortFunction)
        .limit(parseInt(pageSize))
        .offset(offset);
    
        const [{count: total}] = await db.select({ count: count() }).from(works).where(whereConditions);

    const totalPages = Math.ceil(total / parseInt(pageSize))

    return {
        works: works_data,
        pagination: {
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            total,
            totalPages
        }
    }
}

/**
 * Fetches a single work based on ID.
 * @param {any} env - The environment variable.
 * @param {number} id - The ID of the work.
 * 
 * @returns {Promise<Work | null>} - A promise that resolves to the work data or null if not found.
 */

export const getWorkById = async (env: any, id: number): Promise<Work | null> => {
    const db = getDb(env);
    const work = await db.select().from(works).where(eq(works.id, id)).get();

    return work ?? null;
}