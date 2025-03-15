import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { InsertProduct } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, AlertCircle, Package } from "lucide-react";

// Extended schema with validation
const productSchema = z.object({
  name: z.string().min(5, { message: "Product name must be at least 5 characters long" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters long" }),
  price: z.string().min(1, { message: "Price is required" }),
  category: z.string({ required_error: "Please select a category" }),
  image: z.string().optional(),
  tags: z.string().optional(),
  featuredProduct: z.boolean().default(false),
  termsAgreed: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

const categories = [
  { value: "content-creation", label: "Content Creation" },
  { value: "data-analysis", label: "Data Analysis" },
  { value: "image-generation", label: "Image Generation" },
  { value: "chatbots", label: "Chatbots" },
  { value: "voice-processing", label: "Voice Processing" },
  { value: "custom", label: "Other (Custom)" },
];

const ProductCreate = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [newProductId, setNewProductId] = useState<number | null>(null);

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
      tags: "",
      featuredProduct: false,
      termsAgreed: false,
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: Omit<z.infer<typeof productSchema>, "termsAgreed">) => {
      if (!user) throw new Error("You must be logged in to create a product");
      
      // Convert price to number
      const price = parseFloat(data.price);
      
      // Convert tags string to array if provided
      const tags = data.tags ? data.tags.split(",").map(tag => tag.trim()) : null;
      
      const productData: InsertProduct = {
        name: data.name,
        description: data.description,
        price,
        category: data.category,
        sellerId: user.id,
        image: data.image || null,
        tags,
        featured: data.featuredProduct,
      };
      
      const res = await apiRequest("POST", "/api/products", productData);
      return res.json();
    },
    onSuccess: (data) => {
      setNewProductId(data.id);
      setIsSuccessDialogOpen(true);
      
      // Invalidate products query cache
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products/seller", user?.id] });
      
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Failed to create product",
        description: error.message || "There was an error creating your product. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof productSchema>) => {
    // Remove termsAgreed from the data before submitting
    const { termsAgreed, ...productData } = data;
    createProductMutation.mutate(productData);
  };

  // Handle platform fee
  const calculatePlatformFee = (price: string) => {
    const numPrice = parseFloat(price) || 0;
    return numPrice * 0.015; // 1.5% platform fee
  };

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Authentication Required</CardTitle>
            <CardDescription className="text-center">
              You need to be logged in to post a product.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <AlertCircle className="h-16 w-16 text-orange-500 mb-4" />
            <p className="text-center mb-6">
              Please sign in or create an account to list your AI product on the marketplace.
            </p>
            <Button onClick={() => setLocation("/auth?mode=login")}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">List Your AI Product</h1>
        <p className="mt-2 text-gray-600">
          Share your AI solution with the marketplace and start earning
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>
            Fill out the details of your AI product listing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., AI Content Generator Pro" {...field} />
                    </FormControl>
                    <FormDescription>
                      A clear, descriptive name for your product
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the category that best fits your product
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (USD)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          min="0" 
                          placeholder="e.g., 49.99" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Set a competitive price for your product
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your product in detail..." 
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a comprehensive description of what your product does and its benefits
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Image URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., https://example.com/my-product-image.jpg" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Add an image URL that showcases your product (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., ai, automation, content, nlp (comma separated)" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Add relevant tags to help users discover your product (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="featuredProduct"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured Product</FormLabel>
                      <FormDescription>
                        Request to have your product featured on the homepage (subject to review)
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <div className="rounded-md bg-blue-50 p-4 mt-6">
                <div className="flex">
                  <div className="text-blue-600 flex-shrink-0">
                    <Package className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Platform fee</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        A 1.5% platform fee will be deducted from each sale. Your estimated payout per sale would be
                        {" "}
                        <span className="font-semibold">
                          ${(parseFloat(form.watch("price") || "0") - calculatePlatformFee(form.watch("price") || "0")).toFixed(2)}
                        </span>
                        {" "} 
                        for a product priced at ${parseFloat(form.watch("price") || "0").toFixed(2)}.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="termsAgreed"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Terms and Conditions</FormLabel>
                      <FormDescription>
                        I agree to the marketplace terms and conditions for selling products, including the 1.5% platform fee.
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={createProductMutation.isPending}
              >
                {createProductMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Product...
                  </>
                ) : (
                  "Create Product Listing"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <AlertDialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Product Successfully Listed</AlertDialogTitle>
            <AlertDialogDescription>
              Your AI product has been successfully listed on the marketplace. Users can now view and purchase your product.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => {
              setIsSuccessDialogOpen(false);
              if (newProductId) {
                setLocation(`/products/${newProductId}`);
              }
            }}>
              View Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductCreate;