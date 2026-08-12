import { toast } from 'sonner';

export interface AIErrorResult {
  title: string;
  message: string;
  isSafety: boolean;
  isQuota: boolean;
  isNetwork: boolean;
}

/**
 * Classifies AI-related errors.
 */
export function classifyAIError(err: any, context: string): AIErrorResult {
  const message = err.message?.toLowerCase() || "";
  const code = err.code?.toLowerCase() || "";
  
  let title = `${context} failed`;
  let userMessage = "Please try again in a moment.";
  let isSafety = false;
  let isQuota = false;
  let isNetwork = false;

  if (!navigator.onLine) {
    title = "Network Disconnected";
    userMessage = "It looks like you're offline. Please reconnect to the internet to continue using AI features.";
    isNetwork = true;
  } else if (message.includes('quota') || message.includes('limit') || message.includes('429') || code === 'quota-exceeded' || message.includes('too many requests')) {
    title = "System Busy (Rate Limit)";
    userMessage = "The AI is currently processing many requests. Please wait about 60 seconds and try again.";
    isQuota = true;
  } else if (message.includes('safety') || message.includes('blocked') || message.includes('finish_reason_safety') || err.finishReason === 'SAFETY' || message.includes('candidate was blocked')) {
    title = "Content Policy Notice";
    userMessage = "The request couldn't be fulfilled because it triggered content safety filters. Try phrasing your prompt more neutrally.";
    isSafety = true;
  } else if (message.includes('fetch') || message.includes('networkerror') || message.includes('failed to fetch') || message.includes('deadline exceeded')) {
    title = "Connection Lost";
    userMessage = "We lost connection to the AI service. This is usually temporary—please try again after a quick refresh.";
    isNetwork = true;
  } else if (message.includes('api key') || message.includes('unauthorized') || message.includes('401')) {
    title = "Authentication Required";
    userMessage = "There seems to be a configuration issue with the AI service. Our team has been notified.";
  } else if (message.includes('invalid') || message.includes('bad request') || message.includes('400')) {
    title = "Request Error";
    userMessage = "The AI service received an invalid request. Try reducing the amount of text or simplifying your query.";
  } else if (message.includes('model not found') || message.includes('503') || message.includes('service unavailable')) {
    title = "Service Overloaded";
    userMessage = "The AI model is currently under high load or maintenance. Please try again in a few minutes.";
  } else if (code.startsWith('auth/')) {
    title = "Account Issue";
    userMessage = `There was a problem verifying your account: ${err.message}`;
  } else if (code === 'permission-denied') {
    title = "Access Restricted";
    userMessage = "You don't have the necessary permissions to perform this specific AI operation.";
  }

  return {
    title,
    message: userMessage,
    isSafety,
    isQuota,
    isNetwork
  };
}

/**
 * Handles AI-related errors by showing a toast.
 */
export function handleAIError(err: any, context: string) {
  console.error(`${context} failed:`, err);
  const { title, message } = classifyAIError(err, context);

  toast.error(title, {
    description: message,
    duration: 5000,
  });

  return { title, message };
}
