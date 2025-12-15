

import { Plus, Pencil, Trash2, Layers, ArrowRight } from 'lucide-react';
import { SubCategory, MainCategory } from './category';

interface SubCategoriesListProps {
  subCategories: SubCategory[];
  selectedMainCategory: MainCategory | null;
  onAdd: () => void;
  onEdit: (subCategory: SubCategory) => void;
  onDelete: (subCategory: SubCategory) => void;
}

const SubCategoriesList = ({
  subCategories,
  selectedMainCategory,
  onAdd,
  onEdit,
  onDelete,
}: SubCategoriesListProps) => {
 
  if (!selectedMainCategory) {
    return (
      <div className="flex h-full flex-col rounded-lg border border-border bg-card">
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <ArrowRight className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground">
            Select a Main Category
          </h3>
          <p className="mt-2 max-w-sm text-muted-foreground">
            Choose a main category from the left panel to view and manage its sub categories
          </p>
        </div>
      </div>
    );
  }

  return (
 <div className="flex h-full flex-col rounded-lg border border-border bg-card">
  {/* 1 */}
  <div className="flex items-center justify-between border-b border-border p-4">
    <div>
      <h2 className="text-lg font-semibold text-foreground">Sub Categories</h2>
      <p className="mt-0.5 text-sm text-muted-foreground">
        For:{' '}
        <span className="font-medium text-accent">
          {selectedMainCategory.name}
        </span>
      </p>
    </div>

    <button
      onClick={onAdd}
      className="flex items-center gap-2 rounded-md bg-blue-500 px-3 py-2 text-sm font-medium text-white transition-smooth hover:bg-blue-600"
    >
      <Plus size={16} />
      <span className="hidden sm:inline">Add New</span>
    </button>
  </div>

  {/* 2 */}
  <div className="flex-1 overflow-y-auto p-2">
    {subCategories.length === 0 ? (
      <div className="flex h-full flex-col items-center justify-center py-12 text-center">
       
        <p className="text-muted-foreground">No sub categories yet</p>
        <p className="mt-1 text-sm text-muted-foreground/70">
          Add sub categories to organize "{selectedMainCategory.name}"
        </p>
      </div>
    ) : (
      <ul className="space-y-1">
        {subCategories.map((subCategory) => (
          <li key={subCategory.id}>
            <div
              className="group flex items-center justify-between rounded-md border border-transparent px-3 py-2.5 cursor-pointer transition-smooth
                         hover:bg-gray-200/60 dark:hover:bg-gray-700/40
                         active:bg-blue-500/20"
            >
              {/* 3 */}
              <span className="font-medium text-foreground">
                {subCategory.name}
              </span>

              {/* 4 */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-smooth">
                <button
                  onClick={() => onEdit(subCategory)}
                  className="rounded p-1.5 text-muted-foreground hover:bg-background hover:text-foreground transition-smooth"
                  aria-label={`Edit ${subCategory.name}`}
                >
                  <Pencil size={14} />
                </button>

                <button
                  onClick={() => onDelete(subCategory)}
                  className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-smooth"
                  aria-label={`Delete ${subCategory.name}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>

  {/* 5 */}
  <div className="border-t border-border px-4 py-3">
    <p className="text-sm text-muted-foreground">
      {subCategories.length}{' '}
      {subCategories.length === 1 ? 'sub category' : 'sub categories'}
    </p>
  </div>
</div>

  );
};

export default SubCategoriesList;
