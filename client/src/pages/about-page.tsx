import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, Check, Award, Users, Code, Heart } from "lucide-react";

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      bio: "Former AI research lead with over 15 years of experience in developing AI solutions for enterprise clients.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
      name: "David Chen",
      role: "CTO",
      bio: "AI developer and architect who has built AI systems for Fortune 500 companies. Expert in machine learning and natural language processing.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
      name: "Maya Rodriguez",
      role: "Head of Product",
      bio: "Product manager with a passion for creating user-friendly AI experiences. Previously led product at several successful tech startups.",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
      name: "James Wilson",
      role: "Head of Partnerships",
      bio: "Business development expert focused on building strategic partnerships with AI developers and enterprise customers.",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    }
  ];

  const values = [
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Quality Assurance",
      description: "We verify every product to ensure it meets our marketplace standards for quality, security, and performance."
    },
    {
      icon: <Award className="h-8 w-8 text-blue-600" />,
      title: "Innovation First",
      description: "We prioritize innovative AI solutions that push boundaries and solve real problems for users and businesses."
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Community Focused",
      description: "We build and nurture a community of AI creators and users, fostering collaboration and knowledge sharing."
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Ethical AI",
      description: "We're committed to ethical AI development and use, with transparent guidelines for all products on our platform."
    },
    {
      icon: <Code className="h-8 w-8 text-blue-600" />,
      title: "Developer Success",
      description: "We empower AI creators with the tools, resources, and marketplace they need to succeed and grow."
    },
    {
      icon: <Heart className="h-8 w-8 text-blue-600" />,
      title: "User Satisfaction",
      description: "We're dedicated to helping users find the perfect AI solutions for their unique needs and challenges."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About AIMarket</h1>
        <p className="text-xl text-gray-600">
          Connecting brilliant AI creators with the businesses and individuals who need their solutions.
        </p>
      </div>

      {/* Our Story */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <p className="text-gray-600 mb-4">
            AIMarket was founded in 2023 with a simple mission: to create a trusted marketplace that connects AI developers with businesses and individuals seeking innovative AI solutions.
          </p>
          <p className="text-gray-600 mb-4">
            As artificial intelligence continues to transform industries and everyday life, we saw the need for a dedicated platform where verified, quality AI products could be discovered, purchased, and customized.
          </p>
          <p className="text-gray-600 mb-4">
            Our team brings together expertise in AI development, product management, and business strategy, with a shared passion for making AI technology accessible and beneficial for everyone.
          </p>
          <p className="text-gray-600">
            Today, AIMarket is growing into the premier destination for AI products and services, with a commitment to quality, security, and advancing the responsible use of artificial intelligence.
          </p>
        </div>
        <div className="relative h-80 md:h-96 rounded-lg overflow-hidden shadow-xl">
          <img 
            src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1400&q=80" 
            alt="AIMarket Team" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Our Mission */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-16 px-8 rounded-2xl mb-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl mb-8">
            To create the most trusted global marketplace for AI products and services, 
            enabling creators to thrive and helping users find the perfect AI solutions for their needs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="bg-white/20 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="font-bold mb-2">Quality</h3>
              <p className="text-sm text-blue-100">Ensuring every product on our platform meets high standards</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="bg-white/20 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="font-bold mb-2">Access</h3>
              <p className="text-sm text-blue-100">Making AI technology accessible to businesses of all sizes</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="bg-white/20 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="font-bold mb-2">Innovation</h3>
              <p className="text-sm text-blue-100">Fostering the development of groundbreaking AI solutions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            These core principles guide everything we do at AIMarket
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  {value.icon}
                </div>
                <CardTitle>{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Meet Our Team */}
      <div className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The passionate people behind AIMarket
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-gray-900">{member.name}</h3>
              <p className="text-blue-600 mb-2">{member.role}</p>
              <p className="text-sm text-gray-600">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Got questions about AIMarket? We've got answers.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>How does AIMarket verify AI products?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Our team of AI experts reviews each product submission against our quality and security standards. 
                We test functionality, check for vulnerabilities, ensure ethical guidelines are met, and verify that 
                products perform as advertised before they're approved for the marketplace.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Can I request custom AI solutions?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Absolutely! Our custom project request feature allows you to describe your specific needs and connect 
                with skilled AI developers who can build tailored solutions. Simply fill out a project request form with 
                your requirements, budget, and timeline.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>How do I become an AI creator on the platform?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Start by creating an account and completing your developer profile. You can then submit your AI products 
                for review or browse project requests to offer your services. Our team reviews all submissions to ensure 
                quality before they're published on the marketplace.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>What payment methods do you accept?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                We support major credit cards, PayPal, and bank transfers for most regions. For larger enterprise purchases, 
                we also offer invoicing options. All transactions are secured with industry-standard encryption and we never 
                store your full payment details.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 rounded-2xl p-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to explore the future of AI?</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Join AIMarket today to discover innovative AI products or share your own creations with the world.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth?mode=register">
            <Button size="lg" className="px-8">
              Create Account
            </Button>
          </Link>
          <Link href="/products">
            <Button size="lg" variant="outline" className="px-8">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
