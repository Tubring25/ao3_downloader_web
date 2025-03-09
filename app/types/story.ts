export type Story = {
  id: string;
  title: string;
  author: string;
  chapters: number;
  kudos: number;
  comments: number;
  words: number;
  language: string;
  summary: string;
  tags: string[];
  characters: string[];
  relationships: string[];
  fandoms: string[];
  rating: Rating;
  warnings: string[];
  categories: string[];
}

export type Rating = 'General Audiences' | 'Teen And Up Audiences' | 'Mature' | 'Explicit' | 'Not Rated';

export type Warning = 
  'Creator Chose Not To Use Archive Warnings' | 
  'Graphic Depictions Of Violence' | 
  'Major Character Death' | 
  'Rape/Non-Con' | 
  'Underage Sex' | 
  'No Archive Warnings Apply';