/**
 * Pagination component props.
 */
export type TPaginationProps = {
  /** Current page number. */
  currentPage: number;
  /** Total page count. */
  totalPages: number;
  /** Called when the selected page changes. */
  onPageChange: (page: number) => void;
  /** Called when moving to the previous page. */
  onPrevPage?: () => void;
  /** Called when moving to the next page. */
  onNextPage?: () => void;
  /** Additional CSS classes. */
  className?: string;
};
