/**
 * Side Menu Item Type
 */
export type TSideMenuItem = {
  /** Unique identifier */
  id: string;
  /** Text to be displayed on the menu */
  label: string;
  /** Current active status (deprecated: replaced by currentPath) */
  isActive?: boolean;
  /** Page path (used to determine active status) */
  href?: string;
  /** Additional CSS class - Used to hide specific navigation on tablet and above */
  className?: string;
};

/**
 * Side Menu Component Props Type
 */
export type TSideMenuProps = {
  /** Array of menu items */
  items: TSideMenuItem[];
  /** Menu open/close state */
  isOpen: boolean;
  /** Current page path (determines active status) */
  currentPath?: string;
  /** Callback function called when a menu item is clicked */
  onItemClick?: (item: TSideMenuItem) => void;
  /** Callback function to close the menu */
  onClose?: () => void;
  /** Additional CSS class */
  className?: string;
};
