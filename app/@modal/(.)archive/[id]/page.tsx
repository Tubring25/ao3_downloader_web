import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { queryWorkById } from "@/app/api/search";
import { notFound } from "next/navigation";
import { DialogDescription } from "@radix-ui/react-dialog";

export default async function ArchiveModal({
    params,
}: {
    params: { id: string };
}) {
    const { id } = params;

    const response = await queryWorkById(parseInt(id, 10));
    if (!response) {
        notFound();
    }
    const work = response.data;

    return (
        <Dialog open>
            <DialogContent className="bg-purple-950/50 border border-purple-300/20 transition-all duration-200 shadow-md overflow-hidden text-white">
                <DialogHeader className="space-y-4 pb-2">
                    <div className="flex items-center gap-3">
                        <div className="flex justify-center items-center bg-pink-800 rounded w-8 h-8 text-white font-medium">
                            {work.rating?.[0]?.toUpperCase() || "E"}
                        </div>
                        <h2 className="text-xl font-bold">{work.title}</h2>
                    </div>

                    <div className="text-gray-300">
                        by {work.author || "Unknown Author"}
                    </div>
                </DialogHeader>
                <DialogDescription>
                    {work.summary}
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
                            asChild
                            className="bg-transparent text-gray-300 border-gray-600 hover:bg-purple-800 hover:text-white"
                        >
                            <Link href="/browser">Back</Link>
                        </Button>
                        <Button
                            asChild
                            className="bg-pink-700 hover:bg-pink-600 text-white"
                        >
                            <Link href={`/archive/${id}`}>View Full Story</Link>
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}