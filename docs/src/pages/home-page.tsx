import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Product, News, InsertWaitlist } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";
import { StarIcon, StarHalfIcon, SearchIcon, ShieldCheckIcon, MessageSquareIcon, CreditCardIcon, TrendingUpIcon, UsersIcon } from "lucide-react";

const HomePage = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [waitlistForm, setWaitlistForm] = useState<InsertWaitlist>({
    email: "",
    name: "",
    interest: "",
    newsletter: false
  });

  // Fetch featured products
  const { data: featuredProducts = [] } = useQuery<Product[]>({
    queryKey: ["/api/products/featured"],
  });

  // Fetch news
  const { data: newsList = [] } = useQuery<News[]>({
    queryKey: ["/api/news"],
  });

  // Handle waitlist submission
  const waitlistMutation = useMutation({
    mutationFn: async (data: InsertWaitlist) => {
      const res = await apiRequest("POST", "/api/waitlist", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You've been added to our waitlist.",
      });
      setIsWaitlistModalOpen(false);
      setEmail("");
      setWaitlistForm({
        email: "",
        name: "",
        interest: "",
        newsletter: false
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to join waitlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleInitialEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWaitlistForm(prev => ({ ...prev, email }));
    setIsWaitlistModalOpen(true);
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    waitlistMutation.mutate(waitlistForm);
  };

  const handleWaitlistInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWaitlistForm(prev => ({ ...prev, [name]: value }));
  };

  const handleInterestChange = (value: string) => {
    setWaitlistForm(prev => ({ ...prev, interest: value }));
  };

  const handleNewsletterChange = (checked: boolean) => {
    setWaitlistForm(prev => ({ ...prev, newsletter: checked }));
  };

  const features = [
    {
      icon: <SearchIcon className="h-6 w-6 text-white" />,
      title: "Powerful Discovery",
      description: "Find exactly what you need with our advanced search and filtering system designed specifically for AI products."
    },
    {
      icon: <ShieldCheckIcon className="h-6 w-6 text-white" />,
      title: "Verified Products",
      description: "Every product undergoes a thorough verification process ensuring quality, security and performance."
    },
    {
      icon: <MessageSquareIcon className="h-6 w-6 text-white" />,
      title: "Direct Communication",
      description: "Connect directly with creators through our integrated messaging system to discuss custom solutions."
    },
    {
      icon: <CreditCardIcon className="h-6 w-6 text-white" />,
      title: "Secure Payments",
      description: "Our secure payment system ensures safe transactions with escrow protection for both buyers and sellers."
    },
    {
      icon: <TrendingUpIcon className="h-6 w-6 text-white" />,
      title: "Analytics Dashboard",
      description: "Track your sales, views, and engagement with comprehensive analytics tools designed for AI products."
    },
    {
      icon: <UsersIcon className="h-6 w-6 text-white" />,
      title: "Community Support",
      description: "Join a community of AI enthusiasts, creators, and businesses to share insights and grow together."
    }
  ];

  const testimonials = [
    {
      content: "As a content creator, the AI tools I found on this marketplace have revolutionized my workflow. I'm saving hours each day and producing better content than ever before.",
      author: "Emma Rodriguez",
      role: "Digital Content Creator"
    },
    {
      content: "I was skeptical about AI products, but the quality and support from creators on this platform changed my mind. Now I can't imagine running my business without these tools.",
      author: "Marcus Thompson",
      role: "Small Business Owner"
    },
    {
      content: "As a developer selling my AI solutions, this marketplace provides the perfect audience. The platform handles payments and marketing, letting me focus on what I do best - building great AI tools.",
      author: "Priya Sharma",
      role: "AI Developer"
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                Discover the <span className="text-purple-400">Future</span> of AI Products
              </h1>
              <p className="mt-3 text-base text-blue-100 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Join our exclusive marketplace connecting AI creators with those seeking innovative solutions. Be among the first to access groundbreaking technology.
              </p>
              <div className="mt-8 sm:mx-auto sm:max-w-lg sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <form className="sm:flex" onSubmit={handleInitialEmailSubmit}>
                    <div>
                      <label htmlFor="email-address" className="sr-only">Email address</label>
                      <Input
                        id="email-address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder="Enter your email"
                        className="w-full sm:w-60 text-gray-900 rounded-l-md px-5 py-3 placeholder-gray-500 focus:outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="mt-3 sm:mt-0 w-full sm:w-auto bg-purple-500 hover:bg-purple-600 rounded-r-md sm:px-10 text-base font-medium"
                    >
                      Join Waitlist
                    </Button>
                  </form>
                </div>
              </div>
              <div className="mt-6 text-sm text-blue-100">
                <p>Already have access? <Link href="/auth"><a className="font-medium text-white hover:underline">Sign in</a></Link></p>
              </div>
            </div>
            <div className="mt-12 sm:mt-16 lg:mt-0 lg:col-span-6">
              <div className="relative h-64 sm:h-72 md:h-96 lg:h-full">
                <img 
                  className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-xl" 
                  src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1650&q=80" 
                  alt="AI technology illustration" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Features</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">Everything you need to succeed</p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">Connect, discover, and transact in the most innovative AI marketplace.</p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                          {feature.icon}
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{feature.title}</h3>
                      <p className="mt-5 text-base text-gray-500">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div id="products" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Featured Products</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">Discover Innovation</p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">Explore our handpicked selection of groundbreaking AI products.</p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="h-48 w-full relative">
                    <img 
                      className="w-full h-full object-cover" 
                      src={product.image || "https://images.unsplash.com/photo-1579403124614-197f69d8187b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"} 
                      alt={product.name} 
                    />
                    {product.featured && (
                      <div className="absolute top-0 right-0 mt-2 mr-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-md font-medium">
                        Featured
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                      <span className="text-blue-600 font-bold">{formatCurrency(product.price)}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">{product.description}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="flex items-center text-yellow-400">
                          <StarIcon className="h-4 w-4 fill-current" />
                          <StarIcon className="h-4 w-4 fill-current" />
                          <StarIcon className="h-4 w-4 fill-current" />
                          <StarIcon className="h-4 w-4 fill-current" />
                          <StarHalfIcon className="h-4 w-4 fill-current" />
                        </div>
                        <span className="ml-1 text-sm text-gray-500">(4.5)</span>
                      </div>
                    </div>
                    <Link href={`/products/${product.id}`}>
                      <Button 
                        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4"
                      >
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              // Placeholder cards
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="h-48 w-full bg-gray-200 animate-pulse" />
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-5/6 mb-6 animate-pulse" />
                    <div className="mt-4 h-10 bg-gray-200 rounded animate-pulse" />
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="mt-12 text-center">
            <Link href="/products">
              <Button className="px-6 py-3 bg-blue-600 hover:bg-blue-700">
                Browse All Products
                <svg className="ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* News Feed Section */}
      <div id="ai-news" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">AI News</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">Stay informed</p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">The latest developments in the world of AI technology.</p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {newsList.length > 0 ? (
              newsList.map((item) => (
                <Card key={item.id} className="overflow-hidden flex flex-col md:flex-row">
                  <div className="md:w-2/5">
                    <img 
                      className="h-56 md:h-full w-full object-cover" 
                      src={item.image || "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"} 
                      alt={item.title} 
                    />
                  </div>
                  <CardContent className="p-6 md:w-3/5">
                    <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h3 className="mt-2 text-xl font-semibold text-gray-900 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-base text-gray-500 line-clamp-3">
                      {item.content}
                    </p>
                    <div className="mt-6 flex items-center">
                      <div className="flex-shrink-0">
                        <span className="sr-only">Publication Date</span>
                        <svg className="text-gray-400 h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span className="inline-block text-sm text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="ml-3">
                        <Link href={`/news/${item.id}`}>
                          <a className="text-sm font-medium text-blue-600 hover:text-blue-500">
                            Read more<span className="sr-only"> about {item.title}</span>
                          </a>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              // Placeholder news cards
              Array.from({ length: 2 }).map((_, index) => (
                <Card key={index} className="overflow-hidden flex flex-col md:flex-row">
                  <div className="md:w-2/5 bg-gray-200 h-56 md:h-auto animate-pulse" />
                  <CardContent className="p-6 md:w-3/5">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2 animate-pulse" />
                    <div className="h-6 bg-gray-200 rounded w-full mb-4 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-4/5 mb-4 animate-pulse" />
                    <div className="mt-4 flex">
                      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                      <div className="ml-auto h-4 bg-gray-200 rounded w-20 animate-pulse" />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="mt-12 text-center">
            <Link href="/news">
              <a className="inline-flex items-center text-base font-medium text-blue-600 hover:text-blue-500">
                View All News
                <svg className="ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </Link>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Testimonials</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">What our users say</p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="pt-0">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 italic mb-4">{testimonial.content}</p>
                  <div className="flex items-center mt-4">
                    <div className="h-10 w-10 rounded-full bg-gray-200 mr-4" />
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{testimonial.author}</h4>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">About Us</h2>
              <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
                Building the future of AI commerce
              </p>
              <p className="mt-4 text-lg text-gray-500">
                We created AIMarket with a simple mission: to connect brilliant AI creators with the businesses and individuals who need their solutions.
              </p>
              <div className="mt-6">
                <div className="text-base text-gray-500">
                  <p>Our platform ensures:</p>
                  <ul className="mt-4 ml-4 space-y-2">
                    <li className="flex items-start">
                      <svg className="text-green-500 h-5 w-5 mt-1 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Quality assurance through rigorous verification</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="text-green-500 h-5 w-5 mt-1 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Fair pricing and transparent fee structures</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="text-green-500 h-5 w-5 mt-1 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Protection for both buyers and sellers</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="text-green-500 h-5 w-5 mt-1 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>An ethical approach to AI development and implementation</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6">
                  <Link href="/about">
                    <a className="text-base font-medium text-blue-600 hover:text-blue-500">
                      Learn more about our story <svg className="inline-block ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-10 lg:mt-0">
              <div className="relative mx-auto h-80 w-full rounded-lg shadow-xl overflow-hidden lg:h-auto">
                <img 
                  className="w-full h-full object-cover" 
                  src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1400&q=80" 
                  alt="Our team" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to explore the future?</span>
            <span className="block text-blue-300">Join our waitlist today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link href="#top">
                <Button
                  variant="default"
                  onClick={() => setIsWaitlistModalOpen(true)}
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-100"
                >
                  Get Started
                </Button>
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link href="/about">
                <Button
                  variant="outline"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 bg-opacity-60 hover:bg-opacity-70"
                >
                  Learn more
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Waitlist Modal */}
      <Dialog open={isWaitlistModalOpen} onOpenChange={setIsWaitlistModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Join Our Waitlist</DialogTitle>
            <DialogDescription>
              Sign up to be among the first to access our AI marketplace. We'll notify you when we launch.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleWaitlistSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={waitlistForm.name}
                  onChange={handleWaitlistInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email-modal">Email address</Label>
                <Input
                  id="email-modal"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={waitlistForm.email}
                  onChange={handleWaitlistInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="interest">What interests you most?</Label>
                <Select
                  value={waitlistForm.interest}
                  onValueChange={handleInterestChange}
                >
                  <SelectTrigger id="interest">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buying">Purchasing AI Products</SelectItem>
                    <SelectItem value="selling">Selling AI Products</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                    <SelectItem value="learning">Learning About AI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <Checkbox
                    id="newsletter"
                    checked={waitlistForm.newsletter}
                    onCheckedChange={handleNewsletterChange}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <Label htmlFor="newsletter" className="font-medium text-gray-700">Subscribe to newsletter</Label>
                  <p className="text-gray-500">Get the latest updates on AI technology and marketplace news.</p>
                </div>
              </div>
            </div>
            <DialogFooter className="sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsWaitlistModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={waitlistMutation.isPending}>
                {waitlistMutation.isPending ? "Submitting..." : "Join Waitlist"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HomePage;
