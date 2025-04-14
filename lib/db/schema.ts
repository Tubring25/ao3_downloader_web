import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm';

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

// Relations 
export const worksRelations = relations(works, ({ many }) => ({
  tags: many(workTags),
  characters: many(workCharacters),
  fandoms: many(workFandoms),
  relationships: many(workRelationships),
  warnings: many(workWarnings),
  categories: many(workCategories),
  ratings: many(workRatings),
}));
export const tagsRelations = relations(tags, ({ many }) => ({
  works: many(workTags),
}));
export const charactersRelations = relations(characters, ({ many }) => ({
  works: many(workCharacters),
}));
export const fandomsRelations = relations(fandoms, ({ many }) => ({
  works: many(workFandoms),
}));
export const relationshipsRelations = relations(relationships, ({ many }) => ({
  works: many(workRelationships),
}));
export const warningsRelations = relations(warnings, ({ many }) => ({
  works: many(workWarnings),
}));
export const categoriesRelations = relations(categories, ({ many }) => ({
  works: many(workCategories),
}));
export const ratingsRelations = relations(ratings, ({ many }) => ({
  works: many(workRatings),
}));

export const workTagsRelations = relations(workTags, ({ one }) => ({
  work: one(works, {
    fields: [workTags.workId],
    references: [works.id],
  }),
  tag: one(tags, {
    fields: [workTags.tagId],
    references: [tags.id],
  }),
}));
export const workCharactersRelations = relations(workCharacters, ({ one }) => ({
  work: one(works, {
    fields: [workCharacters.workId],
    references: [works.id],
  }),
  character: one(characters, {
    fields: [workCharacters.characterId],
    references: [characters.id],
  }),
}));
export const workFandomsRelations = relations(workFandoms, ({ one }) => ({
  work: one(works, {
    fields: [workFandoms.workId],
    references: [works.id],
  }),
  fandom: one(fandoms, {
    fields: [workFandoms.fandomId],
    references: [fandoms.id],
  }),
}));

export const workRelationshipsRelations = relations(workRelationships, ({ one }) => ({
  work: one(works, {
    fields: [workRelationships.workId],
    references: [works.id],
  }),
  relationship: one(relationships, {
    fields: [workRelationships.relationshipId],
    references: [relationships.id],
  }),
}));

export const workWarningsRelations = relations(workWarnings, ({ one }) => ({
  work: one(works, {
    fields: [workWarnings.workId],
    references: [works.id],
  }),
  warning: one(warnings, {
    fields: [workWarnings.warningId],
    references: [warnings.id],
  }),
}));

export const workCategoriesRelations = relations(workCategories, ({ one }) => ({
  work: one(works, {
    fields: [workCategories.workId],
    references: [works.id],
  }),
  category: one(categories, {
    fields: [workCategories.categoryId],
    references: [categories.id],
  }),
}));

export const workRatingsRelations = relations(workRatings, ({ one }) => ({
  work: one(works, {
    fields: [workRatings.workId],
    references: [works.id],
  }),
  rating: one(ratings, {
    fields: [workRatings.ratingId],
    references: [ratings.id],
  }),
}));