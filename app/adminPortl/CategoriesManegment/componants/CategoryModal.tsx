
"use client";


import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CategoryModalMode, CategoryType } from './category';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  mode: CategoryModalMode;
  categoryType: CategoryType;
  initialValue?: string;
}

const CategoryModal = ({
  isOpen,
  onClose,
  onSubmit,
  mode,
  categoryType,
  initialValue = '',
}: CategoryModalProps) => {
  const [name, setName] = useState(initialValue);
  const [error, setError] = useState('');

  //1
  useEffect(() => {
    if (isOpen) {
      setName(initialValue);
      setError('');
    }
  }, [isOpen, initialValue]);

  // 2
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedName = name.trim();
    
    if (!trimmedName) {
      setError('Category name is required');
      return;
    }
    
    if (trimmedName.length < 2) {
      setError('Category name must be at least 2 characters');
      return;
    }

    onSubmit(trimmedName);
    onClose();
  };

  // 3
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  //4
  const title = `${mode === 'add' ? 'Add New' : 'Edit'} ${
    categoryType === 'main' ? 'Main Category' : 'Sub Category'
  }`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        {/* 5 */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground transition-smooth hover:bg-hover-muted hover:text-foreground"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/*6 */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="categoryName"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Category Name
            </label>
            <input
              type="text"
              id="categoryName"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="Enter category name"
              className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-smooth"
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-destructive">{error}</p>
            )}
          </div>

          {/*7 */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-smooth hover:bg-hover-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-smooth hover:bg-accent/90"
            >
              {mode === 'add' ? 'Add Category' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
