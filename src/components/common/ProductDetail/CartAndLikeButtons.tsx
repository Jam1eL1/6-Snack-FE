import React from "react";
import Button from "../../ui/Button";
import LikeIconSvg from "@/components/svg/LikeIconSvg";

type TCartAndLikeButtonsProps = {
  onAddToCart: () => void;
  isFavorite: boolean;
  isFavoritePending?: boolean;
  productId: number;
  onToggleFavorite: (isFavoriteNow: boolean) => void;
};

export default function CartAndLikeButtons({
  onAddToCart,
  isFavorite,
  isFavoritePending = false,
  onToggleFavorite,
}: TCartAndLikeButtonsProps) {
  return (
    <div className="flex gap-4 w-full">
      <Button type="primary" label="Add to Cart" className="w-full h-16 font-bold" onClick={onAddToCart} />

      <button
        type="button"
        className="w-16 h-16 border border-primary-300 rounded flex items-center justify-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
        onClick={() => onToggleFavorite(isFavorite)}
        disabled={isFavoritePending}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <LikeIconSvg isLiked={isFavorite} />
      </button>
    </div>
  );
}
