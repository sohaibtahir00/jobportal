"use client";

import { useState, useEffect, useRef } from "react";
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
  User,
} from "lucide-react";
import { Button, Badge, Card, CardContent, Input } from "@/components/ui";
import { api } from "@/lib/api";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  senderImage: string | null;
  receiverId: string;
  receiverName: string;
  receiverRole: string;
  receiverImage: string | null;
  content: string;
  status: string;
  readAt: string | null;
  createdAt: string;
  isCurrent?: boolean;
}

interface Participant {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string | null;
}

interface Conversation {
  participant: Participant;
  lastMessage: {
    id: string;
    subject: string | null;
    content: string;
    status: string;
    createdAt: string;
    isSent: boolean;
  };
  unreadCount: number;
  totalMessages: number;
}

interface ConversationThread {
  messages: Message[];
  totalCount: number;
  participants: Participant[];
}

export default function CandidateMessagesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentThread, setCurrentThread] = useState<ConversationThread | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    if (status === "authenticated") {
      loadConversations();
    }
  }, [status]);

  // Load thread when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      loadThread(activeConversation);
    }
  }, [activeConversation]);

  // Auto-scroll to bottom when thread changes
  useEffect(() => {
    scrollToBottom();
  }, [currentThread]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await api.get("/api/messages/conversations");
      const data = response.data;

      setConversations(data.conversations || []);
      if (data.conversations && data.conversations.length > 0) {
        setActiveConversation(data.conversations[0].participant.id);
      }
    } catch (err: any) {
      console.error("Failed to load conversations:", err);
      setError(err.response?.data?.error || "Failed to load conversations");
    } finally {
      setIsLoading(false);
    }
  };

  const loadThread = async (participantId: string) => {
    try {
      // Find a message from this conversation to get the thread
      const conversation = conversations.find(c => c.participant.id === participantId);
      if (!conversation) return;

      const response = await api.get(`/api/messages/${conversation.lastMessage.id}`);
      const data = response.data;

      setCurrentThread(data.thread);
    } catch (err: any) {
      console.error("Failed to load thread:", err);
      setError(err.response?.data?.error || "Failed to load messages");
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !activeConversation || isSending) return;

    try {
      setIsSending(true);
      setError("");

      await api.post("/api/messages", {
        receiverId: activeConversation,
        content: messageText.trim(),
      });

      setMessageText("");

      // Reload the thread to show new message
      await loadThread(activeConversation);
      // Reload conversations to update last message
      await loadConversations();
      // Set active conversation again
      setActiveConversation(activeConversation);
    } catch (err: any) {
      console.error("Failed to send message:", err);
      setError(err.response?.data?.error || "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      searchQuery === "" ||
      conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.participant.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && conv.unreadCount > 0);

    return matchesSearch && matchesFilter;
  });

  const activeConv = conversations.find((c) => c.participant.id === activeConversation);

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

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

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
                  </div>
                </div>

                {/* Conversation List */}
                <div className="max-h-[600px] overflow-y-auto">
                  {filteredConversations.length === 0 ? (
                    <div className="p-8 text-center">
                      <MessageSquare className="mx-auto mb-3 h-12 w-12 text-secondary-300" />
                      <p className="text-sm text-secondary-600">
                        {conversations.length === 0
                          ? "No messages yet"
                          : "No conversations found"}
                      </p>
                      <p className="mt-2 text-xs text-secondary-500">
                        Apply to jobs to start conversations with employers
                      </p>
                    </div>
                  ) : (
                    filteredConversations.map((conv) => (
                      <button
                        key={conv.participant.id}
                        onClick={() => setActiveConversation(conv.participant.id)}
                        className={`w-full border-b border-secondary-100 p-4 text-left transition-colors hover:bg-secondary-50 ${
                          activeConversation === conv.participant.id ? "bg-primary-50" : ""
                        }`}
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <div className="flex-1 flex items-start gap-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                              {conv.participant.image ? (
                                <img
                                  src={conv.participant.image}
                                  alt={conv.participant.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <User className="w-5 h-5 text-primary-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="mb-1 flex items-center gap-2">
                                <h3 className="font-semibold text-secondary-900 truncate">
                                  {conv.participant.name}
                                </h3>
                                <Badge
                                  variant={conv.participant.role === "EMPLOYER" ? "secondary" : "primary"}
                                  size="sm"
                                  className="text-xs flex-shrink-0"
                                >
                                  {conv.participant.role === "EMPLOYER" ? "Employer" : conv.participant.role}
                                </Badge>
                              </div>
                              <p className="text-xs text-secondary-600 truncate">
                                {conv.participant.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1 ml-2">
                            <span className="text-xs text-secondary-500">
                              {formatTime(conv.lastMessage.createdAt)}
                            </span>
                            {conv.unreadCount > 0 && (
                              <Badge variant="primary" size="sm">
                                {conv.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="truncate text-sm text-secondary-600 pl-13">
                          {conv.lastMessage.isSent ? "You: " : ""}
                          {conv.lastMessage.content}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Active Conversation */}
            <Card className="lg:col-span-2">
              <CardContent className="p-0">
                {activeConv && currentThread ? (
                  <>
                    {/* Conversation Header */}
                    <div className="flex items-center justify-between border-b border-secondary-200 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                          {activeConv.participant.image ? (
                            <img
                              src={activeConv.participant.image}
                              alt={activeConv.participant.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-6 h-6 text-primary-600" />
                          )}
                        </div>
                        <div>
                          <h2 className="mb-1 font-bold text-secondary-900">
                            {activeConv.participant.name}
                          </h2>
                          <p className="flex items-center gap-2 text-sm text-secondary-600">
                            <Briefcase className="h-4 w-4" />
                            {activeConv.participant.role === "EMPLOYER" ? "Employer" : activeConv.participant.role}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="max-h-[400px] space-y-4 overflow-y-auto p-4">
                      {currentThread.messages.map((msg) => {
                        const isSent = msg.senderId === session?.user?.id;
                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isSent ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                isSent
                                  ? "bg-primary-600 text-white"
                                  : "bg-secondary-100 text-secondary-900"
                              }`}
                            >
                              {!isSent && (
                                <p className="text-xs font-semibold mb-1 opacity-75">
                                  {msg.senderName}
                                </p>
                              )}
                              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                              <div className="flex items-center gap-1 text-xs opacity-75 mt-1">
                                <Clock className="h-3 w-3" />
                                {formatTime(msg.createdAt)}
                                {isSent && msg.status === "READ" && (
                                  <CheckCheck className="ml-1 h-3 w-3" />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="border-t border-secondary-200 p-4">
                      <div className="flex gap-3">
                        <Input
                          type="text"
                          placeholder="Type a message..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          disabled={isSending}
                          className="flex-1"
                        />
                        <Button
                          variant="primary"
                          onClick={handleSendMessage}
                          disabled={!messageText.trim() || isSending}
                        >
                          {isSending ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Send className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex h-[500px] items-center justify-center">
                    <div className="text-center">
                      <MessageSquare className="mx-auto mb-3 h-16 w-16 text-secondary-300" />
                      <p className="text-secondary-600">
                        {conversations.length === 0
                          ? "No conversations yet"
                          : "Select a conversation to start messaging"}
                      </p>
                      {conversations.length === 0 && (
                        <p className="mt-2 text-sm text-secondary-500">
                          Apply to jobs to start conversations with employers
                        </p>
                      )}
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
