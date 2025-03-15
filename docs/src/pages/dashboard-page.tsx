import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Product, Project, Message } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  ArrowUpRight,
  User,
  MessageSquare,
  FileText,
  Loader2,
  Plus,
  MoveRight,
} from "lucide-react";
import { formatCurrency, formatDate, getInitials } from "@/lib/utils";

// Dummy data for stats
const salesData = [
  { name: "Jan", value: 1200 },
  { name: "Feb", value: 1900 },
  { name: "Mar", value: 1500 },
  { name: "Apr", value: 2400 },
  { name: "May", value: 2800 },
  { name: "Jun", value: 3100 },
];

const visitData = [
  { name: "Mon", value: 120 },
  { name: "Tue", value: 150 },
  { name: "Wed", value: 180 },
  { name: "Thu", value: 220 },
  { name: "Fri", value: 290 },
  { name: "Sat", value: 180 },
  { name: "Sun", value: 140 },
];

const categoryData = [
  { name: "Content Creation", value: 45 },
  { name: "Data Analysis", value: 25 },
  { name: "Image Generation", value: 20 },
  { name: "Chatbots", value: 10 },
];

const COLORS = ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B"];

const DashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch user's products
  const { data: userProducts = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/seller", user?.id],
    enabled: !!user?.id,
  });

  // Fetch user's projects
  const { data: userProjects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects/user"],
    enabled: !!user?.id,
  });

  // Fetch user's messages
  const { data: userMessages = [], isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
    enabled: !!user?.id,
  });

  const stats = [
    {
      title: "Total Products",
      value: userProducts.length,
      icon: <Package className="h-5 w-5" />,
      change: "+12.5%",
      trend: "up",
    },
    {
      title: "Total Sales",
      value: "$4,385",
      icon: <ShoppingCart className="h-5 w-5" />,
      change: "+24.3%",
      trend: "up",
    },
    {
      title: "Active Users",
      value: "214",
      icon: <Users className="h-5 w-5" />,
      change: "+10.2%",
      trend: "up",
    },
    {
      title: "Revenue",
      value: "$12,658",
      icon: <DollarSign className="h-5 w-5" />,
      change: "+18.7%",
      trend: "up",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome back, {user?.fullName || user?.username}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/products">
            <Button variant="outline">
              Browse Products
            </Button>
          </Link>
          <Link href="/request-project">
            <Button>
              Request Project
            </Button>
          </Link>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="bg-blue-100 p-2 rounded-md">
                      {stat.icon}
                    </div>
                    <div className="flex items-center text-sm font-medium text-gray-500">
                      <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                        {stat.change}
                      </span>
                      <ArrowUpRight className={`ml-1 h-4 w-4 ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>Monthly sales performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={salesData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#3B82F6" 
                        strokeWidth={2}
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Product Categories</CardTitle>
                <CardDescription>Sales by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Website Visits</CardTitle>
                <CardDescription>Visits by day of week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={visitData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="products">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Products</h2>
            <Link href="/products/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Product
              </Button>
            </Link>
          </div>
          
          {productsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : userProducts.length > 0 ? (
            <div className="space-y-4">
              {userProducts.map(product => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-48 h-32">
                      <img
                        src={product.image || "https://images.unsplash.com/photo-1579403124614-197f69d8187b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                            {product.description}
                          </p>
                        </div>
                        <div className="text-blue-600 font-bold">
                          {formatCurrency(product.price)}
                        </div>
                      </div>
                      
                      <div className="flex items-center mt-3 space-x-2">
                        <Badge variant="outline">{product.category}</Badge>
                        {product.featured && (
                          <Badge className="bg-purple-500">Featured</Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-sm text-gray-500">
                          Added {formatDate(product.createdAt)}
                        </span>
                        <div className="flex space-x-2">
                          <Link href={`/products/${product.id}/edit`}>
                            <Button size="sm" variant="outline">Edit</Button>
                          </Link>
                          <Link href={`/products/${product.id}`}>
                            <Button size="sm">View</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              
              <div className="mt-4 text-center">
                <Button variant="outline">Load More</Button>
              </div>
            </div>
          ) : (
            <Card className="p-8 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium">No products yet</h3>
              <p className="text-gray-500 mt-2 mb-6">
                Create your first AI product to start selling on the marketplace.
              </p>
              <Link href="/products/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Product
                </Button>
              </Link>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="projects">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Projects</h2>
            <Link href="/request-project">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Project Request
              </Button>
            </Link>
          </div>
          
          {projectsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : userProjects.length > 0 ? (
            <div className="space-y-4">
              {userProjects.map(project => (
                <Card key={project.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{project.title}</h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {project.description}
                        </p>
                      </div>
                      <Badge className={
                        project.status === "open" ? "bg-blue-500" : 
                        project.status === "in-progress" ? "bg-yellow-500" : 
                        project.status === "completed" ? "bg-green-500" : 
                        "bg-gray-500"
                      }>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-500">BUDGET</p>
                        <p className="font-medium">{project.budget ? formatCurrency(project.budget) : "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">DEADLINE</p>
                        <p className="font-medium">{project.deadline || "Flexible"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">CREATED</p>
                        <p className="font-medium">{formatDate(project.createdAt)}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end space-x-2">
                      <Button size="sm" variant="outline">View Proposals</Button>
                      <Link href={`/projects/${project.id}`}>
                        <Button size="sm">View Details</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium">No project requests yet</h3>
              <p className="text-gray-500 mt-2 mb-6">
                Create a project request to find AI developers for your custom needs.
              </p>
              <Link href="/request-project">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Request Project
                </Button>
              </Link>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="messages">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Messages</h2>
            <Link href="/messages">
              <Button>
                View All Messages
                <MoveRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {messagesLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : userMessages.length > 0 ? (
            <div className="space-y-4">
              {userMessages.slice(0, 5).map(message => (
                <Card key={message.id} className={message.read ? "" : "border-l-4 border-blue-500"}>
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <Avatar className="h-10 w-10 mr-4">
                        <AvatarFallback>
                          {message.senderId === user?.id ? "ME" : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold">
                            {message.senderId === user?.id ? "You" : "User"}
                            <span className="mx-2 text-gray-300">→</span>
                            {message.receiverId === user?.id ? "You" : "User"}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-gray-700 mt-1">{message.content}</p>
                        
                        <div className="mt-3 flex justify-end">
                          <Link href={`/messages?user=${message.senderId === user?.id ? message.receiverId : message.senderId}`}>
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Reply
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium">No messages yet</h3>
              <p className="text-gray-500 mt-2 mb-6">
                Start communicating with product sellers or buyers.
              </p>
              <Link href="/messages">
                <Button>
                  Go to Messages
                </Button>
              </Link>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;
