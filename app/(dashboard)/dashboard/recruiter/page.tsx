"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { StatCard } from "@/components/ui/stat-card"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SkillBadge } from "@/components/ui/skill-badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { UserGroupIcon, BriefcaseIcon, StarIcon, KeyIcon } from "@heroicons/react/24/outline"
import Link from "next/link"

export default function RecruiterDashboard() {
  const { students, opportunities } = useAppStore()
  const [inviteToken, setInviteToken] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showInviteDialog, setShowInviteDialog] = useState(!isAuthenticated)

  const handleInviteSubmit = () => {
    if (inviteToken === "RECRUIT2025" || inviteToken.length > 5) {
      setIsAuthenticated(true)
      setShowInviteDialog(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <Dialog open={showInviteDialog} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Recruiter Access</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter your invite token to access the recruiter dashboard and anonymous student database.
            </p>
            <div className="space-y-2">
              <Input
                placeholder="Enter invite token"
                value={inviteToken}
                onChange={(e) => setInviteToken(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleInviteSubmit()}
              />
              <p className="text-xs text-muted-foreground">
                Demo token: <code className="rounded bg-secondary px-1">RECRUIT2025</code>
              </p>
            </div>
            <Button onClick={handleInviteSubmit} className="w-full">
              <KeyIcon className="mr-2 h-4 w-4" />
              Access Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Calculate some stats
  const topSkills = ["React", "Python", "Machine Learning", "Node.js", "Android"]
  const avgCGPA = (students.reduce((sum, s) => sum + s.cgpa, 0) / students.length).toFixed(2)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Recruiter Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Discover top talent from our campus</p>
        </div>
        <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
          <KeyIcon className="mr-2 h-4 w-4" />
          Change Token
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Available Candidates"
          value={students.length}
          description="Anonymous profiles"
          icon={<UserGroupIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Average CGPA"
          value={avgCGPA}
          description="Across all departments"
          icon={<StarIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Active Opportunities"
          value={opportunities.length}
          description="Posted by companies"
          icon={<BriefcaseIcon className="h-6 w-6" />}
        />
      </div>

      <Card className="glass rounded-2xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <Button className="justify-start h-auto py-4" asChild>
            <Link href="/resumes">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <UserGroupIcon className="h-5 w-5" />
                  <span className="font-semibold">Browse Candidates</span>
                </div>
                <p className="text-xs text-primary-foreground/80">View anonymous student profiles</p>
              </div>
            </Link>
          </Button>
          <Button className="justify-start h-auto py-4 bg-transparent" variant="outline" asChild>
            <Link href="/analytics">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <BriefcaseIcon className="h-5 w-5" />
                  <span className="font-semibold">View Analytics</span>
                </div>
                <p className="text-xs text-muted-foreground">Skill distribution & insights</p>
              </div>
            </Link>
          </Button>
        </div>
      </Card>

      <Card className="glass rounded-2xl p-6">
        <h2 className="mb-4 text-xl font-semibold text-foreground">Top Candidate Skills</h2>
        <div className="grid gap-4 md:grid-cols-5">
          {topSkills.map((skill) => {
            const count = students.filter((s) =>
              s.skills.some((sk) => sk.toLowerCase().includes(skill.toLowerCase())),
            ).length
            return (
              <div key={skill} className="text-center rounded-lg border border-border p-4">
                <div className="text-2xl font-bold text-primary">{count}</div>
                <div className="text-sm text-muted-foreground">{skill}</div>
              </div>
            )
          })}
        </div>
      </Card>

      <Card className="glass rounded-2xl p-6">
        <h2 className="mb-4 text-xl font-semibold text-foreground">Featured Candidates</h2>
        <p className="mb-4 text-sm text-muted-foreground">High-performing students with diverse skill sets</p>
        <div className="grid gap-4 md:grid-cols-2">
          {students.slice(0, 4).map((student) => (
            <div key={student.id} className="rounded-lg border border-border p-4">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">Candidate {student.id}</h3>
                  <p className="text-sm text-muted-foreground">
                    {student.department} • Year {student.year}
                  </p>
                  <p className="text-sm font-medium text-primary">CGPA: {student.cgpa}</p>
                </div>
              </div>
              <div className="mb-3 flex flex-wrap gap-1">
                {student.skills.slice(0, 4).map((skill) => (
                  <SkillBadge key={skill} skill={skill} />
                ))}
              </div>
              <Button size="sm" variant="outline" asChild className="w-full bg-transparent">
                <Link href="/resumes">View Full Profile</Link>
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="glass rounded-2xl p-6 bg-primary/5 border-primary/20">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <KeyIcon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">Read-Only Access</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Your current access allows you to browse anonymous candidate profiles and view opportunities. To post
              opportunities or schedule interviews, please contact the TnP office.
            </p>
            <Button variant="outline" size="sm">
              Contact TnP Office
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
