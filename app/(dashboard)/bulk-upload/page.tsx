"use client"

import type React from "react"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpTrayIcon, CheckCircleIcon } from "@heroicons/react/24/outline"
import * as XLSX from "xlsx"

export default function BulkUploadPage() {
  const { bulkAddStudents } = useAppStore()
  const [previewData, setPreviewData] = useState<any[]>([])
  const [isUploaded, setIsUploaded] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const data = event.target?.result
      const workbook = XLSX.read(data, { type: "binary" })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      // Transform to student format
      const students = jsonData.map((row: any, index) => ({
        id: row.id || `S${1000 + index}`,
        name: row.name || "Unknown",
        email: row.email || `student${index}@university.edu`,
        department: row.department || "Computer Science",
        year: Number.parseInt(row.year) || 3,
        cgpa: Number.parseFloat(row.cgpa) || 7.5,
        skills: row.skills ? row.skills.split(",").map((s: string) => s.trim()) : [],
        domains: {
          web: Number.parseInt(row.web) || 50,
          ml: Number.parseInt(row.ml) || 50,
          cp: Number.parseInt(row.cp) || 50,
          appDev: Number.parseInt(row.appDev) || 50,
          cyber: Number.parseInt(row.cyber) || 50,
        },
        projects: [],
        experience: [],
        leadership: row.leadership ? [row.leadership] : [],
      }))

      setPreviewData(students)
    }
    reader.readAsBinaryString(file)
  }

  const handleFinalize = () => {
    bulkAddStudents(previewData)
    setIsUploaded(true)

    useAppStore.getState().addNotification({
      id: `N${Date.now()}`,
      title: "Bulk Upload Complete",
      message: `Successfully uploaded ${previewData.length} student records`,
      type: "success",
      read: false,
      timestamp: new Date().toISOString(),
    })
  }

  const downloadTemplate = () => {
    const template = [
      {
        id: "S001",
        name: "John Doe",
        email: "john@university.edu",
        department: "Computer Science",
        year: 3,
        cgpa: 8.5,
        skills: "React, Node.js, Python",
        web: 85,
        ml: 60,
        cp: 70,
        appDev: 75,
        cyber: 50,
        leadership: "President - Coding Club",
      },
    ]

    const ws = XLSX.utils.json_to_sheet(template)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Students")
    XLSX.writeFile(wb, "student_template.xlsx")
  }

  if (isUploaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="glass rounded-2xl p-12 text-center max-w-md">
          <CheckCircleIcon className="mx-auto h-16 w-16 text-green-600 mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Upload Successful!</h2>
          <p className="text-muted-foreground mb-6">
            {previewData.length} student records have been added to the database
          </p>
          <div className="flex gap-3">
            <Button
              onClick={() => {
                setIsUploaded(false)
                setPreviewData([])
              }}
              className="flex-1"
            >
              Upload More
            </Button>
            <Button variant="outline" onClick={() => (window.location.href = "/resumes")}>
              View Students
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Bulk Upload Students</h1>
        <p className="mt-1 text-muted-foreground">Upload student data via Excel file</p>
      </div>

      {previewData.length === 0 ? (
        <Card className="glass rounded-2xl p-12">
          <div className="text-center">
            <ArrowUpTrayIcon className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Upload Excel File</h2>
            <p className="text-sm text-muted-foreground mb-6">Upload an Excel file with student information</p>

            <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="hidden" id="file-upload" />
            <label htmlFor="file-upload">
              <Button asChild>
                <span>Choose File</span>
              </Button>
            </label>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">Don't have a template? Download one below</p>
              <Button variant="outline" onClick={downloadTemplate}>
                Download Template
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <>
          <Card className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Preview ({previewData.length} records)</h2>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setPreviewData([])}>
                  Cancel
                </Button>
                <Button onClick={handleFinalize}>Finalize Upload</Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr className="text-left">
                    <th className="pb-3 font-medium text-muted-foreground">ID</th>
                    <th className="pb-3 font-medium text-muted-foreground">Name</th>
                    <th className="pb-3 font-medium text-muted-foreground">Department</th>
                    <th className="pb-3 font-medium text-muted-foreground">Year</th>
                    <th className="pb-3 font-medium text-muted-foreground">CGPA</th>
                    <th className="pb-3 font-medium text-muted-foreground">Skills</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.slice(0, 10).map((student, index) => (
                    <tr key={index} className="border-b border-border last:border-0">
                      <td className="py-3 text-foreground">{student.id}</td>
                      <td className="py-3 text-foreground">{student.name}</td>
                      <td className="py-3 text-muted-foreground">{student.department}</td>
                      <td className="py-3 text-muted-foreground">{student.year}</td>
                      <td className="py-3 text-muted-foreground">{student.cgpa}</td>
                      <td className="py-3 text-muted-foreground">
                        {student.skills.slice(0, 3).join(", ")}
                        {student.skills.length > 3 && "..."}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {previewData.length > 10 && (
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Showing 10 of {previewData.length} records
                </p>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
