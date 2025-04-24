import { Work } from "@/app/api/types";
import Badge, { CompleteBadge, RatingBadge, WarningBadge } from "@/components/ui/badge";
import { getAuthorLink } from "@/lib/utils";
import Link from "next/link";

export default function WorkInfo({ work }: { work: Work }) {
  return (
    <div className="bg-purple-950/50 border border-purple-300/20 transition-all duration-200 shadow-md overflow-hidden text-white rounded-lg p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <h1 className="text-3xl font-bold mb-2 md:mb-0">
          {work.title}
        </h1>
        <div className="flex items-center space-x-2">
          <RatingBadge rating={work.rating} />
          <CompleteBadge isComplete={Boolean(work.complete)} />
        </div>
      </div>

      <div className="mb-4">
        <p className="text-lg">
          Written by <Link href={getAuthorLink(work.author)} className="text-purple-300" target="_blank">{work.author}</Link>
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
        <div className="bg-purple-800 bg-opacity-50 rounded p-3">
          <div className="text-2xl font-bold">{work.kudos.toLocaleString()}</div>
          <div className="text-sm text-purple-300">Kudos</div>
        </div>
        <div className="bg-purple-800 bg-opacity-50 rounded p-3">
          <div className="text-2xl font-bold">{work.hits.toLocaleString()}</div>
          <div className="text-sm text-purple-300">Hits</div>
        </div>
        <div className="bg-purple-800 bg-opacity-50 rounded p-3">
          <div className="text-2xl font-bold">{work.comments.toLocaleString()}</div>
          <div className="text-sm text-purple-300">Comments</div>
        </div>
        <div className="bg-purple-800 bg-opacity-50 rounded p-3">
          <div className="text-2xl font-bold">{work.words.toLocaleString()}</div>
          <div className="text-sm text-purple-300">Words</div>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Summary</h2>
        <div className="bg-purple-800 bg-opacity-30 rounded p-4 italic">
          {work.summary || "No summary provided."}
        </div>
      </div>

      {/* Tags section */}
      <div className="space-y-4">
        {work.fandoms && work.fandoms.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-purple-300 mb-1">Fandoms:</h3>
            <div>
              {work.fandoms.map((fandom, i) => (
                <Badge key={i} text={fandom} color="bg-indigo-700" />
              ))}
            </div>
          </div>
        )}

        {work.relationships && work.relationships.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-purple-300 mb-1">Relationships:</h3>
            <div>
              {work.relationships.map((relationship, i) => (
                <Badge key={i} text={relationship} color="bg-pink-700" />
              ))}
            </div>
          </div>
        )}

        {work.characters && work.characters.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-purple-300 mb-1">Characters:</h3>
            <div>
              {work.characters.map((character, i) => (
                <Badge key={i} text={character} color="bg-blue-700" />
              ))}
            </div>
          </div>
        )}

        {work.warnings && work.warnings.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-purple-300 mb-1">Warnings:</h3>
            <div>
              {work.warnings.map((warning, i) => (
                <WarningBadge key={i} warning={warning} />
              ))}
            </div>
          </div>
        )}

        {work.tags && work.tags.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-purple-300 mb-1">Additional Tags:</h3>
            <div>
              {work.tags.map((tag, i) => (
                <Badge key={i} text={tag} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}