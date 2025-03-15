import { users, type User, type InsertUser, products, type Product, type InsertProduct, projects, type Project, type InsertProject, messages, type Message, type InsertMessage, news, type News, type InsertNews, waitlist, type Waitlist, type InsertWaitlist } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Product operations
  getProduct(id: number): Promise<Product | undefined>;
  getProducts(limit?: number, offset?: number): Promise<Product[]>;
  getFeaturedProducts(limit?: number): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProductsBySeller(sellerId: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Project operations
  getProject(id: number): Promise<Project | undefined>;
  getProjects(limit?: number, offset?: number): Promise<Project[]>;
  getProjectsByUser(userId: number): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<Project>): Promise<Project | undefined>;
  
  // Message operations
  getMessage(id: number): Promise<Message | undefined>;
  getMessagesByUser(userId: number): Promise<Message[]>;
  getConversation(user1Id: number, user2Id: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<Message | undefined>;
  
  // News operations
  getNews(id: number): Promise<News | undefined>;
  getAllNews(limit?: number, offset?: number): Promise<News[]>;
  createNews(news: InsertNews): Promise<News>;
  
  // Waitlist operations
  addToWaitlist(entry: InsertWaitlist): Promise<Waitlist>;
  isEmailInWaitlist(email: string): Promise<boolean>;
  
  sessionStore: any; // Using any type to bypass the type error
}

export class MemStorage implements IStorage {
  private usersMap: Map<number, User>;
  private productsMap: Map<number, Product>;
  private projectsMap: Map<number, Project>;
  private messagesMap: Map<number, Message>;
  private newsMap: Map<number, News>;
  private waitlistMap: Map<number, Waitlist>;
  
  sessionStore: session.SessionStore;
  
  private userIdCounter: number;
  private productIdCounter: number;
  private projectIdCounter: number;
  private messageIdCounter: number;
  private newsIdCounter: number;
  private waitlistIdCounter: number;

  constructor() {
    this.usersMap = new Map();
    this.productsMap = new Map();
    this.projectsMap = new Map();
    this.messagesMap = new Map();
    this.newsMap = new Map();
    this.waitlistMap = new Map();
    
    this.userIdCounter = 1;
    this.productIdCounter = 1;
    this.projectIdCounter = 1;
    this.messageIdCounter = 1;
    this.newsIdCounter = 1;
    this.waitlistIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
    
    // Add sample news data
    this.initializeNews();
  }
  
  // Initialize sample news data
  private initializeNews() {
    const sampleNews: InsertNews[] = [
      {
        title: "Breakthrough in Natural Language Processing Sets New Benchmarks",
        content: "Researchers have developed a new technique that dramatically improves AI understanding of complex language patterns, opening doors for more natural human-computer interaction.",
        image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3",
        category: "Research",
      },
      {
        title: "New International Framework for AI Governance Announced",
        content: "Leading nations have agreed on a comprehensive framework for AI regulation that aims to balance innovation with ethical considerations and public safety.",
        image: "https://images.unsplash.com/photo-1581092335867-bfc5aa5d2d95",
        category: "Regulation",
      }
    ];
    
    sampleNews.forEach(news => this.createNews(news));
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.usersMap.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = {
      ...insertUser,
      id,
      role: "user",
      createdAt: now,
      avatar: null,
      bio: null
    };
    this.usersMap.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.usersMap.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.usersMap.set(id, updatedUser);
    return updatedUser;
  }

  // Product operations
  async getProduct(id: number): Promise<Product | undefined> {
    return this.productsMap.get(id);
  }

  async getProducts(limit = 10, offset = 0): Promise<Product[]> {
    const products = Array.from(this.productsMap.values());
    return products.slice(offset, offset + limit);
  }

  async getFeaturedProducts(limit = 6): Promise<Product[]> {
    const products = Array.from(this.productsMap.values())
      .filter(product => product.featured);
    return products.slice(0, limit);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.productsMap.values())
      .filter(product => product.category === category);
  }

  async getProductsBySeller(sellerId: number): Promise<Product[]> {
    return Array.from(this.productsMap.values())
      .filter(product => product.sellerId === sellerId);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const now = new Date();
    const product: Product = {
      ...insertProduct,
      id,
      createdAt: now
    };
    this.productsMap.set(id, product);
    return product;
  }

  async updateProduct(id: number, productData: Partial<Product>): Promise<Product | undefined> {
    const product = this.productsMap.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...productData };
    this.productsMap.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.productsMap.delete(id);
  }

  // Project operations
  async getProject(id: number): Promise<Project | undefined> {
    return this.projectsMap.get(id);
  }

  async getProjects(limit = 10, offset = 0): Promise<Project[]> {
    const projects = Array.from(this.projectsMap.values());
    return projects.slice(offset, offset + limit);
  }

  async getProjectsByUser(userId: number): Promise<Project[]> {
    return Array.from(this.projectsMap.values())
      .filter(project => project.userId === userId);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.projectIdCounter++;
    const now = new Date();
    const project: Project = {
      ...insertProject,
      id,
      status: "open",
      createdAt: now
    };
    this.projectsMap.set(id, project);
    return project;
  }

  async updateProject(id: number, projectData: Partial<Project>): Promise<Project | undefined> {
    const project = this.projectsMap.get(id);
    if (!project) return undefined;
    
    const updatedProject = { ...project, ...projectData };
    this.projectsMap.set(id, updatedProject);
    return updatedProject;
  }

  // Message operations
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messagesMap.get(id);
  }

  async getMessagesByUser(userId: number): Promise<Message[]> {
    return Array.from(this.messagesMap.values())
      .filter(message => message.senderId === userId || message.receiverId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getConversation(user1Id: number, user2Id: number): Promise<Message[]> {
    return Array.from(this.messagesMap.values())
      .filter(message => 
        (message.senderId === user1Id && message.receiverId === user2Id) ||
        (message.senderId === user2Id && message.receiverId === user1Id)
      )
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageIdCounter++;
    const now = new Date();
    const message: Message = {
      ...insertMessage,
      id,
      read: false,
      createdAt: now
    };
    this.messagesMap.set(id, message);
    return message;
  }

  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const message = this.messagesMap.get(id);
    if (!message) return undefined;
    
    const updatedMessage = { ...message, read: true };
    this.messagesMap.set(id, updatedMessage);
    return updatedMessage;
  }

  // News operations
  async getNews(id: number): Promise<News | undefined> {
    return this.newsMap.get(id);
  }

  async getAllNews(limit = 10, offset = 0): Promise<News[]> {
    const news = Array.from(this.newsMap.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return news.slice(offset, offset + limit);
  }

  async createNews(insertNews: InsertNews): Promise<News> {
    const id = this.newsIdCounter++;
    const now = new Date();
    const news: News = {
      ...insertNews,
      id,
      createdAt: now
    };
    this.newsMap.set(id, news);
    return news;
  }

  // Waitlist operations
  async addToWaitlist(entry: InsertWaitlist): Promise<Waitlist> {
    const id = this.waitlistIdCounter++;
    const now = new Date();
    const waitlistEntry: Waitlist = {
      ...entry,
      id,
      createdAt: now
    };
    this.waitlistMap.set(id, waitlistEntry);
    return waitlistEntry;
  }

  async isEmailInWaitlist(email: string): Promise<boolean> {
    return Array.from(this.waitlistMap.values())
      .some(entry => entry.email === email);
  }
}

export const storage = new MemStorage();
