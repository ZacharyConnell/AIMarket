import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Message, User } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate, getInitials } from "@/lib/utils";
import { Search, Send, Loader2, UserPlus, AlertCircle } from "lucide-react";

const MessagingPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [messageContent, setMessageContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Parse URL params to see if there's a selected user
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userParam = params.get("user");
    if (userParam) {
      setSelectedUserId(parseInt(userParam));
    }
  }, []);

  // Get all messages
  const { data: allMessages = [], isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
    enabled: !!user,
  });

  // Get conversation with selected user
  const { data: conversation = [], isLoading: conversationLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages/conversation", selectedUserId],
    enabled: !!user && !!selectedUserId,
  });

  // Get all users that the current user has messaged with
  const userIds = allMessages
    .reduce((ids, message) => {
      if (message.senderId === user?.id) {
        ids.add(message.receiverId);
      } else if (message.receiverId === user?.id) {
        ids.add(message.senderId);
      }
      return ids;
    }, new Set<number>());
  
  const userIdArray = Array.from(userIds);

  // Fetch user details
  const { data: userDetails = [] } = useQuery<User[]>({
    queryKey: ["/api/users/batch", userIdArray],
    enabled: !!user && userIdArray.length > 0,
  });

  // Get selected user details
  const selectedUser = userDetails.find(u => u.id === selectedUserId);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!user || !selectedUserId) throw new Error("Cannot send message");
      
      const messageData = {
        content,
        receiverId: selectedUserId,
        senderId: user.id,
      };
      
      const res = await apiRequest("POST", "/api/messages", messageData);
      return res.json();
    },
    onSuccess: () => {
      setMessageContent("");
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages/conversation", selectedUserId] });
      
      // Scroll to the bottom of the message list
      setTimeout(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    },
    onError: (error) => {
      toast({
        title: "Failed to send message",
        description: error.message || "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Mark message as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: number) => {
      const res = await apiRequest("PATCH", `/api/messages/${messageId}/read`, {});
      return res.json();
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages/conversation", selectedUserId] });
    },
  });

  // Mark unread messages as read when conversation is opened
  useEffect(() => {
    if (conversation.length > 0 && user) {
      conversation.forEach(message => {
        if (message.receiverId === user.id && !message.read) {
          markAsReadMutation.mutate(message.id);
        }
      });
    }
  }, [conversation, user]);

  // Scroll to bottom of messages when conversation changes
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageContent.trim() && selectedUserId) {
      sendMessageMutation.mutate(messageContent.trim());
    }
  };

  // Group and sort conversations
  const conversations = userIdArray.map(userId => {
    const userMessages = allMessages.filter(
      msg => (msg.senderId === userId && msg.receiverId === user?.id) || 
            (msg.receiverId === userId && msg.senderId === user?.id)
    );
    const lastMessage = userMessages.reduce((latest, msg) => 
      new Date(msg.createdAt) > new Date(latest.createdAt) ? msg : latest
    );
    const unreadCount = userMessages.filter(
      msg => msg.receiverId === user?.id && !msg.read
    ).length;
    const otherUser = userDetails.find(u => u.id === userId);
    
    return {
      userId,
      lastMessage,
      unreadCount,
      otherUser
    };
  }).sort((a, b) => 
    new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
  );

  // Filter conversations by search query
  const filteredConversations = conversations.filter(convo => {
    const userName = convo.otherUser?.fullName || convo.otherUser?.username || "";
    return userName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <AlertCircle className="mx-auto h-12 w-12 text-orange-500 mb-4" />
          <h1 className="text-xl font-semibold mb-2">Authentication Required</h1>
          <p className="text-gray-600 mb-4">You need to be logged in to access the messaging feature.</p>
          <Button>Login to Continue</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(90vh-12rem)]">
        {/* Conversation List */}
        <div className="md:col-span-1 border rounded-lg overflow-hidden bg-white">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search conversations..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <ScrollArea className="h-[calc(90vh-16rem)]">
            {messagesLoading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map((convo) => (
                <div 
                  key={convo.userId}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedUserId === convo.userId ? "bg-blue-50" : ""
                  }`}
                  onClick={() => setSelectedUserId(convo.userId)}
                >
                  <div className="flex items-center">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={convo.otherUser?.avatar} alt={convo.otherUser?.username} />
                        <AvatarFallback>
                          {getInitials(convo.otherUser?.fullName || convo.otherUser?.username || "")}
                        </AvatarFallback>
                      </Avatar>
                      {convo.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
                          {convo.unreadCount}
                        </div>
                      )}
                    </div>
                    <div className="ml-3 flex-1 overflow-hidden">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium truncate">
                          {convo.otherUser?.fullName || convo.otherUser?.username || "Unknown User"}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {new Date(convo.lastMessage.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className={`text-xs truncate ${convo.unreadCount > 0 ? "font-semibold text-gray-900" : "text-gray-500"}`}>
                        {convo.lastMessage.senderId === user.id ? "You: " : ""}
                        {convo.lastMessage.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-500">No conversations found</p>
                <Button className="mt-2" variant="outline" size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Start New Conversation
                </Button>
              </div>
            )}
          </ScrollArea>
        </div>
        
        {/* Messages */}
        <div className="md:col-span-2 border rounded-lg overflow-hidden flex flex-col bg-white">
          {selectedUserId ? (
            <>
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedUser?.avatar} alt={selectedUser?.username} />
                    <AvatarFallback>
                      {getInitials(selectedUser?.fullName || selectedUser?.username || "")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <h3 className="font-medium">
                      {selectedUser?.fullName || selectedUser?.username || "Unknown User"}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {selectedUser?.role || "User"}
                    </p>
                  </div>
                </div>
              </div>
              
              <ScrollArea className="flex-1 p-4 h-[calc(90vh-24rem)]">
                {conversationLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  </div>
                ) : conversation.length > 0 ? (
                  <div className="space-y-4">
                    {conversation.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === user.id ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.senderId === user.id
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.senderId === user.id
                              ? "text-blue-200"
                              : "text-gray-500"
                          }`}>
                            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messageEndRef} />
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No messages yet</p>
                    <p className="text-sm text-gray-400 mt-1">Send a message to start the conversation</p>
                  </div>
                )}
              </ScrollArea>
              
              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <Input
                    placeholder="Type a message..."
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    autoComplete="off"
                  />
                  <Button 
                    type="submit" 
                    disabled={!messageContent.trim() || sendMessageMutation.isPending}
                  >
                    {sendMessageMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Your Messages</h3>
              <p className="text-gray-500 max-w-sm mb-4">
                Select a conversation from the list to view messages or start a new conversation.
              </p>
              <Button variant="outline">
                <UserPlus className="h-4 w-4 mr-2" />
                Start New Conversation
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// MessageSquare component if Lucide doesn't export it
const MessageSquare = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default MessagingPage;
