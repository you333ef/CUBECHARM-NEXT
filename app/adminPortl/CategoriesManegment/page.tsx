
"use client";
import { useState, useMemo } from 'react';

import { MainCategory, SubCategory, CategoryModalMode, CategoryType } from './componants/category';
import MainCategoriesList from './componants/MainCategoriesList';
import SubCategoriesList from './componants/SubCategoriesList';
import CategoryModal from './componants/CategoryModal';
import ConfirmDeleteModal from '../sharedAdmin/DELETE_CONFIRM';

//1
const generateId = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const CategoriesPage = () => {
  
  
  // 2
const [mainCategories, setMainCategories] = useState<any[]>([]);
const [subCategories, setSubCategories] = useState<any[]>([]);

  // 3
  const [selectedMainCategoryId, setSelectedMainCategoryId] = useState<string | null>(null);
  
  // 4
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryModalMode, setCategoryModalMode] = useState<CategoryModalMode>('add');
  const [categoryModalType, setCategoryModalType] = useState<CategoryType>('main');
  const [editingCategory, setEditingCategory] = useState<MainCategory | SubCategory | null>(null);
  
  //5
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<{
    type: CategoryType;
    item: MainCategory | SubCategory;
  } | null>(null);

  
  // 6
  const selectedMainCategory = useMemo(() => {
    return mainCategories.find((cat) => cat.id === selectedMainCategoryId) || null;
  }, [mainCategories, selectedMainCategoryId]);

  // 7
  const filteredSubCategories = useMemo(() => {
    if (!selectedMainCategoryId) return [];
    return subCategories.filter((sub) => sub.mainCategoryId === selectedMainCategoryId);    
  }, [subCategories, selectedMainCategoryId]);

  // 8
  const getSubCategoryCount = (mainCategoryId: string) => {
    return subCategories.filter((sub) => sub.mainCategoryId === mainCategoryId).length;
  };

  // ==================== 9 ====================

  const handleAddMainCategory = () => {
    setCategoryModalMode('add');
    setCategoryModalType('main');
    setEditingCategory(null);
    setCategoryModalOpen(true);
  };

  const handleEditMainCategory = (category: MainCategory) => {
    setCategoryModalMode('edit');
    setCategoryModalType('main');
    setEditingCategory(category);
    setCategoryModalOpen(true);
  };

  const handleDeleteMainCategory = (category: MainCategory) => {
    setDeletingItem({ type: 'main', item: category });
    setDeleteModalOpen(true);
  };

  // ==================== 10 ====================

  const handleAddSubCategory = () => {
    if (!selectedMainCategoryId) return;
    setCategoryModalMode('add');
    setCategoryModalType('sub');
    setEditingCategory(null);
    setCategoryModalOpen(true);
  };

  const handleEditSubCategory = (subCategory: SubCategory) => {
    setCategoryModalMode('edit');
    setCategoryModalType('sub');
    setEditingCategory(subCategory);
    setCategoryModalOpen(true);
  };

  const handleDeleteSubCategory = (subCategory: SubCategory) => {
    setDeletingItem({ type: 'sub', item: subCategory });
    setDeleteModalOpen(true);
  };

  // ==================== 11====================

  
  const handleCategorySubmit = (name: string) => {
    if (categoryModalType === 'main') {
      if (categoryModalMode === 'add') {
       
        //12
        const newCategory: MainCategory = {
          id: generateId(),
          name,
        };
        setMainCategories((prev) => [...prev, newCategory]);
      } else if (editingCategory) {
       
        // 13
        setMainCategories((prev) =>
          prev.map((cat) =>
            cat.id === editingCategory.id ? { ...cat, name } : cat
          )
        );
      }
    } else {
      //14
      if (categoryModalMode === 'add' && selectedMainCategoryId) {
      
        // 15
        const newSubCategory: SubCategory = {
          id: generateId(),
          name,
          mainCategoryId: selectedMainCategoryId,
        };
        setSubCategories((prev) => [...prev, newSubCategory]);
      } else if (editingCategory) {
       
        // 16
        setSubCategories((prev) =>
          prev.map((sub) =>
            sub.id === editingCategory.id ? { ...sub, name } : sub
          )
        );
      }
    }
  };

  
  const handleConfirmDelete = () => {
    if (!deletingItem) return;

    if (deletingItem.type === 'main') {
     
      //17
      const mainCategoryId = deletingItem.item.id;
      setMainCategories((prev) => prev.filter((cat) => cat.id !== mainCategoryId));
      setSubCategories((prev) => prev.filter((sub) => sub.mainCategoryId !== mainCategoryId));
      
      // 18
      if (selectedMainCategoryId === mainCategoryId) {
        setSelectedMainCategoryId(null);
      }
    } else {
      
      //19
      setSubCategories((prev) => prev.filter((sub) => sub.id !== deletingItem.item.id));
    }

    setDeletingItem(null);
  };


  return (
    <div className="min-h-screen bg-background">
     
      

      {/*20*/}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid h-[calc(100vh-200px)] min-h-[500px] grid-cols-1 gap-6 lg:grid-cols-2">
          {/* 21 */}
          <MainCategoriesList
            categories={mainCategories}
            selectedCategoryId={selectedMainCategoryId}
            onSelect={setSelectedMainCategoryId}
            onAdd={handleAddMainCategory}
            onEdit={handleEditMainCategory}
            onDelete={handleDeleteMainCategory}
            getSubCategoryCount={getSubCategoryCount}
          />

          {/* 22 */}
          <SubCategoriesList
            subCategories={filteredSubCategories}
            selectedMainCategory={selectedMainCategory}
            onAdd={handleAddSubCategory}
            onEdit={handleEditSubCategory}
            onDelete={handleDeleteSubCategory}
          />
        </div>
      </main>

      {/* 23 */}
      <CategoryModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onSubmit={handleCategorySubmit}
        mode={categoryModalMode}
        categoryType={categoryModalType}
        initialValue={editingCategory?.name}
      />

      {/* 24 */}
     {deleteModalOpen && deletingItem && (
  <ConfirmDeleteModal
    name={deletingItem.item.name}
    actionType="delete"
    DeleteTrue={() => {
      handleConfirmDelete();
      setDeleteModalOpen(false);
    }}
    onCancel={() => {
      setDeleteModalOpen(false);
      setDeletingItem(null);
    }}
  />
)}

    </div>
  );
};

export default CategoriesPage;
