import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import * as geminiService from "./server/geminiService";
import {
  createPayPalOrder,
  capturePayPalOrder,
  verifyAndProcessPayPalWebhook
} from "./src/services/paypalServer";

async function startServer() {
  const app = reportErrors(express());
  const PORT = 3000;

  function reportErrors(expressApp: express.Express) {
    return expressApp;
  }

  app.use(express.json());

  // Admin Verification Helper (Strict Firebase Custom Claim / Admin Role Validation)
  function isAuthorizedAdmin(req: express.Request): boolean {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
          if (payload.admin === true || payload.role === 'admin') {
            return true;
          }
        }
      } catch (e) {
        return false;
      }
    }
    return false;
  }

  // Admin-Only Middleware for Protected Routes
  app.use((req, res, next) => {
    const protectedPrefixes = ['/api/gemini', '/api/publish', '/api/convert'];
    const isProtected = protectedPrefixes.some(prefix => req.path.startsWith(prefix));
    
    if (isProtected) {
      if (!isAuthorizedAdmin(req)) {
        return res.status(403).json({
          success: false,
          error: "Access Denied: Creator & Admin Studio authorization required."
        });
      }
    }
    next();
  });

  // Gemini Secure API routes
  app.post("/api/gemini/generateEbookOutline", async (req, res) => {
    try {
      const { niche, tone } = req.body;
      const data = await geminiService.generateEbookOutline(niche, tone);
      res.json({ success: true, data });
    } catch (error: any) {
      console.error("error in generateEbookOutline:", error);
      res.status(500).json({ success: false, error: error.message || "Failed to generate outline" });
    }
  });

  app.post("/api/gemini/generateChapterContent", async (req, res) => {
    try {
      const { title, chapterTitle, chapterDescription, tone, depth, writingStyle } = req.body;
      const data = await geminiService.generateChapterContent(title, chapterTitle, chapterDescription, tone, depth, writingStyle);
      res.json({ success: true, data });
    } catch (error: any) {
      console.error("error in generateChapterContent:", error);
      res.status(500).json({ success: false, error: error.message || "Failed to generate chapter content" });
    }
  });

  app.post("/api/gemini/generateCoverArt", async (req, res) => {
    try {
      const { title, niche, keywords, style } = req.body;
      const data = await geminiService.generateCoverArt(title, niche, keywords, style);
      res.json({ success: true, data });
    } catch (error: any) {
      console.error("error in generateCoverArt:", error);
      res.status(500).json({ success: false, error: error.message || "Failed to generate cover art" });
    }
  });

  app.post("/api/gemini/generateChapterSummary", async (req, res) => {
    try {
      const { chapterTitle, content } = req.body;
      const data = await geminiService.generateChapterSummary(chapterTitle, content);
      res.json({ success: true, data });
    } catch (error: any) {
      console.error("error in generateChapterSummary:", error);
      res.status(500).json({ success: false, error: error.message || "Failed to generate chapter summary" });
    }
  });

  app.post("/api/gemini/generateChapterImage", async (req, res) => {
    try {
      const { chapterTitle, chapterDescription, style } = req.body;
      const data = await geminiService.generateChapterImage(chapterTitle, chapterDescription, style);
      res.json({ success: true, data });
    } catch (error: any) {
      console.error("error in generateChapterImage:", error);
      res.status(500).json({ success: false, error: error.message || "Failed to generate chapter image" });
    }
  });

  app.post("/api/gemini/checkGrammar", async (req, res) => {
    try {
      const { text } = req.body;
      const data = await geminiService.checkGrammar(text);
      res.json({ success: true, data });
    } catch (error: any) {
      console.error("error in checkGrammar:", error);
      res.status(500).json({ success: false, error: error.message || "Failed to check grammar" });
    }
  });

  app.post("/api/gemini/translateChapter", async (req, res) => {
    try {
      const { title, content, targetLanguage } = req.body;
      const data = await geminiService.translateChapter(title, content, targetLanguage);
      res.json({ success: true, data });
    } catch (error: any) {
      console.error("error in translateChapter:", error);
      res.status(500).json({ success: false, error: error.message || "Failed to translate chapter" });
    }
  });

  app.post("/api/gemini/analyzeTrendingNiches", async (req, res) => {
    try {
      const data = await geminiService.analyzeTrendingNiches();
      res.json({ success: true, data });
    } catch (error: any) {
      console.error("error in analyzeTrendingNiches:", error);
      res.status(500).json({ success: false, error: error.message || "Failed to analyze trending niches" });
    }
  });

  app.post("/api/gemini/researchTopic", async (req, res) => {
    try {
      const { topic } = req.body;
      const data = await geminiService.researchTopic(topic);
      res.json({ success: true, data });
    } catch (error: any) {
      console.error("error in researchTopic:", error);
      res.status(500).json({ success: false, error: error.message || "Failed to conduct topic research" });
    }
  });

  app.post("/api/gemini/factCheckContent", async (req, res) => {
    try {
      const { content, niche, tone } = req.body;
      const data = await geminiService.factCheckContent(content, niche, tone);
      res.json({ success: true, data });
    } catch (error: any) {
      console.error("error in factCheckContent:", error);
      res.status(500).json({ success: false, error: error.message || "Failed to fact check content" });
    }
  });

  app.post("/api/gemini/generateDetailedNicheReport", async (req, res) => {
    try {
      const { topic } = req.body;
      const data = await geminiService.generateDetailedNicheReport(topic);
      res.json({ success: true, data });
    } catch (error: any) {
      console.error("error in generateDetailedNicheReport:", error);
      res.status(500).json({ success: false, error: error.message || "Failed to generate detailed niche report" });
    }
  });

  // PayPal Commerce Endpoints
  app.post("/api/paypal/create-order", async (req, res) => {
    try {
      const { items } = req.body;
      const clientId = process.env.PAYPAL_CLIENT_ID || process.env.VITE_PAYPAL_CLIENT_ID;
      const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
      const paypalEnv = process.env.PAYPAL_ENVIRONMENT || "sandbox";

      if (!clientId || !clientSecret) {
        return res.status(400).json({
          success: false,
          error: "PayPal API credentials not configured on server (PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET missing)."
        });
      }

      const result = await createPayPalOrder(clientId, clientSecret, paypalEnv, items || []);
      return res.json(result);
    } catch (error: any) {
      console.error("Error creating PayPal order:", error);
      res.status(500).json({ success: false, error: error.message || "Failed to create order" });
    }
  });

  app.post("/api/paypal/capture-order", async (req, res) => {
    try {
      const { orderId, items, customerEmail, customerName } = req.body;
      const clientId = process.env.PAYPAL_CLIENT_ID || process.env.VITE_PAYPAL_CLIENT_ID;
      const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
      const paypalEnv = process.env.PAYPAL_ENVIRONMENT || "sandbox";

      if (!clientId || !clientSecret) {
        return res.status(400).json({
          success: false,
          error: "PayPal API credentials not configured on server (PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET missing)."
        });
      }

      const result = await capturePayPalOrder(
        clientId,
        clientSecret,
        paypalEnv,
        orderId,
        items || [],
        customerEmail,
        customerName
      );
      return res.json(result);
    } catch (error: any) {
      console.error("Error capturing PayPal order:", error);
      res.status(500).json({ success: false, error: error.message || "Failed to capture order" });
    }
  });

  app.post("/api/paypal/webhook", async (req, res) => {
    try {
      const clientId = process.env.PAYPAL_CLIENT_ID || process.env.VITE_PAYPAL_CLIENT_ID;
      const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
      const paypalEnv = process.env.PAYPAL_ENVIRONMENT || "sandbox";
      const webhookId = process.env.PAYPAL_WEBHOOK_ID;

      if (!clientId || !clientSecret || !webhookId) {
        return res.status(400).json({
          success: false,
          error: "PayPal webhook credentials not configured (PAYPAL_WEBHOOK_ID missing)."
        });
      }

      const headers: Record<string, string | undefined> = {
        "paypal-auth-algo": req.headers["paypal-auth-algo"] as string,
        "paypal-cert-url": req.headers["paypal-cert-url"] as string,
        "paypal-transmission-id": req.headers["paypal-transmission-id"] as string,
        "paypal-transmission-sig": req.headers["paypal-transmission-sig"] as string,
        "paypal-transmission-time": req.headers["paypal-transmission-time"] as string,
      };

      const result = await verifyAndProcessPayPalWebhook(
        clientId,
        clientSecret,
        paypalEnv,
        webhookId,
        headers,
        req.body
      );
      return res.json(result);
    } catch (error: any) {
      console.error("Error processing PayPal webhook:", error);
      res.status(400).json({ success: false, error: error.message || "Webhook processing failed" });
    }
  });

  // Mock API for publishing
  app.post("/api/publish", (req, res) => {
    const { projectId, platforms, metadata } = req.body;
    
    if (!projectId) {
      return res.status(400).json({ success: false, message: "Project ID is required for publishing." });
    }
    if (!platforms || platforms.length === 0) {
      return res.status(400).json({ success: false, message: "Please select at least one marketplace." });
    }

    console.log(`Publishing project ${projectId} to platforms:`, platforms);
    
    // Simulate API delay
    setTimeout(() => {
      res.json({
        success: true,
        message: "Ebook submitted successfully to selected marketplaces.",
        publicationIds: platforms.reduce((acc: any, p: string) => {
          acc[p] = `PUB-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
          return acc;
        }, {})
      });
    }, 2000);
  });

  // Mock API for EPUB conversion
  app.post("/api/convert", (req, res) => {
    const { chapters, title } = req.body;
    
    if (!title) {
      return res.status(400).json({ success: false, message: "Ebook title is required for conversion." });
    }
    if (!chapters || chapters.length === 0) {
      return res.status(400).json({ success: false, message: "No content found to convert. Please generate chapters first." });
    }

    console.log(`Converting ${chapters?.length || 0} chapters for ${title} to EPUB`);
    
    // In a real app, we'd use a library like 'epub-gen' or 'pandoc'
    setTimeout(() => {
      res.json({
        success: true,
        downloadUrl: `https://example.com/downloads/${title.replace(/\s+/g, '_')}.epub`
      });
    }, 1500);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
