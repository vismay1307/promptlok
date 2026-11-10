
"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { Tag } from "@/lib/types/taxonomy";

import { CategorySelect } from "@/features/taxonomy/components/category-select";
import { TagInput } from "@/features/taxonomy/components/tag-input";

import { useUpdatePrompt } from "../hooks/use-update-prompt";
import type { PromptDetail } from "../types/prompt";

const editPromptSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must contain at least 3 characters")
    .max(140, "Title cannot exceed 140 characters"),

  description: z
    .string()
    .max(2000, "Description cannot exceed 2000 characters"),

  categoryId: z
    .string()
    .uuid("Please select a valid category")
    .or(z.literal("")),

  tagIds: z
    .array(z.string().uuid())
    .max(10, "You can select a maximum of 10 tags")
    .refine(
      (tagIds) => new Set(tagIds).size === tagIds.length,
      "Duplicate tags are not allowed",
    ),

  aiModelMetadata: z
    .string()
    .max(100, "AI model metadata cannot exceed 100 characters"),
});

type EditPromptFormValues = z.infer<typeof editPromptSchema>;

type EditPromptFormProps = {
  prompt: PromptDetail;
  onCancel: () => void;
  onSaved: () => void;
};

export function EditPromptForm({
  prompt,
  onCancel,
  onSaved,
}: EditPromptFormProps) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>(
    prompt.tags ?? [],
  );

  const updatePromptMutation = useUpdatePrompt();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EditPromptFormValues>({
    resolver: zodResolver(editPromptSchema),
    defaultValues: {
      title: prompt.title,
      description: prompt.description ?? "",
      categoryId: prompt.categoryId ?? "",
      tagIds: (prompt.tags ?? []).map((tag) => tag.id),
      aiModelMetadata: prompt.aiModelMetadata ?? "",
    },
  });

  const onSubmit = async (values: EditPromptFormValues) => {
    try {
      await updatePromptMutation.mutateAsync({
        promptId: prompt.id,
        payload: {
          title: values.title,
          description: values.description.trim() || null,
          ...(values.categoryId
            ? { categoryId: values.categoryId }
            : {}),
          tagIds: selectedTags.map((tag) => tag.id),
          aiModelMetadata:
            values.aiModelMetadata.trim() || null,
        },
      });

      toast.success("Prompt updated successfully.");
      onSaved();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update prompt. Please try again.",
      );
    }
  };

  const isPending =
    isSubmitting || updatePromptMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Prompt</CardTitle>
        <CardDescription>
          Update your prompt details, category, tags and AI model metadata.
          Prompt content is managed separately through version history.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title *</Label>

            <Input
              id="edit-title"
              placeholder="e.g. Blog post generator"
              aria-invalid={!!errors.title}
              disabled={isPending}
              {...register("title")}
            />

            {errors.title && (
              <p className="text-sm text-destructive">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>

            <Textarea
              id="edit-description"
              placeholder="Briefly describe what this prompt does..."
              rows={3}
              aria-invalid={!!errors.description}
              disabled={isPending}
              {...register("description")}
            />

            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Category */}
<div className="space-y-2">
  <Label htmlFor="edit-category">Category</Label>

  <Controller
    name="categoryId"
    control={control}
    render={({ field }) => (
      <CategorySelect
        id="edit-category"
        value={field.value}
        onValueChange={field.onChange}
        disabled={isPending}
        aria-invalid={!!errors.categoryId}
        aria-describedby={
          errors.categoryId ? "edit-category-error" : undefined
        }
      />
    )}
  />

  {errors.categoryId && (
    <p
      id="edit-category-error"
      className="text-sm text-destructive"
    >
      {errors.categoryId.message}
    </p>
  )}
</div>

          {/* Tags */}
<div className="space-y-2">
  <Label htmlFor="edit-tags">Tags</Label>

  <TagInput
    id="edit-tags"
    value={selectedTags}
    onChange={(tags) => {
      setSelectedTags(tags);

      setValue(
        "tagIds",
        tags.map((tag) => tag.id),
        { shouldValidate: true },
      );
    }}
    disabled={isPending}
    maxTags={10}
    aria-invalid={!!errors.tagIds}
    aria-describedby={
      errors.tagIds ? "edit-tags-error" : undefined
    }
  />

  {errors.tagIds && (
    <p
      id="edit-tags-error"
      className="text-sm text-destructive"
    >
      {errors.tagIds.message}
    </p>
  )}
</div>
          {/* AI Model Metadata */}
          <div className="space-y-2">
            <Label htmlFor="edit-aiModelMetadata">
              AI Model (Optional)
            </Label>

            <Input
              id="edit-aiModelMetadata"
              placeholder="e.g. GPT-5, Gemini, Claude"
              aria-invalid={!!errors.aiModelMetadata}
              disabled={isPending}
              {...register("aiModelMetadata")}
            />

            {errors.aiModelMetadata && (
              <p className="text-sm text-destructive">
                {errors.aiModelMetadata.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={onCancel}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isPending}
              className="min-w-36"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
