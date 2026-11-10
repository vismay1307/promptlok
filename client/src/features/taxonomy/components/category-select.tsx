
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/use-categories";

type CategorySelectProps = {
  id: string;
  value?: string;
  onValueChange: (categoryId: string) => void;
  disabled?: boolean;
  placeholder?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

export function CategorySelect({
  id,
  value,
  onValueChange,
  disabled = false,
  placeholder = "Select a category",
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
}: CategorySelectProps) {
  const categoriesQuery = useCategories();

  const categories = categoriesQuery.data ?? [];
  const selectedCategory = categories.find(
    (category) => category.id === value,
  );

  const isLoading = categoriesQuery.isPending;
  const hasError = categoriesQuery.isError;
  const isEmpty = !isLoading && !hasError && categories.length === 0;

  const isDisabled =
    disabled || isLoading || hasError || isEmpty;

  return (
    <div className="w-full space-y-2">
      <Select
        value={value ?? null}
        onValueChange={(selectedValue) => {
          if (selectedValue) {
            onValueChange(selectedValue);
          }
        }}
        disabled={isDisabled}
      >
        <SelectTrigger
          id={id}
          className="w-full"
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
        >
          <SelectValue
            placeholder={
              isLoading
                ? "Loading categories..."
                : isEmpty
                  ? "No categories available"
                  : placeholder
            }
          >
            {selectedCategory?.name ?? ""}
          </SelectValue>
        </SelectTrigger>

        <SelectContent>
          {categories.map((category) => (
            <SelectItem
              key={category.id}
              value={category.id}
            >
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasError && (
        <div className="flex items-center justify-between gap-3 text-sm">
          <p className="text-destructive" role="alert">
            {categoriesQuery.error.message ||
              "Failed to load categories."}
          </p>

          <button
            type="button"
            onClick={() => categoriesQuery.refetch()}
            disabled={categoriesQuery.isFetching}
            className="shrink-0 font-medium text-primary underline underline-offset-4 disabled:opacity-50"
          >
            {categoriesQuery.isFetching ? "Retrying..." : "Retry"}
          </button>
        </div>
      )}

      {isEmpty && (
        <p className="text-sm text-muted-foreground">
          No categories have been created yet.
        </p>
      )}
    </div>
  );
}
