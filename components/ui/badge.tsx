import { Rating, Warning } from '@/app/api/types';
import React from 'react';

interface BadgeProps {
  text: string;
  color?: string;
  className?: string;
}

export function Badge({ 
  text, 
  color = "bg-purple-700",
}: BadgeProps) {
  return (
    <span 
      className={`${color} px-2 py-1 rounded text-xs font-medium mr-1 my-1 inline-block`}
    >
      {text}
    </span>
  );
}

export const ratingColors: Record<Rating, string> = {
  "Explicit": "bg-red-500",
  "Mature": "bg-orange-500",
  "Teen And Up Audiences": "bg-yellow-500",
  "General Audiences": "bg-green-500",
  "Not Rated": "bg-gray-500"
};

export const warningColors: Record<Warning, string> = {
  "Creator Chose Not To Use Archive Warnings": "bg-gray-400/50",
  "Graphic Depictions Of Violence": "bg-orange-400/50",
  "Major Character Death": "bg-red-500/50",
  "Rape/Non-Con": "bg-red-400/50",
  "Underage Sex": "bg-yellow-400/50",
  "No Archive Warnings Apply": "bg-green-400/50",
}


export function RatingBadge({ rating }: { rating: Rating }) {
  const color = ratingColors[rating] || "bg-gray-500";
  return <Badge text={rating.substring(0,1).toLocaleUpperCase()} color={color} />;
}

export function CompleteBadge({isComplete}: {isComplete: boolean}) {
    const color = isComplete ? "bg-green-500" : "bg-blue-500";
    return <Badge text={isComplete ? "Complete" : "Working on Progress"} color={color} />;
}

export function WarningBadge({ warning }: { warning: Warning }) {
  const color = warningColors[warning] || "bg-gray-500";
  return <Badge text={warning} color={color} />;
}

export default Badge;
