// src/stores/categoryStore.ts
import { CATEGORIES } from "@/lib/constants/categories";
import { create } from "zustand";

type TCategoryState = {
  selectedCategory: {
    id: number;
    parent: string;
    child: string;
  } | null;
  selectedChild: { id: number; name: string } | null; // Selected child category
  childrenCategories: Array<{ id: number; name: string }>; // All children of the selected parent

  setSelectedCategory: (category: { id: number; parent: string; child: string } | null) => void;
  setSelectedChild: (child: { id: number; name: string } | null) => void; // Set the selected child
  clearSelectedCategory: () => void;
  findCategoryPath: (categoryId: number) => void;
  setChildrenCategories: (children: Array<{ id: number; name: string }>) => void;

  // Getter functions
  isCategorySelected: (categoryId: number) => boolean;
  getCurrentCategoryName: () => string;
  isChildCategorySelected: () => boolean;
  getCurrentChildrenCategories: () => Array<{ id: number; name: string }>;
};

export const useCategoryStore = create<TCategoryState>((set, get) => ({
  selectedCategory: null,
  selectedChild: null, // Selected child category
  childrenCategories: [], // All children of the selected parent

  setSelectedCategory: (category) => set({ selectedCategory: category }),

  setSelectedChild: (child) => set({ selectedChild: child }),

  clearSelectedCategory: () =>
    set({
      selectedCategory: null,
      selectedChild: null,
      childrenCategories: [],
    }),

  setChildrenCategories: (children) => set({ childrenCategories: children }),

  findCategoryPath: (categoryId: number) => {
    const categories = CATEGORIES;

    // Look for a matching parent category first.
    const parentCategory = categories.parentCategory.find((cat) => cat.id === categoryId);
    if (parentCategory) {
      // Store the parent and all of its child categories.
      const children =
        categories.childrenCategory[parentCategory.name as keyof typeof categories.childrenCategory] || [];
      set({
        selectedCategory: {
          id: categoryId,
          parent: parentCategory.name,
          child: "", // Leave child empty when only the parent is selected.
        },
        selectedChild: null, // Clear the selected child.
        childrenCategories: children, // Store all children of the selected parent.
      });
      return;
    }

    // Look for a matching child category.
    for (const [parentName, children] of Object.entries(categories.childrenCategory)) {
      const child = children.find((c) => c.id === categoryId);
      if (child) {
        set({
          selectedCategory: {
            id: categoryId,
            parent: parentName,
            child: child.name,
          },
          selectedChild: child, // Store the selected child.
          childrenCategories: children, // Store all children of the selected parent.
        });
        return;
      }
    }
  },

  // Getter functions
  isCategorySelected: (categoryId: number) => {
    const state = get();
    return state.selectedCategory?.id === categoryId;
  },

  getCurrentCategoryName: () => {
    const state = get();
    if (state.selectedChild) {
      return state.selectedChild.name;
    }
    return state.selectedCategory?.parent || "All";
  },

  isChildCategorySelected: () => {
    const state = get();
    return state.selectedChild !== null;
  },

  getCurrentChildrenCategories: () => {
    const state = get();
    return state.childrenCategories;
  },
}));
