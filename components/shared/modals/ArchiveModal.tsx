'use client'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogDescription, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShieldCloseIcon } from 'lucide-react';
import Link from "next/link";

export default function ArchiveModal({ work }: { work: any }) {
    const [isOpen, setIsOpen] = useState(true);
    const router = useRouter();

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setIsOpen(false);
            setTimeout(() => {
                router.back();
            }, 150);
        }
    };

    const handleNavigateFull = () => {
        setIsOpen(false);
        setTimeout(() => {
            // 使用replace而不是push，并强制刷新
            router.replace(`/archive/${work.id}`);
            // 添加一个硬刷新作为备选方案
            setTimeout(() => {
                window.location.href = `/archive/${work.id}`;
            }, 100);
        }, 200);
    }

    if (!work) return null;

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="bg-purple-950/50 border border-purple-300/20 transition-all duration-200 shadow-md overflow-hidden text-white">
                <DialogHeader className="space-y-4 pb-2">
                    <div className="flex items-center gap-3">
                        <div className="flex justify-center items-center bg-pink-800 rounded w-8 h-8 text-white font-medium">
                            {work.rating?.[0]?.toUpperCase() || "E"}
                        </div>
                        <DialogTitle className="text-xl font-bold">{work.title}</DialogTitle>
                    </div>
                    <div className="text-gray-300">
                        by {work.author || "Unknown Author"}
                    </div>
                </DialogHeader>
                <DialogDescription className="text-sm text-gray-200 mt-2 mb-4 max-h-[200px] overflow-y-auto">
                    {work.summary || "No summary available."}
                </DialogDescription>

                <div className="bg-purple-900/50 p-3 rounded-md my-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                        <p><span className="text-gray-300">Fandom:</span> {work.fandom || "Not specified"}</p>
                        <p><span className="text-gray-300">Rating:</span> {work.rating || "Not rated"}</p>
                        {work.wordCount && <p><span className="text-gray-300">Words:</span> {work.wordCount.toLocaleString()}</p>}
                        {work.chapters && <p><span className="text-gray-300">Chapters:</span> {work.chapters}</p>}
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <div className="flex justify-between w-full">
                        <Button
                            variant="outline"
                            className="bg-transparent text-gray-300 border-gray-600 hover:bg-purple-800 hover:text-white"
                            onClick={() => router.back()}
                        >
                            Back
                        </Button>
                        <Button
                            className="bg-pink-700 hover:bg-pink-600 text-white"
                            onClick={handleNavigateFull}
                        >
                            Full Story
                        </Button>
                    </div>
                </DialogFooter>

                <DialogClose asChild className="absolute top-4 right-4 text-gray-400 hover:text-white focus:outline-none">
                    <button aria-label="Close">
                       <ShieldCloseIcon className="h-5 w-5" />
                    </button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
}