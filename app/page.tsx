"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { mockStudents, mockOpportunities, mockApplications, mockNotifications } from "@/lib/mock-data"

export default function HomePage() {
  const router = useRouter()
  const { currentRole, setCurrentUser, opportunities, students, bulkAddStudents } = useAppStore()

  useEffect(() => {
    // Initialize mock data on first load
    if (students.length === 0) {
      bulkAddStudents(mockStudents)
    }

    if (opportunities.length === 0) {
      mockOpportunities.forEach((opp) => {
        useAppStore.getState().addOpportunity(opp)
      })
    }

    if (useAppStore.getState().applications.length === 0) {
      mockApplications.forEach((app) => {
        useAppStore.getState().addApplication(app)
      })
    }

    if (useAppStore.getState().notifications.length === 0) {
      mockNotifications.forEach((notif) => {
        useAppStore.getState().addNotification(notif)
      })
    }

    // Set current user (mock)
    setCurrentUser(mockStudents[0])

    // Redirect to appropriate dashboard
    router.push(`/dashboard/${currentRole}`)
  }, [currentRole, router, setCurrentUser, opportunities, students, bulkAddStudents])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
        <p className="text-muted-foreground">Loading Campus Portal...</p>
      </div>
    </div>
  )
}
