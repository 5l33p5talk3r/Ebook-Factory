import { auth } from "../lib/firebase";

async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  try {
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }
  } catch (e) {
    console.warn("Could not get auth token for Gemini request:", e);
  }
  return headers;
}

export async function generateEbookOutline(niche: string, tone: string) {
  const response = await fetch("/api/gemini/generateEbookOutline", {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify({ niche, tone })
  });
  const resData = await response.json();
  if (!resData.success) {
    throw new Error(resData.error || "Failed to generate outline");
  }
  return resData.data;
}

export async function generateChapterContent(title: string, chapterTitle: string, chapterDescription: string, tone: string, depth: string, writingStyle: string = "conversational") {
  const response = await fetch("/api/gemini/generateChapterContent", {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify({ title, chapterTitle, chapterDescription, tone, depth, writingStyle })
  });
  const resData = await response.json();
  if (!resData.success) {
    throw new Error(resData.error || "Failed to generate chapter content");
  }
  return resData.data;
}

export async function generateCoverArt(title: string, niche: string, keywords: string = "", style: string = "modern, minimalist") {
  const response = await fetch("/api/gemini/generateCoverArt", {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify({ title, niche, keywords, style })
  });
  const resData = await response.json();
  if (!resData.success) {
    throw new Error(resData.error || "Failed to generate cover art");
  }
  return resData.data;
}

export async function generateChapterSummary(chapterTitle: string, content: string) {
  const response = await fetch("/api/gemini/generateChapterSummary", {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify({ chapterTitle, content })
  });
  const resData = await response.json();
  if (!resData.success) {
    throw new Error(resData.error || "Failed to generate chapter summary");
  }
  return resData.data;
}

export async function generateChapterImage(chapterTitle: string, chapterDescription: string, style: string = "modern, minimalist, clean lines") {
  const response = await fetch("/api/gemini/generateChapterImage", {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify({ chapterTitle, chapterDescription, style })
  });
  const resData = await response.json();
  if (!resData.success) {
    throw new Error(resData.error || "Failed to generate chapter image");
  }
  return resData.data;
}

export async function checkGrammar(text: string) {
  const response = await fetch("/api/gemini/checkGrammar", {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify({ text })
  });
  const resData = await response.json();
  if (!resData.success) {
    throw new Error(resData.error || "Failed to check grammar");
  }
  return resData.data;
}

export async function translateChapter(title: string, content: string, targetLanguage: string) {
  const response = await fetch("/api/gemini/translateChapter", {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify({ title, content, targetLanguage })
  });
  const resData = await response.json();
  if (!resData.success) {
    throw new Error(resData.error || "Failed to translate chapter");
  }
  return resData.data;
}

export async function analyzeTrendingNiches() {
  const response = await fetch("/api/gemini/analyzeTrendingNiches", {
    method: "POST",
    headers: await getAuthHeaders()
  });
  const resData = await response.json();
  if (!resData.success) {
    throw new Error(resData.error || "Failed to analyze trending niches");
  }
  return resData.data;
}

export async function researchTopic(topic: string) {
  const response = await fetch("/api/gemini/researchTopic", {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify({ topic })
  });
  const resData = await response.json();
  if (!resData.success) {
    throw new Error(resData.error || "Failed to research topic");
  }
  return resData.data;
}

export async function factCheckContent(content: string, niche?: string, tone?: string) {
  const response = await fetch("/api/gemini/factCheckContent", {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify({ content, niche, tone })
  });
  const resData = await response.json();
  if (!resData.success) {
    throw new Error(resData.error || "Failed to fact check content");
  }
  return resData.data;
}

export async function generateDetailedNicheReport(topic: string) {
  const response = await fetch("/api/gemini/generateDetailedNicheReport", {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify({ topic })
  });
  const resData = await response.json();
  if (!resData.success) {
    throw new Error(resData.error || "Failed to generate detailed niche report");
  }
  return resData.data;
}
