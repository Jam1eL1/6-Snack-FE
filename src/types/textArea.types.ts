export type TTextAreaProps = {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
};

export type TTextAreaVariant = "cart" | "modal";

/**
 * @JJOBO
 * 1. Update the props for use by the relevant component.
 */
