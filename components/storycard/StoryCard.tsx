"use client";
import Link from 'next/link';
import { Story, Warning } from '@/app/types/story';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { MouseEvent, useState } from 'react';
import { cn } from '@/lib/utils';
import RatingIcon from './RatingIcon';


interface StoryCardProps {
  story: Story;
}

const getWarningColor = (warning: Warning): string => {
  switch (warning) {
    case 'Creator Chose Not To Use Archive Warnings':
      return 'bg-gray-400/50';
    case 'Graphic Depictions Of Violence':
      return 'bg-orange-400/50';
    case 'Major Character Death':
      return 'bg-red-500/50';
    case 'Rape/Non-Con':
      return 'bg-red-400/50';
    case 'Underage Sex':
      return 'bg-yellow-400/50';
    case 'No Archive Warnings Apply':
      return 'bg-green-400/50';
    default:
      return 'bg-gray-800/50';
  }
}

export default function StoryCard({ story }: StoryCardProps) {
  // 3D 效果的运动值
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // 使用弹簧效果让动画更平滑
  const rotateX = useSpring(mouseY, { stiffness: 100, damping: 30 });
  const rotateY = useSpring(mouseX, { stiffness: 100, damping: 30 });

  // 鼠标悬停状态
  const [isHovered, setIsHovered] = useState(false);
  
  function onMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const percentX = (clientX - left) / width;
    const percentY = (clientY - top) / height;
    
    // 计算旋转角度，中心为原点
    const boundedX = Math.max(-0.5, Math.min(0.5, (percentX - 0.5) * 1.2));
    const boundedY = Math.max(-0.5, Math.min(0.5, (percentY - 0.5) * 1.2));
    
    mouseX.set(boundedX * 10); // 将旋转角度限制在 -5° 到 5° 之间
    mouseY.set(boundedY * -10); // Y轴反转以获得正确的倾斜方向
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
          isHovered ? "border-purple-400/40 shadow-lg" : ""
        )}>
          <CardHeader className="pb-2">
            <div className="mb-1">
              <h3 className="flex items-center text-xl font-bold text-purple-100 line-clamp-2">
                <RatingIcon rating={story.rating} />
                <Link href={`/story/${story.id}`} className={cn(
                  "transition-colors ml-2",
                  isHovered ? "text-purple-300" : "text-purple-100 hover:text-purple-300"
                )}>
                  {story.title}
                </Link>
              </h3>
              <p className="text-purple-300 text-sm">by {story.author}</p>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <p className="text-purple-200/80 text-sm line-clamp-3">{story.summary}</p>
            
            <div className="flex flex-wrap gap-2 my-3">
              {story.warnings.slice(0, 2).map((warning, index) => (
                <span key={index} className={`text-xs text-purple-200 px-2 py-1 rounded ${getWarningColor(warning as Warning)}`}>
                  {warning}
                </span>
              ))}
              {story.warnings.length > 2 && (
                <span className={`text-xs text-purple-200 px-2 py-1 rounded ${getWarningColor(story.warnings[0] as Warning)}`}>
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