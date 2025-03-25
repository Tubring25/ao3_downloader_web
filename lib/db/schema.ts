import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core'

export const works = sqliteTable('works', {
  id: integer('id').primaryKey(),
  title: text('title').notNull(),
  author: text('author').notNull(),
  chapters: integer('chapters').notNull(),
  kudos: integer('kudos').notNull(),
  comments: integer('comments').notNull(),
  words: integer('words').notNull(),
  language: text('language').notNull(),
  summary: text('summary'),
  rating: text('rating').notNull(),
});

export const tags = sqliteTable('tags', {
  id: integer('id').primaryKey(),
  name: text('name').notNull()
})

export const characters = sqliteTable('characters', {
  id: integer('id').primaryKey(),
  name: text('name').notNull()
})

export const fandoms = sqliteTable('fandoms', {
  id: integer('id').primaryKey(),
  name: text('name').notNull()
})

export const relationships = sqliteTable('relationships', {
  id: integer('id').primaryKey(),
  name: text('name').notNull()
})

export const warnings = sqliteTable('warnings', {
  id: integer('id').primaryKey(),
  name: text('name').notNull()
})

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey(),
  name: text('name').notNull()
})

export const ratings = sqliteTable('ratings', {
  id: integer('id').primaryKey(),
  name: text('name').notNull()
})

export const workTags = sqliteTable('work_tags', {
  workId: integer('work_id').notNull().references(() => works.id),
  tagId: integer('tag_id').notNull().references(() => tags.id),
}, (table) => [
  primaryKey({ columns: [table.workId, table.tagId] })
]);

export const workCharacters = sqliteTable('work_characters', {
  workId: integer('work_id').notNull().references(() => works.id),
  characterId: integer('character_id').notNull().references(() => characters.id),
}, (table) => [
  primaryKey({ columns: [table.workId, table.characterId] })
]);

export const workFandoms = sqliteTable('work_fandoms', {
  workId: integer('work_id').notNull().references(() => works.id),
  fandomId: integer('fandom_id').notNull().references(() => fandoms.id),
}, (table) => [
  primaryKey({ columns: [table.workId, table.fandomId] })
]);

export const workRelationships = sqliteTable('work_relationships', {
  workId: integer('work_id').notNull().references(() => works.id),
  relationshipId: integer('relationship_id').notNull().references(() => relationships.id),
}, (table) => [
  primaryKey({ columns: [table.workId, table.relationshipId] })
]);

export const workWarnings = sqliteTable('work_warnings', {
  workId: integer('work_id').notNull().references(() => works.id),
  warningId: integer('warning_id').notNull().references(() => warnings.id),
}, (table) => [
  primaryKey({ columns: [table.workId, table.warningId] })
]);

export const workCategories = sqliteTable('work_categories', {
  workId: integer('work_id').notNull().references(() => works.id),
  categoryId: integer('category_id').notNull().references(() => categories.id),
}, (table) => [
  primaryKey({ columns: [table.workId, table.categoryId] })
]);

export const workRatings = sqliteTable('work_ratings', {
  workId: integer('work_id').notNull().references(() => works.id),
  ratingId: integer('rating_id').notNull().references(() => ratings.id),
}, (table) => [
  primaryKey({ columns: [table.workId, table.ratingId] })
]);