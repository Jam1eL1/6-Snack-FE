/**
 * Category menu item based on the Prisma schema.
 */
export type TCategoryItem = {
  /** Unique identifier */
  id: number;
  /** Category name */
  name: string;
  /** Parent category ID */
  parentId?: number | null;
  /** Child categories */
  children?: TCategoryItem[];
  /** Whether the category is active */
  isActive?: boolean;
  /** Optional menu icon */
  icon?: React.ReactNode;
  /** Optional page path */
  href?: string;
};

/**
 * SubCategoryMenu props.
 */
export type TSubCategoryMenuProps = {
  /** Main category items */
  categories: TCategoryItem[];
  /** Current path used to determine the active state */
  currentPath?: string;
  /** Called when a menu item is selected */
  onItemClick?: (item: TCategoryItem) => void;
  /** Additional CSS classes */
  className?: string;
};
