"use client";

import { Category } from "./Dashboard";
import StyledDropdown, { DropdownOption } from "./StyledDropdown";

interface PostFormProps {
  title: string;
  setTitle: (value: string) => void;
  content: string;
  setContent: (value: string) => void;
  categoryId: string;
  setCategoryId: (value: string) => void;
  categories: Category[];
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export const PostForm = ({
  title,
  setTitle,
  content,
  setContent,
  categoryId,
  setCategoryId,
  categories,
  isSubmitting,
  error,
  onSubmit,
}: PostFormProps) => {
  const categoryOptions: DropdownOption[] = categories.map((category) => ({
    id: category._id,
    name: category.name,
  }));

  const handleCategoryChange = (option: DropdownOption | null) => {
    setCategoryId(option ? option.id : "");
  };

  return (
    <form onSubmit={onSubmit} className="w-full" id="post-form">
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md">
          {error}
        </div>
      )}

      <div className="mb-4">
        <div className="w-full">
          <StyledDropdown
            options={categoryOptions}
            selectedOption={categoryId}
            placeholder="Choose a community"
            onChange={handleCategoryChange}
            showAllOption={false}
            className="w-full"
          />
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-green-300"
          placeholder="Title"
          disabled={isSubmitting}
        />
      </div>

      <div className="mb-6">
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-green-300"
          placeholder="What's on your mind..."
          rows={8}
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
};
