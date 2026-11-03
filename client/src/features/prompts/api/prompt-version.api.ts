
import type { AxiosInstance } from "axios";

import type { ApiSuccess } from "@/lib/types/api";

import type { PromptDetail } from "../types/prompt";
import type {
  CreatePromptVersionInput,
  PromptVersion,
  PromptVersionHistoryItem,
} from "../types/prompt-version";

export async function getPromptDetail(
  api: AxiosInstance,
  promptId: string,
): Promise<PromptDetail> {
  const response = await api.get<ApiSuccess<PromptDetail>>(
    `/prompts/${promptId}`,
  );

  return response.data.data;
}

export async function getPromptVersions(
  api: AxiosInstance,
  promptId: string,
): Promise<PromptVersionHistoryItem[]> {
  const response = await api.get<
    ApiSuccess<PromptVersionHistoryItem[]>
  >(`/prompts/${promptId}/versions`);

  return response.data.data;
}

export async function getPromptVersion(
  api: AxiosInstance,
  promptId: string,
  versionId: string,
): Promise<PromptVersion> {
  const response = await api.get<ApiSuccess<PromptVersion>>(
    `/prompts/${promptId}/versions/${versionId}`,
  );

  return response.data.data;
}

export async function createPromptVersion(
  api: AxiosInstance,
  promptId: string,
  payload: CreatePromptVersionInput,
): Promise<PromptVersion> {
  const response = await api.post<ApiSuccess<PromptVersion>>(
    `/prompts/${promptId}/versions`,
    payload,
  );

  return response.data.data;
}

export async function restorePromptVersion(
  api: AxiosInstance,
  promptId: string,
  versionId: string,
): Promise<PromptVersion> {
  const response = await api.post<ApiSuccess<PromptVersion>>(
    `/prompts/${promptId}/versions/${versionId}/restore`,
  );

  return response.data.data;
}
