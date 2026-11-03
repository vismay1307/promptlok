
export type PromptVersion = {
  id: string;
  promptId: string;
  versionNumber: number;
  content: string;
  changeNote: string | null;
  editorId: string;
  createdAt: string;
};

export type PromptVersionHistoryItem = {
  id: string;
  promptId: string;
  versionNumber: number;
  changeNote: string | null;
  editorId: string;
  createdAt: string;
};

export type CreatePromptVersionInput = {
  content: string;
  changeNote?: string;
};
