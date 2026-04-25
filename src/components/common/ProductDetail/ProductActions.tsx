"use client";

import QuantityDropdown from "../QuantityDropdown";
import MenuDropdown from "../MenuDropdown";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { useRouter } from "next/navigation";
import { useModal } from "@/providers/ModalProvider";
import { useEffect } from "react";
import { useDeleteProduct } from "@/hooks/useDeleteProduct";
import { useFlashToast } from "@/stores/flashToast";
import { SessionExpiredError } from "@/lib/api/auth.errors";

type TProductActionsProps = {
  selectedQuantity: number;
  onQuantityChange: (quantity: number) => void;
  canEdit: boolean;
  productId: number;
  productName: string;
  showToast: (message: string, variant?: "success" | "error") => void;
};

export default function ProductActions({
  selectedQuantity,
  onQuantityChange,
  canEdit,
  productId,
  productName,
  showToast,
}: TProductActionsProps) {
  const router = useRouter();
  const { openModal, closeModal } = useModal();

  const { mutate: deleteProduct } = useDeleteProduct();

  const setFlash = useFlashToast((s) => s.setFlash);

  const handleDelete = () => {
    deleteProduct(productId, {
      onSuccess: () => {
        setFlash("Product deleted.", "success");
        closeModal();
        router.push("/products");
      },
      onError: (error) => {
        if (error instanceof SessionExpiredError) return;

        showToast("Failed to delete product.", "error");
      },
    });
  };

  const handleOpenConfirmModal = () => {
    openModal(
      <ConfirmationModal
        isOpen={true}
        onCancel={closeModal}
        onDelete={handleDelete}
        productName={productName}
        modalTitle="Delete this product?"
        modalDescription="This action cannot be undone."
        confirmButtonText="Delete Product"
        cancelButtonText="Cancel"
      />,
    );
  };

  useEffect(() => {
    if (selectedQuantity === 0) {
      onQuantityChange(1);
    }
  }, [selectedQuantity, onQuantityChange]);

  return (
    <div className="flex items-center">
      <span className="min-w-[32px] whitespace-nowrap px-4 text-[16px] sm:text-base">Quantity</span>
      <QuantityDropdown
        value={selectedQuantity === 0 ? 1 : selectedQuantity}
        onClick={onQuantityChange}
        type="product"
      />
      {canEdit && <MenuDropdown menuType="product" onDelete={handleOpenConfirmModal} />}
    </div>
  );
}
