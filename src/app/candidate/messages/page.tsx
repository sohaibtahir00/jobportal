"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Archive,
  Trash2,
  Star,
  Clock,
  CheckCheck,
  Loader2,
  Briefcase,
} from "lucide-react";
import { Button, Badge, Card, CardContent, Input } from "@/components/ui";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "employer" | "candidate";
  content: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: string;
  employerName: string;
  companyName: string;
  jobTitle: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
  starred: boolean;
  archived: boolean;
}

export default function CandidateMessagesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | "starred" | "archived">("all");

  // Redirect if not logged in or not candidate
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/candidate/messages");
    }
    if (status === "authenticated" && session?.user?.role !== "CANDIDATE") {
      router.push("/");
    }
  }, [status, session, router]);

  // Load conversations
  useEffect(() => {
    const loadConversations = async () => {
      try {
        // Mock data
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockConversations: Conversation[] = [
          {
            id: "1",
            employerName: "Jane Smith",
            companyName: "TechCorp AI",
            jobTitle: "Senior ML Engineer",
            lastMessage: "We'd like to schedule an interview for next week. Are you available?",
            lastMessageTime: "2025-01-09T14:30:00",
            unreadCount: 2,
            starred: true,
            archived: false,
            messages: [
              {
                id: "m1",
                senderId: "emp1",
                senderName: "Jane Smith",
                senderRole: "employer",
                content: "Hi! We reviewed your application and are impressed with your background.",
                timestamp: "2025-01-08T10:00:00",
                read: true,
              },
              {
                id: "m2",
                senderId: "cand1",
                senderName: "You",
                senderRole: "candidate",
                content: "Thank you! I'm very interested in this opportunity.",
                timestamp: "2025-01-08T11:30:00",
                read: true,
              },
              {
                id: "m3",
                senderId: "emp1",
                senderName: "Jane Smith",
                senderRole: "employer",
                content: "We'd like to schedule an interview for next week. Are you available?",
                timestamp: "2025-01-09T14:30:00",
                read: false,
              },
            ],
          },
          {
            id: "2",
            employerName: "Mike Johnson",
            companyName: "DataStart Inc",
            jobTitle: "Backend Engineer",
            lastMessage: "Thanks for your interest. We'll be in touch soon.",
            lastMessageTime: "2025-01-08T16:45:00",
            unreadCount: 0,
            starred: false,
            archived: false,
            messages: [
              {
                id: "m4",
                senderId: "emp2",
                senderName: "Mike Johnson",
                senderRole: "employer",
                content: "Thanks for your interest. We'll be in touch soon.",
                timestamp: "2025-01-08T16:45:00",
                read: true,
              },
            ],
          },
          {
            id: "3",
            employerName: "Sarah Lee",
            companyName: "FinTech Solutions",
            jobTitle: "Full Stack Developer",
            lastMessage: "Could you send over your portfolio?",
            lastMessageTime: "2025-01-07T09:15:00",
            unreadCount: 1,
            starred: false,
            archived: false,
            messages: [
              {
                id: "m5",
                senderId: "emp3",
                senderName: "Sarah Lee",
                senderRole: "employer",
                content: "Could you send over your portfolio?",
                timestamp: "2025-01-07T09:15:00",
                read: false,
              },
            ],
          },
        ];

        setConversations(mockConversations);
        if (mockConversations.length > 0) {
          setActiveConversation(mockConversations[0].id);
        }
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    };

    if (status === "authenticated") {
      loadConversations();
    }
  }, [status]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !activeConversation) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: "cand1",
      senderName: "You",
      senderRole: "candidate",
      content: messageText,
      timestamp: new Date().toISOString(),
      read: true,
    };

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeConversation
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessage: messageText,
              lastMessageTime: new Date().toISOString(),
            }
          : conv
      )
    );

    setMessageText("");
  };

  const toggleStar = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId ? { ...conv, starred: !conv.starred } : conv
      )
    );
  };

  const toggleArchive = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId ? { ...conv, archived: !conv.archived } : conv
      )
    );
  };

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      searchQuery === "" ||
      conv.employerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && conv.unreadCount > 0) ||
      (filter === "starred" && conv.starred) ||
      (filter === "archived" && conv.archived);

    return matchesSearch && matchesFilter && (filter !== "archived" ? !conv.archived : true);
  });

  const activeConv = conversations.find((c) => c.id === activeConversation);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary-600" />
          <p className="mt-4 text-secondary-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <h1 className="mb-2 text-3xl font-bold text-secondary-900">Messages</h1>
            <p className="text-secondary-600">Communicate with employers</p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Conversations List */}
            <Card className="lg:col-span-1">
              <CardContent className="p-0">
                {/* Search & Filters */}
                <div className="border-b border-secondary-200 p-4">
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
                    <Input
                      type="text"
                      placeholder="Search conversations..."
                      className="pl-9 text-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setFilter("all")}
                      className={`rounded px-3 py-1 text-xs font-medium ${
                        filter === "all"
                          ? "bg-primary-600 text-white"
                          : "bg-secondary-100 text-secondary-700 hover:bg-secondary-200"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilter("unread")}
                      className={`rounded px-3 py-1 text-xs font-medium ${
                        filter === "unread"
                          ? "bg-primary-600 text-white"
                          : "bg-secondary-100 text-secondary-700 hover:bg-secondary-200"
                      }`}
                    >
                      Unread
                    </button>
                    <button
                      onClick={() => setFilter("starred")}
                      className={`rounded px-3 py-1 text-xs font-medium ${
                        filter === "starred"
                          ? "bg-primary-600 text-white"
                          : "bg-secondary-100 text-secondary-700 hover:bg-secondary-200"
                      }`}
                    >
                      Starred
                    </button>
                  </div>
                </div>

                {/* Conversation List */}
                <div className="max-h-[600px] overflow-y-auto">
                  {filteredConversations.length === 0 ? (
                    <div className="p-8 text-center">
                      <MessageSquare className="mx-auto mb-3 h-12 w-12 text-secondary-300" />
                      <p className="text-sm text-secondary-600">No conversations found</p>
                    </div>
                  ) : (
                    filteredConversations.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => setActiveConversation(conv.id)}
                        className={`w-full border-b border-secondary-100 p-4 text-left transition-colors hover:bg-secondary-50 ${
                          activeConversation === conv.id ? "bg-primary-50" : ""
                        }`}
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <div className="flex-1">
                            <div className="mb-1 flex items-center gap-2">
                              <h3 className="font-semibold text-secondary-900">
                                {conv.employerName}
                              </h3>
                              {conv.starred && (
                                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                              )}
                            </div>
                            <p className="mb-1 text-xs text-secondary-600">
                              {conv.companyName} • {conv.jobTitle}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-xs text-secondary-500">
                              {formatTime(conv.lastMessageTime)}
                            </span>
                            {conv.unreadCount > 0 && (
                              <Badge variant="primary" size="sm">
                                {conv.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="truncate text-sm text-secondary-600">{conv.lastMessage}</p>
                      </button>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Active Conversation */}
            <Card className="lg:col-span-2">
              <CardContent className="p-0">
                {activeConv ? (
                  <>
                    {/* Conversation Header */}
                    <div className="flex items-center justify-between border-b border-secondary-200 p-4">
                      <div>
                        <h2 className="mb-1 font-bold text-secondary-900">
                          {activeConv.employerName}
                        </h2>
                        <p className="flex items-center gap-2 text-sm text-secondary-600">
                          <Briefcase className="h-4 w-4" />
                          {activeConv.companyName} • {activeConv.jobTitle}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleStar(activeConv.id)}
                        >
                          <Star
                            className={`h-4 w-4 ${
                              activeConv.starred ? "fill-yellow-500 text-yellow-500" : ""
                            }`}
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleArchive(activeConv.id)}
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="max-h-[400px] space-y-4 overflow-y-auto p-4">
                      {activeConv.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.senderRole === "candidate" ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              msg.senderRole === "candidate"
                                ? "bg-primary-600 text-white"
                                : "bg-secondary-100 text-secondary-900"
                            }`}
                          >
                            <p className="mb-1 text-sm">{msg.content}</p>
                            <div className="flex items-center gap-1 text-xs opacity-75">
                              <Clock className="h-3 w-3" />
                              {formatTime(msg.timestamp)}
                              {msg.senderRole === "candidate" && msg.read && (
                                <CheckCheck className="ml-1 h-3 w-3" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="border-t border-secondary-200 p-4">
                      <div className="flex gap-3">
                        <Button variant="ghost" size="sm">
                          <Paperclip className="h-5 w-5" />
                        </Button>
                        <Input
                          type="text"
                          placeholder="Type a message..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        />
                        <Button
                          variant="primary"
                          onClick={handleSendMessage}
                          disabled={!messageText.trim()}
                        >
                          <Send className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex h-[500px] items-center justify-center">
                    <div className="text-center">
                      <MessageSquare className="mx-auto mb-3 h-16 w-16 text-secondary-300" />
                      <p className="text-secondary-600">Select a conversation to start messaging</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
