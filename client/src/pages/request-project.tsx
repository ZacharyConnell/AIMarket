import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { InsertProject } from "@shared/schema";
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
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, FileText, AlertCircle } from "lucide-react";

// Extended schema with validation
const projectSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters long" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters long" }),
  requirements: z.string().min(20, { message: "Requirements must be at least 20 characters long" }),
  budget: z.string().optional(),
  deadline: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

const projectCategories = [
  { value: "content-creation", label: "Content Creation" },
  { value: "data-analysis", label: "Data Analysis" },
  { value: "image-generation", label: "Image Generation" },
  { value: "chatbots", label: "Chatbots" },
  { value: "voice-processing", label: "Voice Processing" },
  { value: "custom", label: "Other (Custom)" },
];

const RequestProject = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [projectId, setProjectId] = useState<number | null>(null);

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      requirements: "",
      budget: "",
      deadline: "",
      agreeToTerms: false,
    },
  });

  const submitProjectMutation = useMutation({
    mutationFn: async (projectData: Omit<z.infer<typeof projectSchema>, "agreeToTerms">) => {
      if (!user) throw new Error("You must be logged in to submit a project request");
      
      // Convert budget to number if provided
      const budget = projectData.budget ? parseInt(projectData.budget) : undefined;
      
      const projectRequest: InsertProject = {
        title: projectData.title,
        description: projectData.description,
        requirements: projectData.requirements,
        budget,
        deadline: projectData.deadline || undefined,
        userId: user.id,
      };
      
      const res = await apiRequest("POST", "/api/projects", projectRequest);
      return res.json();
    },
    onSuccess: (data) => {
      // Set the project ID for the success dialog
      setProjectId(data.id);
      setIsDialogOpen(true);
      
      // Invalidate projects query cache
      queryClient.invalidateQueries({ queryKey: ["/api/projects/user"] });
      
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Failed to create project request",
        description: error.message || "There was an error submitting your project request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof projectSchema>) => {
    // Remove agreeToTerms from the data before submitting
    const { agreeToTerms, ...projectData } = data;
    submitProjectMutation.mutate(projectData);
  };

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Authentication Required</CardTitle>
            <CardDescription className="text-center">
              You need to be logged in to create a project request.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <AlertCircle className="h-16 w-16 text-orange-500 mb-4" />
            <p className="text-center mb-6">
              Please sign in or create an account to submit a custom project request.
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
        <h1 className="text-3xl font-bold text-gray-900">Request a Custom AI Project</h1>
        <p className="mt-2 text-gray-600">
          Describe your project needs and connect with skilled AI developers
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Project Request Form</CardTitle>
          <CardDescription>
            Fill out the details of your custom AI project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Custom AI Chatbot for Customer Support" {...field} />
                    </FormControl>
                    <FormDescription>
                      A clear, concise title for your project
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormItem>
                  <FormLabel>Project Category</FormLabel>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the category that best fits your project
                  </FormDescription>
                </FormItem>
                
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget (USD)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 500" {...field} />
                      </FormControl>
                      <FormDescription>
                        Optional. Provide your budget range.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 2 weeks, 1 month, etc." {...field} />
                    </FormControl>
                    <FormDescription>
                      Optional. When do you need this project completed?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your project in detail..." 
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a comprehensive overview of what you're looking to build
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technical Requirements</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="List specific technical requirements or features needed..." 
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Include any technical specifications, features, or requirements
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="agreeToTerms"
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
                        I agree to the marketplace terms and conditions for project requests.
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={submitProjectMutation.isPending}
              >
                {submitProjectMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Project Request"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Project Request Submitted</AlertDialogTitle>
            <AlertDialogDescription>
              Your project request has been successfully submitted. AI developers will be able to view your project and submit proposals.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>Close</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setIsDialogOpen(false);
              setLocation("/dashboard?tab=projects");
            }}>
              View My Projects
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RequestProject;
