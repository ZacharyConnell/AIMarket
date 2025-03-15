import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertWaitlistSchema, insertProductSchema, insertProjectSchema, insertMessageSchema, productVerificationSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Error handler for Zod validation errors
  const handleZodError = (error: unknown) => {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return validationError.message;
    }
    return "An unexpected error occurred";
  };

  // Waitlist API
  app.post("/api/waitlist", async (req, res) => {
    try {
      const waitlistData = insertWaitlistSchema.parse(req.body);
      
      // Check if email is already in waitlist
      const isEmailRegistered = await storage.isEmailInWaitlist(waitlistData.email);
      if (isEmailRegistered) {
        return res.status(400).json({ message: "Email is already registered in the waitlist" });
      }
      
      const waitlistEntry = await storage.addToWaitlist(waitlistData);
      res.status(201).json(waitlistEntry);
    } catch (error) {
      const errorMessage = handleZodError(error);
      res.status(400).json({ message: errorMessage });
    }
  });

  // Products API
  app.get("/api/products", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const products = await storage.getProducts(limit, offset);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/featured", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
      const products = await storage.getFeaturedProducts(limit);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });

  app.get("/api/products/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const products = await storage.getProductsByCategory(category);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products by category" });
    }
  });

  app.get("/api/products/seller/:sellerId", async (req, res) => {
    try {
      const sellerId = parseInt(req.params.sellerId);
      const products = await storage.getProductsBySeller(sellerId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products by seller" });
    }
  });
  
  // Product Verification API - Must be placed before the generic /api/products/:id route
  app.get("/api/products/verification/pending", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    // Only admin users can view pending products
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "You don't have permission to access this resource" });
    }
    
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const pendingProducts = await storage.getPendingProducts(limit, offset);
      res.json(pendingProducts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pending products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const productData = insertProductSchema.parse({
        ...req.body,
        sellerId: req.user.id
      });
      
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      const errorMessage = handleZodError(error);
      res.status(400).json({ message: errorMessage });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      if (product.sellerId !== req.user.id) {
        return res.status(403).json({ message: "You don't have permission to update this product" });
      }
      
      const updatedProduct = await storage.updateProduct(id, req.body);
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      if (product.sellerId !== req.user.id) {
        return res.status(403).json({ message: "You don't have permission to delete this product" });
      }
      
      const success = await storage.deleteProduct(id);
      
      if (success) {
        res.sendStatus(204);
      } else {
        res.status(500).json({ message: "Failed to delete product" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });
  
  // Product Verification API
  
  app.post("/api/products/:id/verify", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    // Only admin users can verify products manually
    if (req.user.role !== "admin" && !req.body.automated) {
      return res.status(403).json({ message: "You don't have permission to verify products" });
    }
    
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // If this is an automated verification
      if (req.body.automated) {
        const { verifyProduct } = await import('./ai-service');
        const verificationResult = await verifyProduct(product);
        
        const updatedProduct = await storage.verifyProduct(
          productId,
          verificationResult.status,
          verificationResult.notes
        );
        
        res.json({
          ...updatedProduct,
          riskScore: verificationResult.riskScore
        });
      } else {
        // Manual verification by admin
        const { verificationStatus, verificationNotes } = productVerificationSchema.parse({
          ...req.body,
          productId
        });
        
        const updatedProduct = await storage.verifyProduct(
          productId,
          verificationStatus,
          verificationNotes
        );
        
        res.json(updatedProduct);
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        const errorMessage = handleZodError(error);
        res.status(400).json({ message: errorMessage });
      }
    }
  });

  // Projects API
  app.get("/api/projects", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const projects = await storage.getProjects(limit, offset);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/user", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const projects = await storage.getProjectsByUser(req.user.id);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const projectData = insertProjectSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      const errorMessage = handleZodError(error);
      res.status(400).json({ message: errorMessage });
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      if (project.userId !== req.user.id) {
        return res.status(403).json({ message: "You don't have permission to update this project" });
      }
      
      const updatedProject = await storage.updateProject(id, req.body);
      res.json(updatedProject);
    } catch (error) {
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  // Messages API
  app.get("/api/messages", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const messages = await storage.getMessagesByUser(req.user.id);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.get("/api/messages/conversation/:userId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const otherUserId = parseInt(req.params.userId);
      const messages = await storage.getConversation(req.user.id, otherUserId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversation" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const messageData = insertMessageSchema.parse({
        ...req.body,
        senderId: req.user.id
      });
      
      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      const errorMessage = handleZodError(error);
      res.status(400).json({ message: errorMessage });
    }
  });

  app.patch("/api/messages/:id/read", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const id = parseInt(req.params.id);
      const message = await storage.getMessage(id);
      
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      
      if (message.receiverId !== req.user.id) {
        return res.status(403).json({ message: "You don't have permission to mark this message as read" });
      }
      
      const updatedMessage = await storage.markMessageAsRead(id);
      res.json(updatedMessage);
    } catch (error) {
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });

  // Chatbot API
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      const { getChatbotResponse } = await import('./ai-service');
      const response = await getChatbotResponse(message);
      res.json(response);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to get chatbot response" });
      }
    }
  });

  // News API
  app.get("/api/news", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const newsList = await storage.getAllNews(limit, offset);
      res.json(newsList);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  app.get("/api/news/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const newsItem = await storage.getNews(id);
      
      if (!newsItem) {
        return res.status(404).json({ message: "News item not found" });
      }
      
      res.json(newsItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news item" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
