
import type { AxiosInstance } from "axios";

import type { ApiSuccess } from "@/lib/types/api";

import type {
  Prompt,
  UpdatePromptInput,
} from "../types/prompt";

export async function updatePrompt(
  api: AxiosInstance,
  promptId: string,
  payload: UpdatePromptInput,
): Promise<Prompt> {
  const response = await api.patch<ApiSuccess<Prompt>>(
    `/prompts/${promptId}`,
    payload,
  );

  return response.data.data;
}
export async function deletePrompt(
  api: AxiosInstance,
  promptId: string,
): Promise<void> {
  await api.delete<void>(`/prompts/${promptId}`);
}