import { Rating } from "@/app/types/story";
import { cn } from "@/lib/utils";

export default function RatingIcon({ rating, isLight=true }: { rating: Rating, isLight?: boolean }) {

  const getRatingColor = (rating: Rating): string => {
    switch (rating) {
      case 'General Audiences':
        return isLight ? 'bg-gray-400/50' : 'bg-gray-400';
      case 'Teen And Up Audiences':
        return isLight ? 'bg-orange-400/50' : 'bg-orange-400';
      case 'Mature':
        return isLight ? 'bg-red-500/50' : 'bg-red-500';
      case 'Explicit':
        return isLight ? 'bg-red-400/50' : 'bg-red-400';
      case 'Not Rated':
        return isLight ? 'bg-yellow-400/50' : 'bg-yellow-400';
      default:
        return isLight ? 'bg-gray-800/50' : 'bg-gray-800';
    }
  }
  return (
    <span className={cn(
      `inline-flex items-center justify-center w-6 h-6 text-xs rounded ${isLight ? 'text-purple-200' : 'text-zinc-50'}`,
      getRatingColor(rating)
    )}>
      {rating.charAt(0).toUpperCase()}
    </span>
  )
}