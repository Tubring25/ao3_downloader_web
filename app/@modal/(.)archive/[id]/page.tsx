import { queryWorkById } from "@/app/api/search";
import { notFound } from "next/navigation";
import ArchiveModal from "@/components/shared/modals/ArchiveModal";

export default async function ArchiveModalPage({
    params,
}: {
    params: { id: string };
}) {
    const { id } = await params;

    const response = await queryWorkById(parseInt(id, 10));
    if (!response) {
        notFound();
    }
    const work = response.data;

    return (
        <ArchiveModal work={work} />
    );
}