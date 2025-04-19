import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogHeader, DialogFooter, DialogClose } from '../../ui/dialog';
import { Button } from '../../ui/button';
import Link from 'next/link';
import { Rating } from '@/app/types/story';
import RatingIcon from './RatingIcon';

export const ratingArray: Rating[] = [
  'General Audiences',
  'Teen And Up Audiences',
  'Mature',
  'Explicit',
  'Not Rated'
]

export default function InstructionsDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='bg-purple-900/50 border border-purple-300/20 text-purple-100'>
        <DialogHeader>
          <DialogTitle>Story Card Instructions</DialogTitle>
          <DialogDescription>
            This is the instructions for the story card.
            <br />
            For more info please check the <Link href="https://archiveofourown.org/help/guidelines" target='_blank' className='text-purple-400 hover:text-purple-300 font-bold'>guidelines</Link> of the Archive of Our Own.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div>
            <h3 className='text-lg font-bold'>警告</h3>
            <ul className='flex flex-col gap-2'>
                {ratingArray.map((rating) => (
                <li key={rating}>
                  <RatingIcon rating={rating} isLight={false} /> 
                  <span className='ml-2'>{rating}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className='bg-purple-400 hover:bg-purple-300 text-purple-900'>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}