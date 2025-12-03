"use client"

import { useAppStore } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SkillBadge } from "@/components/ui/skill-badge"
import { calculateMatchScore } from "@/lib/mock-data"
import Link from "next/link"
import { SparklesIcon } from "@heroicons/react/24/outline"

export default function RecommendationsPage() {
  const { currentUser, opportunities } = useAppStore()

  if (!currentUser) return null

  const recommendedOpportunities = opportunities
    .map((opp) => ({
      ...opp,
      matchScore: calculateMatchScore(currentUser.skills, opp.skills),
      matchedSkills: currentUser.skills.filter((skill) =>
        opp.skills.some(
          (req) => skill.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(skill.toLowerCase()),
        ),
      ),
      missingSkills: opp.skills.filter(
        (skill) =>
          !currentUser.skills.some(
            (s) => s.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(s.toLowerCase()),
          ),
      ),
    }))
    .sort((a, b) => b.matchScore - a.matchScore)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Personalized Recommendations</h1>
        <p className="mt-1 text-muted-foreground">Opportunities ranked by your skill match score</p>
      </div>

      <div className="space-y-4">
        {recommendedOpportunities.map((opp, index) => (
          <Card key={opp.id} className="glass rounded-2xl p-6 transition-all hover:shadow-xl">
            <div className="flex items-start gap-6">
              {/* Match Score Badge */}
              <div className="flex-shrink-0">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{opp.matchScore}%</div>
                    <div className="text-xs text-muted-foreground">Match</div>
                  </div>
                </div>
                {index === 0 && (
                  <div className="mt-2 flex items-center justify-center gap-1 text-xs text-primary">
                    <SparklesIcon className="h-3 w-3" />
                    <span>Best Match</span>
                  </div>
                )}
              </div>

              {/* Opportunity Details */}
              <div className="flex-1 min-w-0">
                <div className="mb-3">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{opp.title}</h3>
                      <p className="text-muted-foreground">{opp.company}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        opp.type === "internship"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : opp.type === "project"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                      }`}
                    >
                      {opp.type}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">{opp.description}</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 mb-4">
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-green-600 dark:text-green-400">
                      ✓ Your Matching Skills ({opp.matchedSkills.length})
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {opp.matchedSkills.map((skill: string) => (
                        <SkillBadge key={skill} skill={skill} variant="matched" />
                      ))}
                    </div>
                  </div>

                  {opp.missingSkills.length > 0 && (
                    <div>
                      <h4 className="mb-2 text-sm font-medium text-orange-600 dark:text-orange-400">
                        ⚠ Skills to Learn ({opp.missingSkills.length})
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {opp.missingSkills.map((skill: string) => (
                          <SkillBadge key={skill} skill={skill} variant="missing" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Button asChild>
                    <Link href={`/opportunities/${opp.id}`}>View Details & Apply</Link>
                  </Button>
                  {opp.stipend && <span className="text-sm text-muted-foreground">💰 {opp.stipend}</span>}
                  {opp.duration && <span className="text-sm text-muted-foreground">⏱️ {opp.duration}</span>}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
