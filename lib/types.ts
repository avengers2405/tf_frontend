export type UserRole = "student" | "tnp" | "teacher" | "recruiter"

export interface Student {
  id: string
  name: string
  email: string
  department: string
  year: number
  cgpa: number
  skills: string[]
  domains: {
    web: number
    ml: number
    cp: number
    appDev: number
    cyber: number
  }
  projects: Project[]
  experience: Experience[]
  leadership: string[]
  resumeUrl?: string
}

export interface Experience {
  id: string
  title: string
  company: string
  duration: string
  description: string
}

export interface Project {
  id: string
  title: string
  description: string
  skills: string[]
  link?: string
}

export interface Opportunity {
  id: string
  title: string
  company: string
  type: "internship" | "project" | "fulltime"
  description: string
  skills: string[]
  tags: string[]
  stipend?: string
  duration?: string
  eligibility: {
    minCGPA?: number
    departments?: string[]
    years?: number[]
  }
  postedBy: string
  postedDate: string
  deadline: string
  applicants?: number
}

export interface Application {
  id: string
  opportunityId: string
  studentId: string
  stage: "applied" | "screening" | "test" | "interview" | "hr" | "selected" | "rejected"
  matchScore: number
  appliedDate: string
  lastUpdated: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  timestamp: string
}

export interface TeamMember {
  id: string
  name: string
  skills: string[]
  domains: {
    web: number
    ml: number
    cp: number
    appDev: number
    cyber: number
  }
  matchScore: number
}
