// import Groq from "groq-sdk";

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const getAllAIModels = () => {
  // const res = await groq.models.list();

  // return res.data.map((model) => ({
  //   id: model.id,
  //   owned_by: model.owned_by,
  //   active: "active" in model ? model.active : false,
  //   context_window: "context_window" in model ? (model.context_window ?? 0) : 0,
  //   max_completion_tokens:
  //     "max_completion_tokens" in model ? (model.max_completion_tokens ?? 0) : 0,
  // }));
  return [
    {
      id: "moonshotai/kimi-k2-instruct",
      owned_by: "Moonshot AI",
      active: true,
      context_window: 131_072,
      max_completion_tokens: 16_384,
    },
    {
      id: "groq/compound",
      owned_by: "Groq",
      active: true,
      context_window: 131_072,
      max_completion_tokens: 8192,
    },
    {
      id: "llama-3.1-8b-instant",
      owned_by: "Meta",
      active: true,
      context_window: 131_072,
      max_completion_tokens: 131_072,
    },
    {
      id: "meta-llama/llama-prompt-guard-2-22m",
      owned_by: "Meta",
      active: true,
      context_window: 512,
      max_completion_tokens: 512,
    },
    {
      id: "meta-llama/llama-4-maverick-17b-128e-instruct",
      owned_by: "Meta",
      active: true,
      context_window: 131_072,
      max_completion_tokens: 8192,
    },
    {
      id: "meta-llama/llama-guard-4-12b",
      owned_by: "Meta",
      active: true,
      context_window: 131_072,
      max_completion_tokens: 1024,
    },
    {
      id: "groq/compound-mini",
      owned_by: "Groq",
      active: true,
      context_window: 131_072,
      max_completion_tokens: 8192,
    },
    {
      id: "llama-3.3-70b-versatile",
      owned_by: "Meta",
      active: true,
      context_window: 131_072,
      max_completion_tokens: 32_768,
    },
    {
      id: "whisper-large-v3-turbo",
      owned_by: "OpenAI",
      active: true,
      context_window: 448,
      max_completion_tokens: 448,
    },
    {
      id: "openai/gpt-oss-20b",
      owned_by: "OpenAI",
      active: true,
      context_window: 131_072,
      max_completion_tokens: 65_536,
    },
    {
      id: "meta-llama/llama-4-scout-17b-16e-instruct",
      owned_by: "Meta",
      active: true,
      context_window: 131_072,
      max_completion_tokens: 8192,
    },
    {
      id: "moonshotai/kimi-k2-instruct-0905",
      owned_by: "Moonshot AI",
      active: true,
      context_window: 262_144,
      max_completion_tokens: 16_384,
    },
    {
      id: "allam-2-7b",
      owned_by: "SDAIA",
      active: true,
      context_window: 4096,
      max_completion_tokens: 4096,
    },
    {
      id: "playai-tts",
      owned_by: "PlayAI",
      active: true,
      context_window: 8192,
      max_completion_tokens: 8192,
    },
    {
      id: "openai/gpt-oss-120b",
      owned_by: "OpenAI",
      active: true,
      context_window: 131_072,
      max_completion_tokens: 65_536,
    },
    {
      id: "playai-tts-arabic",
      owned_by: "PlayAI",
      active: true,
      context_window: 8192,
      max_completion_tokens: 8192,
    },
    {
      id: "meta-llama/llama-prompt-guard-2-86m",
      owned_by: "Meta",
      active: true,
      context_window: 512,
      max_completion_tokens: 512,
    },
    {
      id: "qwen/qwen3-32b",
      owned_by: "Alibaba Cloud",
      active: true,
      context_window: 131_072,
      max_completion_tokens: 40_960,
    },
    {
      id: "whisper-large-v3",
      owned_by: "OpenAI",
      active: true,
      context_window: 448,
      max_completion_tokens: 448,
    },
  ];
};

export const create = () => {
  throw new Error("Not implemented yet");
};
