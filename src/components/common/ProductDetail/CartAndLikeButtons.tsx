import React from "react";
import Button from "../../ui/Button";
import LikeIconSvg from "@/components/svg/LikeIconSvg";

type TCartAndLikeButtonsProps = {
  onAddToCart: () => void;
  isFavorite: boolean;
  productId: number;
  onToggleFavorite: (isFavoriteNow: boolean) => void;
};

export default function CartAndLikeButtons({ onAddToCart, isFavorite, onToggleFavorite }: TCartAndLikeButtonsProps) {
  return (
    <div className="flex gap-4 w-full">
      <Button type="primary" label="Add to Cart" className="w-full h-16 font-bold" onClick={onAddToCart} />

      <div
        className="w-16 h-16 border border-primary-300 rounded flex items-center justify-center cursor-pointer"
        onClick={() => onToggleFavorite(isFavorite)}
      >
        <LikeIconSvg isLiked={isFavorite} />
      </div>
    </div>
  );
}
