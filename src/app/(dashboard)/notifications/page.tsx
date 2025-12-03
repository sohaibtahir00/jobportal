"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Check,
  Trash2,
  Loader2,
  CheckCheck,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, Button, Badge } from "@/components/ui";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const notificationTypeLabels: Record<string, string> = {
  APPLICATION_UPDATE: "Application",
  MESSAGE_RECEIVED: "Message",
  INTERVIEW_SCHEDULED: "Interview",
  INTERVIEW_RESCHEDULE_REQUEST: "Reschedule",
  ASSESSMENT_COMPLETED: "Assessment",
  JOB_MATCH: "Job Match",
  JOB_STATUS_CHANGE: "Job Status",
  PLACEMENT_UPDATE: "Placement",
  SYSTEM_ANNOUNCEMENT: "System",
};

const notificationTypeColors: Record<string, string> = {
  APPLICATION_UPDATE: "bg-blue-100 text-blue-700",
  MESSAGE_RECEIVED: "bg-green-100 text-green-700",
  INTERVIEW_SCHEDULED: "bg-purple-100 text-purple-700",
  INTERVIEW_RESCHEDULE_REQUEST: "bg-yellow-100 text-yellow-700",
  ASSESSMENT_COMPLETED: "bg-indigo-100 text-indigo-700",
  JOB_MATCH: "bg-pink-100 text-pink-700",
  JOB_STATUS_CHANGE: "bg-orange-100 text-orange-700",
  PLACEMENT_UPDATE: "bg-teal-100 text-teal-700",
  SYSTEM_ANNOUNCEMENT: "bg-gray-100 text-gray-700",
};

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchNotifications = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      });
      if (filter === "unread") {
        params.append("unreadOnly", "true");
      }
      if (typeFilter !== "all") {
        params.append("type", typeFilter);
      }

      const response = await fetch(`/api/notifications?${params}`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
        setPagination(data.pagination || null);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(currentPage);
  }, [filter, typeFilter, currentPage]);

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: "PATCH",
      });
      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
      });
      if (response.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: "DELETE",
      });
      if (response.ok) {
        const notification = notifications.find((n) => n.id === id);
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        if (notification && !notification.isRead) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    if (notification.link) {
      router.push(notification.link);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Notifications
              </h1>
              <p className="text-gray-600">
                {unreadCount > 0 ? (
                  <>
                    You have{" "}
                    <span className="font-semibold text-primary-600">
                      {unreadCount}
                    </span>{" "}
                    unread notification{unreadCount !== 1 ? "s" : ""}
                  </>
                ) : (
                  "You're all caught up!"
                )}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                className="flex items-center gap-2"
              >
                <CheckCheck className="h-4 w-4" />
                Mark all as read
              </Button>
            )}
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Read/Unread Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <div className="flex gap-2">
                    <Button
                      variant={filter === "all" ? "primary" : "outline"}
                      size="sm"
                      onClick={() => {
                        setFilter("all");
                        setCurrentPage(1);
                      }}
                    >
                      All
                    </Button>
                    <Button
                      variant={filter === "unread" ? "primary" : "outline"}
                      size="sm"
                      onClick={() => {
                        setFilter("unread");
                        setCurrentPage(1);
                      }}
                    >
                      Unread
                    </Button>
                  </div>
                </div>

                {/* Type Filter */}
                <div className="flex-1 sm:max-w-xs">
                  <select
                    value={typeFilter}
                    onChange={(e) => {
                      setTypeFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">All Types</option>
                    {Object.entries(notificationTypeLabels).map(
                      ([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading notifications...</p>
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <Card className="bg-white">
            <CardContent className="p-12 text-center">
              <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No notifications
              </h3>
              <p className="text-gray-600">
                {filter === "unread"
                  ? "You have no unread notifications"
                  : "You don't have any notifications yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`transition-all hover:shadow-md cursor-pointer ${
                    !notification.isRead
                      ? "bg-blue-50 border-blue-200"
                      : "bg-white"
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Unread indicator */}
                      <div className="flex-shrink-0 mt-1">
                        {!notification.isRead ? (
                          <div className="w-3 h-3 bg-primary-600 rounded-full" />
                        ) : (
                          <div className="w-3 h-3" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge
                                className={`text-xs ${
                                  notificationTypeColors[notification.type] ||
                                  "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {notificationTypeLabels[notification.type] ||
                                  notification.type}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {formatDistanceToNow(
                                  new Date(notification.createdAt),
                                  { addSuffix: true }
                                )}
                              </span>
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {notification.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {notification.message}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div
                          className="flex items-center gap-3 mt-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {notification.link && (
                            <Link
                              href={notification.link}
                              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                              onClick={() => {
                                if (!notification.isRead) {
                                  markAsRead(notification.id);
                                }
                              }}
                            >
                              View Details
                            </Link>
                          )}
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-sm text-gray-600 hover:text-gray-700 font-medium flex items-center gap-1"
                            >
                              <Check className="w-4 h-4" />
                              Mark as read
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 px-4">
                <p className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.totalPages} (
                  {pagination.totalCount} total)
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => p - 1)}
                    disabled={!pagination.hasPrev}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={!pagination.hasNext}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
