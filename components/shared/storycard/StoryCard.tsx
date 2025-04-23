"use client";
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '../../ui/card';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { MouseEvent, useState } from 'react';
import { cn } from '@/lib/utils';
import { Warning, Work } from '@/app/api/types';
import { RatingBadge, WarningBadge } from '@/components/ui/badge';


interface StoryCardProps {
  story: Work;
}


export default function StoryCard({ story }: StoryCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(mouseY, { stiffness: 100, damping: 30 });
  const rotateY = useSpring(mouseX, { stiffness: 100, damping: 30 });

  const [isHovered, setIsHovered] = useState(false);

  function onMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const percentX = (clientX - left) / width;
    const percentY = (clientY - top) / height;

    const boundedX = Math.max(-0.5, Math.min(0.5, (percentX - 0.5) * 1.2));
    const boundedY = Math.max(-0.5, Math.min(0.5, (percentY - 0.5) * 1.2));

    mouseX.set(boundedX * 10);
    mouseY.set(boundedY * -10);
  }

  function onMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  }

  function onMouseEnter() {
    setIsHovered(true);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
      style={{
        perspective: "1200px",
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          position: "relative",
          transformStyle: "preserve-3d",
        }}
        animate={{
          scale: isHovered ? 1.02 : 1,
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.98 }}
      >
        <Card className={cn(
          "bg-purple-950/50 border border-purple-300/20 transition-all duration-200 shadow-md overflow-hidden",
          isHovered ? "border-purple-400/40 shadow-lg cursor-pointer" : ""
        )}>
          <CardHeader className="pb-2">
            <div className='flex items-start mb-1'>
              <div className='mr-2 flex-shrink-0 pt-[1px] text-white'>
                <RatingBadge rating={story.rating} />
              </div>
              <div className='flex-grow min-w-0'>
                <h3 className='text-xl font-bold text-purple-100 line-clamp-2 h-[3.5rem] leading-snug'>
                  <Link href={`/archive/${story.id}`} className={cn(
                    "transition-colors",
                    isHovered ? "text-purple-300" : "text-purple-100 hover:text-purple-300"
                  )}>
                    {story.title}
                  </Link>
                </h3>
              </div>
            </div>
            <p className='text-purple-300 text-sm mt-0.5 font-bold'>
              by {story.author}
            </p>
          </CardHeader>

          <CardContent className="pt-0">
            <p className="text-purple-200/80 text-sm line-clamp-3">{story.summary}</p>

            <div className="flex flex-wrap gap-2 my-3">
              {story.warnings.slice(0, 2).map((warning, index) => (
                <WarningBadge
                  key={index}
                  warning={warning as Warning}
                />
              ))}
              {story.warnings.length > 2 && (
                <span className={`text-xs text-purple-200 px-2 py-1 rounded`}>
                  +{story.warnings.length - 2} more
                </span>
              )}
            </div>
          </CardContent>

          <CardFooter className={cn("text-xs text-purple-300/70 flex justify-between pt-0")}>
            <div className="flex space-x-3">
              <span>{story.words.toLocaleString()} words</span>
              <span>{story.chapters} {story.chapters === 1 ? 'chapter' : 'chapters'}</span>
            </div>
            <div className="flex space-x-3">
              <span>{story.kudos.toLocaleString()} kudos</span>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
} 