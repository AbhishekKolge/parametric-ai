import Groq from "groq-sdk";

const groq = new Groq({ apiKey: "" });

export const getAllModels = async () => {
  const res = await groq.models.list();

  return res.data.map((model) => ({
    id: model.id,
    owned_by: model.owned_by,
    active: "active" in model ? model.active : false,
    context_window: "context_window" in model ? (model.context_window ?? 0) : 0,
    max_completion_tokens:
      "max_completion_tokens" in model ? (model.max_completion_tokens ?? 0) : 0,
  }));
};
