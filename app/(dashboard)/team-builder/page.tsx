"use client"

import { useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DomainChart } from "@/components/ui/domain-chart"
import { SkillBadge } from "@/components/ui/skill-badge"
import { UserGroupIcon, SparklesIcon } from "@heroicons/react/24/outline"
import { generateTeamRecommendations } from "@/lib/mock-data"

export default function TeamBuilderPage() {
  const { currentUser, students, teamRecommendations, setTeamRecommendations } = useAppStore()

  useEffect(() => {
    if (currentUser && teamRecommendations.length === 0) {
      const recommendations = generateTeamRecommendations(currentUser, students)
      setTeamRecommendations(recommendations)
    }
  }, [currentUser, students, teamRecommendations, setTeamRecommendations])

  if (!currentUser) return null

  const handleRegenerateRecommendations = () => {
    const recommendations = generateTeamRecommendations(currentUser, students)
    setTeamRecommendations(recommendations)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Team Builder</h1>
          <p className="mt-1 text-muted-foreground">Find teammates with complementary skills</p>
        </div>
        <Button onClick={handleRegenerateRecommendations}>
          <SparklesIcon className="mr-2 h-5 w-5" />
          Regenerate
        </Button>
      </div>

      {/* Your Profile */}
      <Card className="glass rounded-2xl p-6">
        <h2 className="mb-4 text-xl font-semibold text-foreground">Your Profile</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="mb-4">
              <h3 className="font-semibold text-foreground">{currentUser.name}</h3>
              <p className="text-sm text-muted-foreground">
                {currentUser.department} • Year {currentUser.year} • CGPA: {currentUser.cgpa}
              </p>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-medium text-foreground">Your Skills</h4>
              <div className="flex flex-wrap gap-2">
                {currentUser.skills.map((skill) => (
                  <SkillBadge key={skill} skill={skill} />
                ))}
              </div>
            </div>
          </div>

          <div className="h-48">
            <h4 className="mb-2 text-sm font-medium text-foreground">Your Domain Strength</h4>
            <DomainChart domains={currentUser.domains} />
          </div>
        </div>
      </Card>

      {/* Recommended Teammates */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-foreground">Recommended Teammates</h2>
        <p className="mb-4 text-sm text-muted-foreground">Based on complementary skills and domain expertise</p>

        <div className="grid gap-6 md:grid-cols-2">
          {teamRecommendations.map((member) => {
            const student = students.find((s) => s.id === member.id)
            if (!student) return null

            return (
              <Card key={member.id} className="glass rounded-2xl p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {student.department} • Year {student.year}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-sm font-bold text-primary">{member.matchScore}%</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="mb-2 text-sm font-medium text-foreground">Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {member.skills.slice(0, 6).map((skill) => {
                      const isComplementary = !currentUser.skills.includes(skill)
                      return <SkillBadge key={skill} skill={skill} variant={isComplementary ? "matched" : "default"} />
                    })}
                  </div>
                </div>

                <div className="mb-4 h-32">
                  <h4 className="mb-2 text-sm font-medium text-foreground">Domain Strength</h4>
                  <DomainChart domains={member.domains} />
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <UserGroupIcon className="mr-2 h-4 w-4" />
                    Connect
                  </Button>
                  <Button size="sm" variant="outline">
                    View Profile
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {teamRecommendations.length === 0 && (
        <Card className="glass rounded-2xl p-12 text-center">
          <UserGroupIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No recommendations available yet</p>
          <Button onClick={handleRegenerateRecommendations} className="mt-4">
            Generate Recommendations
          </Button>
        </Card>
      )}
    </div>
  )
}
