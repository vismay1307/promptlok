
"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useCreateTag } from "@/hooks/use-create-tag";
import { useTags } from "@/hooks/use-tags";
import type { Tag } from "@/lib/types/taxonomy";

type TagInputProps = {
  value: Tag[];
  onChange: (tags: Tag[]) => void;
  disabled?: boolean;
  maxTags?: number;
  allowCreate?: boolean;
};

export function TagInput({
  value,
  onChange,
  disabled = false,
  maxTags = 10,
  allowCreate = true,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const searchQuery = inputValue.trim();

  const tagsQuery = useTags(searchQuery);
  const createTagMutation = useCreateTag();

  const availableTags = tagsQuery.data ?? [];
  const isAtLimit = value.length >= maxTags;

  const exactMatch = availableTags.find(
    (tag) =>
      tag.name.toLowerCase() === searchQuery.toLowerCase(),
  );

  const isAlreadySelected = (tag: Tag) =>
    value.some(
      (selectedTag) =>
        selectedTag.id === tag.id ||
        selectedTag.name.toLowerCase() ===
          tag.name.toLowerCase(),
    );

  const addTag = (tag: Tag) => {
    if (disabled || isAtLimit || isAlreadySelected(tag)) {
      return;
    }

    onChange([...value, tag]);
    setInputValue("");
  };

  const handleCreateTag = async () => {
    if (
      !allowCreate ||
      disabled ||
      isAtLimit ||
      !searchQuery ||
      exactMatch ||
      createTagMutation.isPending
    ) {
      return;
    }

    try {
      const createdTag =
        await createTagMutation.mutateAsync(searchQuery);

      addTag(createdTag);
    } catch {
      // Mutation error is displayed below.
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    if (exactMatch) {
      addTag(exactMatch);
      return;
    }

    if (allowCreate) {
      void handleCreateTag();
    }
  };

  const removeTag = (tagId: string) => {
    onChange(value.filter((tag) => tag.id !== tagId));
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex flex-wrap gap-2">
        {value.map((tag) => (
          <Badge
            key={tag.id}
            variant="secondary"
            className="gap-1 px-2 py-1"
          >
            <span>{tag.name}</span>

            <button
              type="button"
              onClick={() => removeTag(tag.id)}
              disabled={disabled}
              aria-label={`Remove ${tag.name}`}
              className="rounded-full outline-none hover:text-destructive disabled:pointer-events-none"
            >
              <X className="size-3" />
            </button>
          </Badge>
        ))}
      </div>

      <div className="space-y-2">
        <Input
          value={inputValue}
          onChange={(event) =>
            setInputValue(event.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder={
            isAtLimit
              ? `Maximum ${maxTags} tags reached`
              : allowCreate
                ? "Search or create a tag..."
                : "Search existing tags..."
          }
          disabled={disabled || isAtLimit}
        />

        {searchQuery && !isAtLimit && (
          <div className="rounded-lg border border-border bg-popover p-2">
            {tagsQuery.isPending && (
              <p className="px-2 py-2 text-sm text-muted-foreground">
                Searching tags...
              </p>
            )}

            {tagsQuery.isError && (
              <div className="flex items-center justify-between gap-2 px-2 py-2">
                <p className="text-sm text-destructive">
                  {tagsQuery.error.message ||
                    "Failed to load tags."}
                </p>

                <button
                  type="button"
                  onClick={() => tagsQuery.refetch()}
                  className="text-sm font-medium text-primary underline"
                >
                  Retry
                </button>
              </div>
            )}

            {!tagsQuery.isPending &&
              !tagsQuery.isError &&
              availableTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  disabled={isAlreadySelected(tag)}
                  onClick={() => addTag(tag)}
                  className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {tag.name}

                  {isAlreadySelected(tag) && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      Added
                    </span>
                  )}
                </button>
              ))}

            {!tagsQuery.isPending &&
              !tagsQuery.isError &&
              availableTags.length === 0 && (
                <p className="px-2 py-2 text-sm text-muted-foreground">
                  No matching tags found.
                </p>
              )}

            {allowCreate &&
              !tagsQuery.isPending &&
              !tagsQuery.isError &&
              searchQuery &&
              !exactMatch && (
                <button
                  type="button"
                  onClick={() => void handleCreateTag()}
                  disabled={createTagMutation.isPending}
                  className="mt-1 w-full rounded-md border-t border-border px-3 py-2 text-left text-sm font-medium text-primary hover:bg-accent disabled:opacity-50"
                >
                  {createTagMutation.isPending
                    ? "Creating tag..."
                    : `+ Create "${searchQuery}"`}
                </button>
              )}
          </div>
        )}

        {allowCreate && createTagMutation.isError && (
          <p className="text-sm text-destructive">
            {createTagMutation.error.message ||
              "Failed to create tag."}
          </p>
        )}

        <p className="text-xs text-muted-foreground">
          {value.length}/{maxTags} tags selected
        </p>
      </div>
    </div>
  );
}
