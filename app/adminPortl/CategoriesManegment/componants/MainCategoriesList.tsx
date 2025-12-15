

import { Plus, Pencil, Trash2, FolderOpen } from 'lucide-react';
import { MainCategory } from './category';

interface MainCategoriesListProps {
  categories: MainCategory[];
  selectedCategoryId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onEdit: (category: MainCategory) => void;
  onDelete: (category: MainCategory) => void;
  getSubCategoryCount: (mainCategoryId: string) => number;
}

const MainCategoriesList = ({
  categories,
  selectedCategoryId,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
}: MainCategoriesListProps) => {
  return (
  <div className="flex h-full flex-col rounded-lg border border-border bg-card">
  {/* 1 */}
  <div className="flex items-center justify-between border-b border-border p-4">
    <h2 className="text-lg font-semibold text-foreground">Main Categories</h2>
    <button
      onClick={onAdd}
      className="flex items-center gap-2 rounded-md bg-blue-500 px-3 py-2 text-sm font-medium text-white transition-smooth hover:bg-accent/90"
    >
      <Plus size={16} />
      <span className="hidden sm:inline">Add New</span>
    </button>
  </div>

  {/* 2 */}
  <div className="flex-1 overflow-y-auto p-2">
    {categories.length === 0 ? (
      <div className="flex h-full flex-col items-center justify-center py-12 text-center">
        <FolderOpen className="mb-3 h-12 w-12 text-muted-foreground/50" />
        <p className="text-muted-foreground">No categories yet</p>
        <p className="mt-1 text-sm text-muted-foreground/70">
          to create your first category Click "Add New"
        </p>
      </div>
    ) : (
      <ul className="space-y-1">
        {categories.map((category) => {
          const isSelected = selectedCategoryId === category.id;

          return (
            <li key={category.id}>
              <div
                onClick={() => onSelect(category.id)}
                className={`group flex items-center justify-between rounded-md px-3 py-2.5 cursor-pointer transition-smooth
                  ${
                    isSelected
                      ? 'bg-blue-500/20 border border-blue-500/30'
                      : 'hover:bg-gray-200/60 dark:hover:bg-gray-700/40 border border-transparent'
                  }
                `}
              >
                {/* 3 */}
                <span
                  className={`font-medium ${
                    isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-foreground'
                  }`}
                >
                  {category.name}
                </span>

                {/* 4 */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-smooth">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(category);
                    }}
                    className="rounded p-1.5 text-muted-foreground hover:bg-background hover:text-foreground transition-smooth"
                    aria-label={`Edit ${category.name}`}
                  >
                    <Pencil size={14} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(category);
                    }}
                    className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-smooth"
                    aria-label={`Delete ${category.name}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    )}
  </div>

  <div className="border-t border-border px-4 py-3">
    <p className="text-sm text-muted-foreground">
      {categories.length}{' '}
      {categories.length === 1 ? 'Main category' : 'Main categories'}
    </p>
  </div>
</div>

  );
};

export default MainCategoriesList;
