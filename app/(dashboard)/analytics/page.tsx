"use client"

import { useAppStore } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { StatCard } from "@/components/ui/stat-card"
import { DomainChart } from "@/components/ui/domain-chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { BriefcaseIcon, UserGroupIcon, ChartBarIcon, AcademicCapIcon } from "@heroicons/react/24/outline"

export default function AnalyticsPage() {
  const { students, opportunities, applications } = useAppStore()

  // Department distribution
  const deptCounts: Record<string, number> = {}
  students.forEach((s) => {
    deptCounts[s.department] = (deptCounts[s.department] || 0) + 1
  })
  const deptData = Object.entries(deptCounts).map(([name, value]) => ({ name, value }))

  // Year distribution
  const yearCounts: Record<number, number> = {}
  students.forEach((s) => {
    yearCounts[s.year] = (yearCounts[s.year] || 0) + 1
  })
  const yearData = Object.entries(yearCounts).map(([name, value]) => ({
    name: `Year ${name}`,
    value: Number(value),
  }))

  // Application stages
  const stageCounts: Record<string, number> = {}
  applications.forEach((a) => {
    stageCounts[a.stage] = (stageCounts[a.stage] || 0) + 1
  })
  const stageData = Object.entries(stageCounts).map(([name, value]) => ({ name, value }))

  // Average domain scores
  const avgDomains = {
    web: Math.round(students.reduce((sum, s) => sum + s.domains.web, 0) / students.length),
    ml: Math.round(students.reduce((sum, s) => sum + s.domains.ml, 0) / students.length),
    cp: Math.round(students.reduce((sum, s) => sum + s.domains.cp, 0) / students.length),
    appDev: Math.round(students.reduce((sum, s) => sum + s.domains.appDev, 0) / students.length),
    cyber: Math.round(students.reduce((sum, s) => sum + s.domains.cyber, 0) / students.length),
  }

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ]

  const avgCGPA = (students.reduce((sum, s) => sum + s.cgpa, 0) / students.length).toFixed(2)
  const placementRate =
    applications.length > 0
      ? ((applications.filter((a) => a.stage === "selected").length / applications.length) * 100).toFixed(1)
      : "0"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Comprehensive insights and statistics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={students.length}
          description="Registered in database"
          icon={<UserGroupIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Active Opportunities"
          value={opportunities.length}
          description="Currently available"
          icon={<BriefcaseIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Average CGPA"
          value={avgCGPA}
          description="Across all students"
          icon={<AcademicCapIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Placement Rate"
          value={`${placementRate}%`}
          description="Selection success rate"
          icon={<ChartBarIcon className="h-6 w-6" />}
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Department Distribution */}
        <Card className="glass rounded-2xl p-6">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Department Distribution</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deptData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Year Distribution */}
        <Card className="glass rounded-2xl p-6">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Year-wise Distribution</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Average Domain Strength */}
        <Card className="glass rounded-2xl p-6">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Average Domain Strength</h2>
          <div className="h-72">
            <DomainChart domains={avgDomains} />
          </div>
        </Card>

        {/* Application Stages */}
        <Card className="glass rounded-2xl p-6">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Application Pipeline</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}
