"use client"

import { useAppStore } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getRelativeTime } from "@/lib/utils"
import {
  CheckCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline"

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAppStore()

  const unreadCount = notifications.filter((n) => !n.read).length

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircleIcon className="h-6 w-6 text-green-600" />
      case "warning":
        return <ExclamationTriangleIcon className="h-6 w-6 text-orange-600" />
      case "error":
        return <XCircleIcon className="h-6 w-6 text-red-600" />
      default:
        return <InformationCircleIcon className="h-6 w-6 text-blue-600" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="mt-1 text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllNotificationsRead} variant="outline">
            Mark All as Read
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={`glass rounded-2xl p-5 transition-all hover:shadow-lg ${
              !notification.read ? "border-primary/50 bg-primary/5" : ""
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">{getIcon(notification.type)}</div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{notification.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
                  </div>
                  {!notification.read && (
                    <Button size="sm" variant="ghost" onClick={() => markNotificationRead(notification.id)}>
                      Mark as Read
                    </Button>
                  )}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{getRelativeTime(notification.timestamp)}</p>
              </div>
            </div>
          </Card>
        ))}

        {notifications.length === 0 && (
          <Card className="glass rounded-2xl p-12 text-center">
            <InformationCircleIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No notifications yet</p>
          </Card>
        )}
      </div>
    </div>
  )
}
