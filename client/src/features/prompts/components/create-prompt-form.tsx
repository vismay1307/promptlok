
"use client";

import { useId, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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

import { useCreatePrompt } from "../hooks/use-create-prompt";
import {
  createPromptSchema,
  type CreatePromptInput,
} from "../types/prompt";

export function CreatePromptForm() {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const createPromptMutation = useCreatePrompt();

  const formId = useId();
  const router = useRouter();
  const categoryId = `${formId}-category`;
  const categoryErrorId = `${formId}-category-error`;
  const tagsId = `${formId}-tags`;
  const tagsErrorId = `${formId}-tags-error`;

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreatePromptInput>({
    resolver: zodResolver(createPromptSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      categoryId: "",
      tagIds: [],
      promptType: "text",
      aiModelMetadata: "",
    },
  });

  const onSubmit = async (values: CreatePromptInput) => {
    try {
      const payload: CreatePromptInput = {
        ...values,
        tagIds: selectedTags.map((tag) => tag.id),
      };

      await createPromptMutation.mutateAsync(payload);

      toast.success("Prompt created successfully.");

      reset();
      setSelectedTags([]);

      router.push("/vault");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create prompt. Please try again.",
      );
    }
  };

  const isPending = isSubmitting || createPromptMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a New Prompt</CardTitle>
        <CardDescription>
          Save and organize your AI prompts in your personal library.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor={`${formId}-title`}>Title *</Label>

            <Input
              id={`${formId}-title`}
              placeholder="e.g. Blog post generator"
              aria-invalid={!!errors.title}
              aria-describedby={
                errors.title ? `${formId}-title-error` : undefined
              }
              disabled={isPending}
              {...register("title")}
            />

            {errors.title && (
              <p
                id={`${formId}-title-error`}
                className="text-sm text-destructive"
              >
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor={`${formId}-description`}>
              Description
            </Label>

            <Textarea
              id={`${formId}-description`}
              placeholder="Briefly describe what this prompt does..."
              rows={3}
              aria-invalid={!!errors.description}
              aria-describedby={
                errors.description
                  ? `${formId}-description-error`
                  : undefined
              }
              disabled={isPending}
              {...register("description")}
            />

            {errors.description && (
              <p
                id={`${formId}-description-error`}
                className="text-sm text-destructive"
              >
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Prompt Content */}
          <div className="space-y-2">
            <Label htmlFor={`${formId}-content`}>
              Prompt Content *
            </Label>

            <Textarea
              id={`${formId}-content`}
              placeholder="Write your prompt instructions here..."
              rows={8}
              aria-invalid={!!errors.content}
              aria-describedby={
                errors.content ? `${formId}-content-error` : undefined
              }
              disabled={isPending}
              {...register("content")}
            />

            {errors.content && (
              <p
                id={`${formId}-content-error`}
                className="text-sm text-destructive"
              >
                {errors.content.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor={categoryId}>Category *</Label>

            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <CategorySelect
                  id={categoryId}
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isPending}
                  aria-invalid={!!errors.categoryId}
                  aria-describedby={
                    errors.categoryId ? categoryErrorId : undefined
                  }
                />
              )}
            />

            {errors.categoryId && (
              <p
                id={categoryErrorId}
                className="text-sm text-destructive"
              >
                {errors.categoryId.message}
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor={tagsId}>Tags</Label>

            <TagInput
              id={tagsId}
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
                errors.tagIds ? tagsErrorId : undefined
              }
            />

            {errors.tagIds && (
              <p
                id={tagsErrorId}
                className="text-sm text-destructive"
              >
                {errors.tagIds.message}
              </p>
            )}
          </div>

          {/* AI Model Metadata */}
          <div className="space-y-2">
            <Label htmlFor={`${formId}-aiModelMetadata`}>
              AI Model (Optional)
            </Label>

            <Input
              id={`${formId}-aiModelMetadata`}
              placeholder="e.g. GPT-5, Gemini, Claude"
              aria-invalid={!!errors.aiModelMetadata}
              aria-describedby={
                errors.aiModelMetadata
                  ? `${formId}-ai-model-error`
                  : undefined
              }
              disabled={isPending}
              {...register("aiModelMetadata")}
            />

            {errors.aiModelMetadata && (
              <p
                id={`${formId}-ai-model-error`}
                className="text-sm text-destructive"
              >
                {errors.aiModelMetadata.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isPending}
              className="min-w-36"
            >
              {isPending ? "Creating..." : "Create Prompt"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
