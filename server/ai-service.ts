import type { Product } from '@shared/schema';

// No API key required - simulated AI service

export interface VerificationResult {
  status: "approved" | "rejected";
  notes: string;
  riskScore: number;
}

export interface ChatResponse {
  answer: string;
}

/**
 * Simulated product verification without using external AI API
 */
export async function verifyProduct(product: Product): Promise<VerificationResult> {
  // Simple rule-based verification
  let status: "approved" | "rejected" = "approved";
  let notes = "";
  let riskScore = 0;
  
  // Price check
  if (product.price <= 0) {
    status = "rejected";
    notes += "Price must be greater than zero. ";
    riskScore += 30;
  } else if (product.price > 1000) {
    notes += "Price is unusually high, please review carefully. ";
    riskScore += 15;
  }
  
  // Description check
  if (!product.description || product.description.length < 20) {
    status = "rejected";
    notes += "Description is too short or missing. ";
    riskScore += 25;
  }
  
  // Name check
  if (!product.name || product.name.length < 3) {
    status = "rejected";
    notes += "Product name is too short or missing. ";
    riskScore += 20;
  }
  
  // Category check
  if (!product.category) {
    notes += "Category is missing. ";
    riskScore += 10;
  }
  
  // Keyword checks for suspicious terms
  const suspiciousTerms = [
    "guaranteed success", "100% accuracy", "perfect results", 
    "unlimited", "free money", "get rich", "hack", "crack",
    "bypass", "illegal", "lifetime unlimited"
  ];
  
  const descriptionLower = product.description.toLowerCase();
  const suspiciousFound = suspiciousTerms.filter(term => 
    descriptionLower.includes(term.toLowerCase())
  );
  
  if (suspiciousFound.length > 0) {
    status = "rejected";
    notes += `Contains potentially misleading terms: ${suspiciousFound.join(", ")}. `;
    riskScore += 25;
  }
  
  // Final evaluation
  if (notes === "") {
    notes = "Product listing meets all requirements for the marketplace.";
  } else if (status === "approved") {
    notes += "Product is approved with the noted considerations.";
  } else {
    notes += "Product requires revision before it can be listed on the marketplace.";
  }
  
  // Cap risk score at 100
  riskScore = Math.min(riskScore, 100);
  
  return {
    status,
    notes,
    riskScore
  };
}

/**
 * Simulated chatbot without using external AI API
 */
export async function getChatbotResponse(userMessage: string): Promise<ChatResponse> {
  const userMessageLower = userMessage.toLowerCase();
  let answer = "";
  
  // Pattern matching for common questions
  if (userMessageLower.includes("how") && userMessageLower.includes("sell")) {
    answer = "To sell on our platform, go to your dashboard and click 'Create Product'. Fill in the details about your AI solution, set a price, and submit for verification. Once approved, your product will be listed in our marketplace.";
  }
  else if (userMessageLower.includes("how") && userMessageLower.includes("buy")) {
    answer = "To buy a product, browse the marketplace and click on any product that interests you. Review the details, and if you're satisfied, click 'Purchase'. You'll be guided through our secure checkout process.";
  }
  else if (userMessageLower.includes("verification") || userMessageLower.includes("verify")) {
    answer = "All products undergo an automated verification process to ensure quality and legitimacy. This includes checking for clear descriptions, reasonable pricing, and appropriate categorization. Most verifications are completed within 24-48 hours.";
  }
  else if (userMessageLower.includes("payment") || userMessageLower.includes("pricing")) {
    answer = "We accept major credit cards and process payments securely through Stripe. The platform charges a small commission (1-2%) on each transaction to maintain the marketplace.";
  }
  else if (userMessageLower.includes("refund") || userMessageLower.includes("money back")) {
    answer = "If you're unsatisfied with a purchase, you can request a refund within 14 days. Go to your purchase history, select the product, and click 'Request Refund'. The seller will be notified and can approve the refund request.";
  }
  else if (userMessageLower.includes("custom") && userMessageLower.includes("project")) {
    answer = "You can request custom AI projects through our platform. Go to 'Request Project', describe your requirements, set a budget, and submit. Qualified developers will be able to bid on your project.";
  }
  else if (userMessageLower.includes("contact") || userMessageLower.includes("support")) {
    answer = "For support, you can reach us through the 'Contact Us' form on the website or email support@aimarket.com. We typically respond within 24 hours on business days.";
  }
  else if (userMessageLower.includes("account") || userMessageLower.includes("profile")) {
    answer = "You can manage your account settings in the profile section. Click on your profile picture in the top right corner and select 'Profile' to update your information, change password, or manage your payment methods.";
  }
  else if (userMessageLower.includes("hello") || userMessageLower.includes("hi") || userMessageLower.includes("hey")) {
    answer = "Hello! I'm your AI Market assistant. How can I help you today? Feel free to ask about buying, selling, or requesting custom AI solutions.";
  }
  else {
    // Default response for unrecognized queries
    answer = "I understand you're asking about '" + userMessage + "'. While I don't have specific information on that, I can help with questions about buying, selling, product verification, payments, refunds, custom projects, and account management. Could you please rephrase your question?";
  }
  
  return { answer };
}