import { GoogleGenAI, Type } from "@google/genai";
import {
  createPayPalOrder,
  capturePayPalOrder,
  verifyAndProcessPayPalWebhook
} from "./src/services/paypalServer";

export interface Env {
  GEMINI_API_KEY?: string;
  PAYPAL_CLIENT_ID?: string;
  PAYPAL_CLIENT_SECRET?: string;
  PAYPAL_ENVIRONMENT?: string;
  PAYPAL_WEBHOOK_ID?: string;
  DB?: any;
  ASSETS?: { fetch: typeof fetch };
}

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    // Helper for JSON responses with CORS headers
    const jsonResponse = (data: any, status = 200) => {
      return new Response(JSON.stringify(data), {
        status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    };

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    // Initialize Gemini SDK helper
    const getGeminiClient = () => {
      const apiKey = env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is missing.");
      }
      return new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { "User-Agent": "aistudio-build-worker" } },
      });
    };

    // Route handling
    if (pathname.startsWith("/api/")) {
      try {
        // Enforce Admin Verification on Protected Endpoints
        const protectedPrefixes = ["/api/gemini", "/api/publish", "/api/convert"];
        const isProtected = protectedPrefixes.some(prefix => pathname.startsWith(prefix));

        if (isProtected) {
          const authHeader = request.headers.get("Authorization");
          let isAuthorized = false;

          if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.substring(7);
            try {
              const parts = token.split('.');
              if (parts.length === 3) {
                const payload = JSON.parse(atob(parts[1]));
                if (payload.admin === true || payload.role === 'admin') {
                  isAuthorized = true;
                }
              }
            } catch (e) {
              isAuthorized = false;
            }
          }

          if (!isAuthorized) {
            return jsonResponse({ success: false, error: "Access Denied: Creator Studio & Admin authorization required." }, 403);
          }
        }

        if (pathname === "/api/gemini/generateEbookOutline" && request.method === "POST") {
          const body = await request.json() as any;
          const { niche, tone } = body;
          const ai = getGeminiClient();
          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: `Create a comprehensive ebook outline for the niche: "${niche}". Tone: ${tone}. Include title, subtitle, and 5-7 chapter titles with descriptions.`,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  subtitle: { type: Type.STRING },
                  chapters: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING }
                      },
                      required: ["title", "description"]
                    }
                  }
                },
                required: ["title", "subtitle", "chapters"]
              }
            }
          });
          const data = JSON.parse(response.text || "{}");
          return jsonResponse({ success: true, data });
        }

        if (pathname === "/api/gemini/generateChapterContent" && request.method === "POST") {
          const body = await request.json() as any;
          const { title, chapterTitle, chapterDescription, tone, depth, writingStyle = "conversational" } = body;
          const ai = getGeminiClient();
          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: `Write a full chapter for an ebook titled "${title}". Chapter Title: "${chapterTitle}". Context: ${chapterDescription}. Tone: ${tone}. Depth: ${depth}. Writing Style: ${writingStyle}. Format in Markdown with hook, key takeaways, and actionable steps.`,
          });
          return jsonResponse({ success: true, data: response.text || "" });
        }

        if (pathname === "/api/gemini/generateCoverArt" && request.method === "POST") {
          const body = await request.json() as any;
          const { title, niche, keywords = "", style = "modern, minimalist" } = body;
          const ai = getGeminiClient();
          const prompt = `Create a professional ebook cover. Title: "${title}", Niche: "${niche}", Keywords: ${keywords}, Style: ${style}. High resolution, clean typography, brand-aligned.`;
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: { parts: [{ text: prompt }] },
            config: { imageConfig: { aspectRatio: "3:4", imageSize: "1K" } }
          });
          let imgData = null;
          for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
              imgData = `data:image/png;base64,${part.inlineData.data}`;
              break;
            }
          }
          return jsonResponse({ success: true, data: imgData });
        }

        if (pathname === "/api/gemini/generateDetailedNicheReport" && request.method === "POST") {
          const body = await request.json() as any;
          const { topic } = body;
          const ai = getGeminiClient();
          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: `Perform a comprehensive NicheMaster market intelligence report for topic: "${topic}". Search demand, competition intensity, estimated monthly ebook royalty potential, audience buyer persona, keyword clusters, competitor market gaps, 3 ebook titles/angles, and validation checklist. Return JSON.`,
            config: {
              tools: [{ googleSearch: {} }],
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  topic: { type: Type.STRING },
                  opportunityScore: { type: Type.NUMBER },
                  demandLevel: { type: Type.STRING },
                  demandScore: { type: Type.NUMBER },
                  competitionLevel: { type: Type.STRING },
                  profitPotential: { type: Type.STRING },
                  trendDirection: { type: Type.STRING },
                  searchVolume: { type: Type.STRING },
                  keywordClusters: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        keyword: { type: Type.STRING },
                        volume: { type: Type.STRING },
                        difficulty: { type: Type.STRING },
                        intent: { type: Type.STRING }
                      },
                      required: ["keyword", "volume", "difficulty", "intent"]
                    }
                  },
                  targetAudience: {
                    type: Type.OBJECT,
                    properties: {
                      personaName: { type: Type.STRING },
                      ageRange: { type: Type.STRING },
                      painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                      buyingTriggers: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["personaName", "ageRange", "painPoints", "buyingTriggers"]
                  },
                  competitorNotes: {
                    type: Type.OBJECT,
                    properties: {
                      marketGap: { type: Type.STRING },
                      weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                      pricePointRange: { type: Type.STRING }
                    },
                    required: ["marketGap", "weaknesses", "pricePointRange"]
                  },
                  suggestedAngles: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        subtitle: { type: Type.STRING },
                        hook: { type: Type.STRING },
                        targetPrice: { type: Type.NUMBER }
                      },
                      required: ["title", "subtitle", "hook", "targetPrice"]
                    }
                  },
                  validationChecklist: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        item: { type: Type.STRING },
                        passed: { type: Type.BOOLEAN },
                        note: { type: Type.STRING }
                      },
                      required: ["item", "passed", "note"]
                    }
                  }
                },
                required: [
                  "topic", "opportunityScore", "demandLevel", "demandScore", "competitionLevel",
                  "profitPotential", "trendDirection", "searchVolume", "keywordClusters",
                  "targetAudience", "competitorNotes", "suggestedAngles", "validationChecklist"
                ]
              }
            }
          });
          const data = JSON.parse(response.text || "{}");
          return jsonResponse({ success: true, data });
        }

        if (pathname === "/api/paypal/create-order" && request.method === "POST") {
          const body = (await request.json()) as any;
          const { items } = body;
          const clientId = env.PAYPAL_CLIENT_ID;
          const clientSecret = env.PAYPAL_CLIENT_SECRET;
          const paypalEnv = env.PAYPAL_ENVIRONMENT || "sandbox";

          if (!clientId || !clientSecret) {
            return jsonResponse(
              {
                success: false,
                error: "PayPal API credentials not configured on worker (PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET missing)."
              },
              400
            );
          }

          const result = await createPayPalOrder(clientId, clientSecret, paypalEnv, items || []);
          return jsonResponse(result);
        }

        if (pathname === "/api/paypal/capture-order" && request.method === "POST") {
          const body = (await request.json()) as any;
          const { orderId, items, customerEmail, customerName } = body;
          const clientId = env.PAYPAL_CLIENT_ID;
          const clientSecret = env.PAYPAL_CLIENT_SECRET;
          const paypalEnv = env.PAYPAL_ENVIRONMENT || "sandbox";

          if (!clientId || !clientSecret) {
            return jsonResponse(
              {
                success: false,
                error: "PayPal API credentials not configured on worker (PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET missing)."
              },
              400
            );
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
          return jsonResponse(result);
        }

        if (pathname === "/api/paypal/webhook" && request.method === "POST") {
          const body = (await request.json()) as any;
          const clientId = env.PAYPAL_CLIENT_ID;
          const clientSecret = env.PAYPAL_CLIENT_SECRET;
          const paypalEnv = env.PAYPAL_ENVIRONMENT || "sandbox";
          const webhookId = env.PAYPAL_WEBHOOK_ID;

          if (!clientId || !clientSecret || !webhookId) {
            return jsonResponse(
              {
                success: false,
                error: "PayPal webhook credentials not configured (PAYPAL_WEBHOOK_ID missing)."
              },
              400
            );
          }

          const headers: Record<string, string | null> = {
            "paypal-auth-algo": request.headers.get("paypal-auth-algo"),
            "paypal-cert-url": request.headers.get("paypal-cert-url"),
            "paypal-transmission-id": request.headers.get("paypal-transmission-id"),
            "paypal-transmission-sig": request.headers.get("paypal-transmission-sig"),
            "paypal-transmission-time": request.headers.get("paypal-transmission-time")
          };

          const result = await verifyAndProcessPayPalWebhook(
            clientId,
            clientSecret,
            paypalEnv,
            webhookId,
            headers,
            body
          );
          return jsonResponse(result);
        }

        if (pathname === "/api/publish" && request.method === "POST") {
          const body = await request.json() as any;
          const { projectId, platforms } = body;
          const publicationIds = (platforms || []).reduce((acc: any, p: string) => {
            acc[p] = `PUB-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
            return acc;
          }, {});
          return jsonResponse({
            success: true,
            message: "Ebook submitted successfully.",
            publicationIds
          });
        }

        return jsonResponse({ error: "Endpoint not found" }, 404);
      } catch (err: any) {
        return jsonResponse({ success: false, error: err.message || "Server Error" }, 500);
      }
    }

    // Serve static assets or fallback to SPA index.html
    if (env.ASSETS) {
      const assetResponse = await env.ASSETS.fetch(request);
      if (assetResponse.status !== 404) {
        return assetResponse;
      }
      return env.ASSETS.fetch(new Request(new URL("/index.html", request.url).toString(), request));
    }

    return new Response("Not Found", { status: 404 });
  }
};
