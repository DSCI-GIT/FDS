import type { ChatMessage, GirlCharacter, GirlProgress } from "./types";
import { buildCharacterPrompt } from "./social";

export const WEBLLM_MODEL_ID = "Qwen2.5-0.5B-Instruct-q4f16_1-MLC";

export type WebLLMStatus = "idle" | "unsupported" | "loading" | "ready" | "generating" | "error";

type WebLLMEngine = import("@mlc-ai/web-llm").WebWorkerMLCEngine;

let engine: WebLLMEngine | null = null;
let worker: Worker | null = null;

export function supportsWebLLM() {
  return typeof window !== "undefined" && "gpu" in navigator && typeof Worker !== "undefined";
}

export async function initializeWebLLM(
  onProgress: (progress: number, text: string) => void,
): Promise<WebLLMEngine> {
  if (engine) return engine;
  if (!supportsWebLLM()) throw new Error("WebGPU is unavailable.");

  const { CreateWebWorkerMLCEngine } = await import("@mlc-ai/web-llm");
  worker = new Worker(new URL("./webllm.worker.ts", import.meta.url), { type: "module" });
  engine = await CreateWebWorkerMLCEngine(worker, WEBLLM_MODEL_ID, {
    initProgressCallback: (report) => {
      onProgress(Math.round(Math.max(0, Math.min(1, report.progress)) * 100), report.text);
    },
  });
  return engine;
}

export async function streamCharacterReply({
  girl,
  progress,
  playerName,
  messages,
  onToken,
}: {
  girl: GirlCharacter;
  progress: GirlProgress;
  playerName: string;
  messages: ChatMessage[];
  onToken: (fullText: string) => void;
}) {
  if (!engine) throw new Error("The local model is not ready.");
  const prompt = buildCharacterPrompt(girl, progress, playerName, messages);
  const stream = await engine.chat.completions.create({
    messages: prompt,
    temperature: 0.82,
    top_p: 0.9,
    max_tokens: 190,
    stream: true,
  });

  let response = "";
  for await (const chunk of stream) {
    response += chunk.choices[0]?.delta?.content ?? "";
    onToken(response);
  }
  return response.trim();
}

export function interruptWebLLM() {
  engine?.interruptGenerate();
}

export async function disposeWebLLM() {
  if (engine) await engine.unload();
  worker?.terminate();
  engine = null;
  worker = null;
}
