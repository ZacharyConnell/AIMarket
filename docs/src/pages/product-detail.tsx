import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Product, User } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StarIcon, MessageSquare, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { formatCurrency, getInitials, formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const [, params] = useRoute("/products/:id");
  const { toast } = useToast();
  const { user } = useAuth();
  const [messageContent, setMessageContent] = useState("");
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSubmittingMessage, setIsSubmittingMessage] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const productId = params?.id ? parseInt(params.id) : undefined;

  // Fetch product details
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
    enabled: !!productId,
  });

  // Fetch seller details if product is loaded
  const { data: seller } = useQuery<User>({
    queryKey: [`/api/users/${product?.sellerId}`],
    enabled: !!product?.sellerId,
  });

  const handleSendMessage = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to contact the seller.",
        variant: "destructive",
      });
      return;
    }

    if (!messageContent.trim()) {
      toast({
        title: "Message required",
        description: "Please enter a message to the seller.",
        variant: "destructive",
      });
      return;
    }

    if (!product || !seller) return;

    setIsSubmittingMessage(true);

    try {
      // In a real app, we would send the message to the server
      // For now, we'll just simulate the request
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Message sent",
        description: `Your message has been sent to ${seller.username}.`,
      });
      setMessageContent("");
      setIsMessageModalOpen(false);
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingMessage(false);
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to purchase this product.",
        variant: "destructive",
      });
      return;
    }

    if (!product) return;

    setIsProcessingPayment(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Purchase successful!",
        description: `You have successfully purchased ${product.name}.`,
      });
      setIsPaymentModalOpen(false);
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
        <p className="text-gray-600 mb-6">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/products">
          <Button>Browse All Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/products">
          <Button variant="link" className="p-0 text-gray-600">
            <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Products
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Product Image and Details */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-xl overflow-hidden shadow-md">
            <div className="relative h-64 sm:h-96 w-full bg-gray-100">
              <img
                src={product.image || "https://images.unsplash.com/photo-1579403124614-197f69d8187b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.featured && (
                <Badge className="absolute top-4 right-4 bg-purple-500">
                  Featured
                </Badge>
              )}
            </div>
            
            <div className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                  <div className="mt-2 flex items-center">
                    <div className="flex items-center text-yellow-400">
                      <StarIcon className="h-5 w-5 fill-current" />
                      <StarIcon className="h-5 w-5 fill-current" />
                      <StarIcon className="h-5 w-5 fill-current" />
                      <StarIcon className="h-5 w-5 fill-current" />
                      <StarIcon className="h-5 w-5 fill-current text-gray-300" />
                    </div>
                    <span className="ml-2 text-sm text-gray-500">(4.0) • 24 Reviews</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(product.price)}
                </div>
              </div>
              
              <Tabs defaultValue="description" className="mt-8">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="py-4">
                  <p className="text-gray-700 whitespace-pre-line">
                    {product.description}
                  </p>
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{product.category}</Badge>
                      {product.tags && product.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Added</h3>
                    <p className="text-gray-700">
                      {formatDate(product.createdAt)}
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="features" className="py-4">
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <ShieldCheck className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                      <span>Verified by our AI compliance team</span>
                    </li>
                    <li className="flex items-start">
                      <ShieldCheck className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                      <span>Secure API access with authentication</span>
                    </li>
                    <li className="flex items-start">
                      <ShieldCheck className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                      <span>Comprehensive documentation included</span>
                    </li>
                    <li className="flex items-start">
                      <ShieldCheck className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                      <span>Email support for implementation questions</span>
                    </li>
                    <li className="flex items-start">
                      <ShieldCheck className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                      <span>30-day money-back guarantee</span>
                    </li>
                  </ul>
                </TabsContent>
                <TabsContent value="reviews" className="py-4">
                  <div className="space-y-6">
                    {/* Example reviews - would be fetched from API in real app */}
                    <div className="border-b border-gray-200 pb-6">
                      <div className="flex items-start">
                        <Avatar className="h-10 w-10 mr-4">
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium text-gray-900">John Doe</h4>
                            <span className="mx-2 text-gray-300">•</span>
                            <span className="text-sm text-gray-500">2 weeks ago</span>
                          </div>
                          <div className="flex items-center mt-1 mb-2">
                            <div className="flex text-yellow-400">
                              <StarIcon className="h-4 w-4 fill-current" />
                              <StarIcon className="h-4 w-4 fill-current" />
                              <StarIcon className="h-4 w-4 fill-current" />
                              <StarIcon className="h-4 w-4 fill-current" />
                              <StarIcon className="h-4 w-4 fill-current" />
                            </div>
                          </div>
                          <p className="text-gray-700">
                            Excellent product! Integration was straightforward and it's dramatically improved our workflow. Support team was very responsive when I had questions.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-b border-gray-200 pb-6">
                      <div className="flex items-start">
                        <Avatar className="h-10 w-10 mr-4">
                          <AvatarFallback>AS</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium text-gray-900">Alice Smith</h4>
                            <span className="mx-2 text-gray-300">•</span>
                            <span className="text-sm text-gray-500">1 month ago</span>
                          </div>
                          <div className="flex items-center mt-1 mb-2">
                            <div className="flex text-yellow-400">
                              <StarIcon className="h-4 w-4 fill-current" />
                              <StarIcon className="h-4 w-4 fill-current" />
                              <StarIcon className="h-4 w-4 fill-current" />
                              <StarIcon className="h-4 w-4 fill-current" />
                              <StarIcon className="h-4 w-4 text-gray-300 fill-current" />
                            </div>
                          </div>
                          <p className="text-gray-700">
                            Good product overall, but I had some issues with the API rate limits. Once I upgraded to the higher tier, it worked much better for our needs.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      Load More Reviews
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
        
        {/* Sidebar - Purchase and Seller Info */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Purchase This Product</CardTitle>
              <CardDescription>
                Get immediate access after payment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-lg">
                  <span className="font-medium">Price:</span>
                  <span className="font-bold text-blue-600">{formatCurrency(product.price)}</span>
                </div>
                
                <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      Buy Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Complete Purchase</DialogTitle>
                      <DialogDescription>
                        Purchase {product.name} for {formatCurrency(product.price)}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <p className="text-sm text-gray-500 mb-4">
                        This is a demo of the payment process. In a real application, you would be redirected to a secure payment gateway.
                      </p>
                      <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Order Summary</h4>
                        <div className="flex justify-between mb-2">
                          <span>{product.name}</span>
                          <span>{formatCurrency(product.price)}</span>
                        </div>
                        <div className="flex justify-between mb-2 text-gray-500">
                          <span>Processing fee</span>
                          <span>{formatCurrency(Math.round(product.price * 0.03))}</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between font-bold">
                          <span>Total</span>
                          <span>{formatCurrency(Math.round(product.price * 1.03))}</span>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsPaymentModalOpen(false)}>Cancel</Button>
                      <Button onClick={handlePurchase} disabled={isProcessingPayment}>
                        {isProcessingPayment ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Complete Purchase"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Button variant="outline" className="w-full">
                  Add to Cart
                </Button>
                
                <p className="text-sm text-gray-500">
                  By purchasing, you agree to our Terms of Service and the seller's license terms.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>About the Seller</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={seller?.avatar} alt={seller?.username} />
                  <AvatarFallback>{seller ? getInitials(seller.fullName || seller.username) : "?"}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">{seller?.fullName || seller?.username || "Loading..."}</h3>
                  <p className="text-sm text-gray-500">Member since {seller ? formatDate(seller.createdAt) : "..."}</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                {seller?.bio || "AI developer specializing in creating efficient and innovative solutions for businesses and individuals."}
              </p>
              
              <Dialog open={isMessageModalOpen} onOpenChange={setIsMessageModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Seller
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Message the Seller</DialogTitle>
                    <DialogDescription>
                      Send a message to {seller?.username} about {product.name}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Textarea
                      placeholder="Your message..."
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsMessageModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleSendMessage} disabled={isSubmittingMessage || !messageContent.trim()}>
                      {isSubmittingMessage ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Product Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Verified Product</h3>
                  <p className="text-sm text-gray-500">Reviewed by our AI team</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-700">
                This product has been reviewed by our verification team to ensure it meets our marketplace standards for quality, security, and performance.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Similar Products</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded bg-gray-100 mr-3 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                    alt="Similar product"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 text-sm">Smart Data Analyzer Pro</h3>
                  <div className="flex justify-between items-center mt-1">
                    <div className="flex items-center text-yellow-400">
                      <StarIcon className="h-3 w-3 fill-current" />
                      <StarIcon className="h-3 w-3 fill-current" />
                      <StarIcon className="h-3 w-3 fill-current" />
                      <StarIcon className="h-3 w-3 fill-current" />
                      <StarIcon className="h-3 w-3 fill-current" />
                      <span className="ml-1 text-xs text-gray-500">(5.0)</span>
                    </div>
                    <span className="text-sm font-medium text-blue-600">$79.99</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="h-12 w-12 rounded bg-gray-100 mr-3 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                    alt="Similar product"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 text-sm">AI Image Enhancer</h3>
                  <div className="flex justify-between items-center mt-1">
                    <div className="flex items-center text-yellow-400">
                      <StarIcon className="h-3 w-3 fill-current" />
                      <StarIcon className="h-3 w-3 fill-current" />
                      <StarIcon className="h-3 w-3 fill-current" />
                      <StarIcon className="h-3 w-3 fill-current" />
                      <StarIcon className="h-3 w-3 text-gray-300 fill-current" />
                      <span className="ml-1 text-xs text-gray-500">(4.0)</span>
                    </div>
                    <span className="text-sm font-medium text-blue-600">$39.99</span>
                  </div>
                </div>
              </div>
              
              <Link href="/products">
                <Button variant="link" className="w-full p-0">
                  View All Similar Products
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
