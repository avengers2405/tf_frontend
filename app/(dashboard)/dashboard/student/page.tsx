"use client"

import type React from "react"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { StatCard } from "@/components/ui/stat-card"
import { SkillBadge } from "@/components/ui/skill-badge"
import { DomainChart } from "@/components/ui/domain-chart"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  BriefcaseIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ArrowUpTrayIcon,
  UserGroupIcon,
  LightBulbIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline"
import { calculateMatchScore, extractSkillsFromResume, generateTeamRecommendations } from "@/lib/mock-data"
import Link from "next/link"

export default function StudentDashboard() {
  const { currentUser, opportunities, applications, students, setTeamRecommendations } = useAppStore()
  const [showResumeUpload, setShowResumeUpload] = useState(false)
  const [extractedSkills, setExtractedSkills] = useState<string[]>([])
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null)
  const [showMatchAnalysis, setShowMatchAnalysis] = useState(false)
  const [showAnonymousResume, setShowAnonymousResume] = useState(false)
  const [showChatbot, setShowChatbot] = useState(false)

  if (!currentUser) return null

  const myApplications = applications.filter((app) => app.studentId === currentUser.id)
  const recommendedOpportunities = opportunities
    .map((opp) => ({
      ...opp,
      matchScore: calculateMatchScore(currentUser.skills, opp.skills),
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3)

  // Calculate missing skills for top opportunities
  const allRequiredSkills = new Set(opportunities.flatMap((o) => o.skills))
  const missingSkills = Array.from(allRequiredSkills)
    .filter(
      (skill) =>
        !currentUser.skills.some(
          (s) => s.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(s.toLowerCase()),
        ),
    )
    .slice(0, 8)

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Mock resume parsing
      const mockResumeText = `
        Skills: React, Node.js, Python, Machine Learning, TensorFlow, Docker, Kubernetes, AWS
        Experience: Frontend Developer at TechCorp
        Projects: E-commerce Platform, ML Classification System
      `
      const skills = extractSkillsFromResume(mockResumeText)
      setExtractedSkills(skills)
    }
  }

  const handleGenerateTeam = () => {
    const recommendations = generateTeamRecommendations(currentUser, students)
    setTeamRecommendations(recommendations)
  }

  const applicationStages = [
    { name: "Applied", status: "complete", date: "2025-01-20" },
    { name: "Screening", status: "complete", date: "2025-01-22" },
    { name: "Test", status: "current", date: "2025-01-26" },
    { name: "Interview", status: "upcoming", date: "TBD" },
    { name: "HR Round", status: "upcoming", date: "TBD" },
    { name: "Final", status: "upcoming", date: "TBD" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back, {currentUser.name}!</h1>
        <p className="mt-1 text-muted-foreground">Here's your personalized dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Applications"
          value={myApplications.length}
          description="Active applications"
          icon={<DocumentTextIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Match Score"
          value={`${recommendedOpportunities[0]?.matchScore || 0}%`}
          description="Best opportunity match"
          icon={<ChartBarIcon className="h-6 w-6" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Skills"
          value={currentUser.skills.length}
          description="In your profile"
          icon={<LightBulbIcon className="h-6 w-6" />}
        />
        <StatCard
          title="CGPA"
          value={currentUser.cgpa}
          description={`${currentUser.year}${currentUser.year === 1 ? "st" : currentUser.year === 2 ? "nd" : currentUser.year === 3 ? "rd" : "th"} Year`}
          icon={<BriefcaseIcon className="h-6 w-6" />}
        />
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Domain Ranking */}
        <Card className="glass lg:col-span-2 rounded-2xl p-6">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Domain Strength Analysis</h2>
          <div className="h-72">
            <DomainChart domains={currentUser.domains} />
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="glass rounded-2xl p-6">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Quick Actions</h2>
          <div className="space-y-3">
            <Button onClick={() => setShowResumeUpload(true)} className="w-full justify-start" variant="outline">
              <ArrowUpTrayIcon className="mr-2 h-5 w-5" />
              Upload Resume
            </Button>
            <Button onClick={() => setShowAnonymousResume(true)} className="w-full justify-start" variant="outline">
              <EyeIcon className="mr-2 h-5 w-5" />
              Preview Anonymous Resume
            </Button>
            <Link href="/team-builder">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <UserGroupIcon className="mr-2 h-5 w-5" />
                Find Team Members
              </Button>
            </Link>
            <Button onClick={() => setShowChatbot(true)} className="w-full justify-start" variant="outline">
              <LightBulbIcon className="mr-2 h-5 w-5" />
              Ask FAQ Bot
            </Button>
          </div>
        </Card>
      </div>

      {/* Recommended Opportunities */}
      <Card className="glass rounded-2xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Recommended For You</h2>
          <Link href="/recommendations">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {recommendedOpportunities.map((opp) => (
            <div
              key={opp.id}
              className="glass rounded-xl border border-border p-4 transition-all hover:shadow-lg cursor-pointer"
              onClick={() => {
                setSelectedOpportunity(opp)
                setShowMatchAnalysis(true)
              }}
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{opp.title}</h3>
                  <p className="text-sm text-muted-foreground">{opp.company}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-sm font-bold text-primary">{opp.matchScore}%</span>
                </div>
              </div>
              <div className="mb-3 flex flex-wrap gap-1">
                {opp.tags.slice(0, 2).map((tag: string) => (
                  <span key={tag} className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {opp.stipend && `${opp.stipend} • `}
                {opp.duration}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Missing Skills */}
      <Card className="glass rounded-2xl p-6">
        <h2 className="mb-4 text-xl font-semibold text-foreground">Skill Gap Analysis</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Based on top opportunities, consider learning these skills:
        </p>
        <div className="flex flex-wrap gap-2">
          {missingSkills.map((skill) => (
            <SkillBadge key={skill} skill={skill} variant="missing" />
          ))}
        </div>
      </Card>

      {/* Application Timeline */}
      {myApplications.length > 0 && (
        <Card className="glass rounded-2xl p-6">
          <h2 className="mb-6 text-xl font-semibold text-foreground">Application Timeline</h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 h-full w-0.5 bg-border" />

            {/* Timeline items */}
            <div className="space-y-6">
              {applicationStages.map((stage, index) => (
                <div key={stage.name} className="relative flex items-start gap-4 pl-10">
                  <div
                    className={`absolute left-0 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                      stage.status === "complete"
                        ? "border-primary bg-primary"
                        : stage.status === "current"
                          ? "border-primary bg-background"
                          : "border-border bg-background"
                    }`}
                  >
                    {stage.status === "complete" && <CheckCircleIcon className="h-5 w-5 text-primary-foreground" />}
                    {stage.status === "current" && <ClockIcon className="h-5 w-5 text-primary" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <h3 className="font-semibold text-foreground">{stage.name}</h3>
                    <p className="text-sm text-muted-foreground">{stage.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Resume Upload Dialog */}
      <Dialog open={showResumeUpload} onOpenChange={setShowResumeUpload}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Resume</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-xl border-2 border-dashed border-border p-8 text-center">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload" className="cursor-pointer">
                <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-foreground">Click to upload resume</p>
                <p className="text-xs text-muted-foreground">PDF, DOC, DOCX up to 5MB</p>
              </label>
            </div>

            {extractedSkills.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-medium text-foreground">Extracted Skills:</h3>
                <div className="flex flex-wrap gap-2">
                  {extractedSkills.map((skill) => (
                    <SkillBadge key={skill} skill={skill} variant="matched" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Match Analysis Dialog */}
      <Dialog open={showMatchAnalysis} onOpenChange={setShowMatchAnalysis}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Match Analysis</DialogTitle>
          </DialogHeader>
          {selectedOpportunity && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-3xl font-bold text-primary">{selectedOpportunity.matchScore}%</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold">{selectedOpportunity.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedOpportunity.company}</p>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-medium text-foreground">Matched Skills:</h4>
                <div className="flex flex-wrap gap-2">
                  {currentUser.skills
                    .filter((skill) =>
                      selectedOpportunity.skills.some(
                        (req: string) =>
                          skill.toLowerCase().includes(req.toLowerCase()) ||
                          req.toLowerCase().includes(skill.toLowerCase()),
                      ),
                    )
                    .map((skill) => (
                      <SkillBadge key={skill} skill={skill} variant="matched" />
                    ))}
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-medium text-foreground">Required Skills You're Missing:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedOpportunity.skills
                    .filter(
                      (skill: string) =>
                        !currentUser.skills.some(
                          (s) =>
                            s.toLowerCase().includes(skill.toLowerCase()) ||
                            skill.toLowerCase().includes(s.toLowerCase()),
                        ),
                    )
                    .map((skill: string) => (
                      <SkillBadge key={skill} skill={skill} variant="missing" />
                    ))}
                </div>
              </div>

              <Button className="w-full" asChild>
                <Link href={`/opportunities/${selectedOpportunity.id}`}>View Details & Apply</Link>
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Anonymous Resume Dialog */}
      <Dialog open={showAnonymousResume} onOpenChange={setShowAnonymousResume}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Anonymous Resume Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-muted/50 p-4">
              <h3 className="font-semibold text-foreground">Student ID: {currentUser.id}</h3>
              <p className="text-sm text-muted-foreground">
                {currentUser.department} • Year {currentUser.year} • CGPA: {currentUser.cgpa}
              </p>
            </div>

            <div>
              <h4 className="mb-2 font-medium text-foreground">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {currentUser.skills.map((skill) => (
                  <SkillBadge key={skill} skill={skill} />
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-2 font-medium text-foreground">Projects</h4>
              {currentUser.projects.map((project) => (
                <div key={project.id} className="mb-3 rounded-lg border border-border p-3">
                  <h5 className="font-medium text-foreground">{project.title}</h5>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </div>
              ))}
            </div>

            <div>
              <h4 className="mb-2 font-medium text-foreground">Experience</h4>
              {currentUser.experience.map((exp) => (
                <div key={exp.id} className="mb-3 rounded-lg border border-border p-3">
                  <h5 className="font-medium text-foreground">{exp.title}</h5>
                  <p className="text-sm text-muted-foreground">
                    {exp.company} • {exp.duration}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Chatbot Dialog */}
      <Dialog open={showChatbot} onOpenChange={setShowChatbot}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>FAQ Assistant</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {[
              { q: "What is the eligibility criteria?", a: "Most opportunities require min 7.0 CGPA" },
              { q: "How do I apply for internships?", a: "Click on any opportunity and hit Apply" },
              { q: "When are deadlines?", a: "Check individual opportunity cards for deadlines" },
              { q: "Can I apply to multiple roles?", a: "Yes, you can apply to multiple opportunities" },
            ].map((faq) => (
              <details key={faq.q} className="group rounded-lg border border-border p-3">
                <summary className="cursor-pointer font-medium text-foreground">{faq.q}</summary>
                <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
              </details>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
