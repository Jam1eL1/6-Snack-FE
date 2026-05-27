import React from "react";
import ic_checkbox from "@/assets/icons/ic_checkbox.svg";
import ic_checkbox_active from "@/assets/icons/ic_checkbox_active.svg";
import Image from "next/image";
import Button from "@/components/ui/Button";
import QuantityDropdown from "@/components/common/QuantityDropdown";
import { TGetCartItemsResponse } from "@/types/cart.types";
import { deleteSelectedItems, toggleCheckAllItems, toggleCheckItem, updateItemQuantity } from "@/lib/api/cart.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils/formatPrice.util";
import { queryKeys } from "@/lib/queryKeys";
import Link from "next/link";
import DogSpinner from "@/components/common/DogSpinner";

type TCartItemProps = {
  cartItems: TGetCartItemsResponse | undefined;
  isPending: boolean;
  canPurchase: boolean;
  checkedCartItemIds: number[];
  isDisabled: boolean;
  setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  orderRequest: (cartItemsId: number[]) => void;
};

export default function CartItem({
  cartItems,
  isPending,
  canPurchase,
  checkedCartItemIds,
  isDisabled,
  setIsDisabled,
  orderRequest,
}: TCartItemProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();

  const isAllChecked = cartItems?.cart.length && cartItems?.cart.every((item) => item.isChecked);

  // 장바구니 선택 - Optimistic Update
  const { mutate: toggleCheckCartItem } = useMutation<
    void,
    Error,
    { cartItemId: number; isChecked: boolean },
    { previousCartItems: TGetCartItemsResponse | undefined }
  >({
    mutationFn: ({ cartItemId, isChecked }) => toggleCheckItem(cartItemId, isChecked),
    onMutate: async ({ cartItemId, isChecked }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cartItems.all });

      const previousCartItems = queryClient.getQueryData<TGetCartItemsResponse>(queryKeys.cartItems.all);

      queryClient.setQueryData<TGetCartItemsResponse>(queryKeys.cartItems.all, (old) =>
        old ? { ...old, cart: old.cart.map((item) => (item.id === cartItemId ? { ...item, isChecked } : item)) } : old,
      );

      return { previousCartItems };
    },
    onError: (error, variables, context) => {
      if (context?.previousCartItems) {
        queryClient.setQueryData(queryKeys.cartItems.all, context.previousCartItems);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.cartItems.all }),
  });

  // 장바구니 선택 삭제
  const { mutate: deleteCheckedCartItems } = useMutation<void, Error, number[]>({
    mutationFn: (cartItemIds) => deleteSelectedItems(cartItemIds),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.cartItems.all }),
  });

  // 장바구니 수량 선택
  const { mutate: updateCartItemQuantity } = useMutation<void, Error, { cartItemId: number; quantity: number }>({
    mutationFn: ({ cartItemId, quantity }) => updateItemQuantity(cartItemId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.cartItems.all }),
  });

  // 장바구니 전체 선택 / 전체 해제 - Optimistic update
  const { mutate: toggleCheckAllCartItems } = useMutation<
    void,
    Error,
    boolean,
    { previousCartItems: TGetCartItemsResponse | undefined }
  >({
    mutationFn: (isAllChecked) => toggleCheckAllItems(!isAllChecked),
    onMutate: async (isAllChecked) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cartItems.all });

      const previousCartItems = queryClient.getQueryData<TGetCartItemsResponse>(queryKeys.cartItems.all);

      queryClient.setQueryData<TGetCartItemsResponse>(queryKeys.cartItems.all, (old) =>
        old ? { ...old, cart: old.cart.map((item) => ({ ...item, isChecked: !isAllChecked })) } : old,
      );

      return { previousCartItems };
    },
    onError: (error, variables, context) => {
      if (context?.previousCartItems) {
        queryClient.setQueryData(queryKeys.cartItems.all, context.previousCartItems);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.cartItems.all }),
  });

  return (
    <div className="flex flex-col sm:gap-[20px] sm:py-[20px] sm:px-[40px] sm:shadow-[0px_0px_10px_0px_rgba(0,0,0,0.12)] md:py-[40px] md:px-[50px]">
      <div className="flex justify-between items-center h-[40px]">
        <div className="flex justify-center items-center gap-[10px]">
          <button
            onClick={() => {
              if (isAllChecked === 0 || isAllChecked === undefined) return;
              toggleCheckAllCartItems(isAllChecked);
            }}
            className="relative w-[20px] h-[20px] cursor-pointer sm:w-[24px] sm:h-[24px]"
          >
            <Image
              src={isAllChecked ? ic_checkbox_active : ic_checkbox}
              alt="체크박스"
              fill
              className="object-contain"
            />
          </button>

          <p className="font-bold text-[16px]/[20px] tracking-tight text-black sm:text-[18px]/[22px]">
            전체 선택 ({checkedCartItemIds?.length ?? 0}개)
          </p>
        </div>

        <button
          onClick={() => {
            if (checkedCartItemIds.length === 0) return;
            deleteCheckedCartItems(checkedCartItemIds);
          }}
          className="font-normal text-[14px]/[17px] tracking-tight underline text-primary-600 cursor-pointer sm:text-[16px]/[20px]"
        >
          선택 삭제
        </button>
      </div>

      {isPending ? (
        <div className="flex justify-center items-center py-[30px]">
          <DogSpinner />
        </div>
      ) : !cartItems?.cart.length ? (
        <div className="flex justify-center items-center h-[200px]">장바구니에 담은 상품이 없습니다.</div>
      ) : (
        cartItems.cart.map((item) => (
          <div
            key={item.id}
            className="h-[121px] py-[20px] border-b-1 border-primary-100 sm:py-[30px] sm:h-[200px] sm:last:border-0"
          >
            <div className="flex justify-center items-center gap-[10px] sm:gap-[20px]">
              <button
                disabled={isDisabled}
                onClick={() => toggleCheckCartItem({ cartItemId: item.id, isChecked: !item.isChecked })}
                className="relative min-w-[20px] h-[20px] cursor-pointer sm:min-w-[24px] sm:h-[24px]"
              >
                <Image
                  src={item.isChecked ? ic_checkbox_active : ic_checkbox}
                  alt="체크박스"
                  fill
                  className="object-contain"
                />
              </button>

              <div className="w-full flex justify-center items-center gap-[12px] sm:gap-[20px]">
                <Link
                  href={`/products/${item.product.id}?category=${item.product.categoryId}`}
                  className="flex justify-center items-center w-[81px] h-[81px] p-[24px] rounded-[2px] bg-primary-50 sm:w-[140px] sm:h-[140px] sm:bg-white"
                >
                  <div className="relative w-[29px] h-[50px] sm:w-[59px] sm:h-[102px]">
                    <Image src={item.product.imageUrl} alt="상품" fill className="object-contain" />
                  </div>
                </Link>

                <div className="w-full flex flex-col sm:gap-[20px]">
                  <div className="flex justify-between items-center gap-[16px] sm:items-end">
                    <div className="flex flex-col justify-center items-start gap-[4px] sm:gap-[8px]">
                      <Link
                        href={`/products/${item.product.id}?category=${item.product.categoryId}`}
                        className="min-w-[115px] font-normal text-[14px]/[17px] tracking-tight text-primary-950 line-clamp-1 sm:font-medium sm:text-[16px]/[20px] sm:text-[#1f1f1f] hover:underline"
                      >
                        {item.product.name}
                      </Link>
                      <p className="font-extrabold text-[14px]/[17px] tracking-tight text-primary-950 sm:font-bold sm:text-[16px]/[20px] sm:text-[#1f1f1f]">
                        {formatPrice(item.product.price)}원
                      </p>
                    </div>

                    <div className="relative flex sm:flex-col sm:justify-center sm:items-end sm:min-w-[132px] sm:gap-[4px]">
                      <QuantityDropdown
                        value={item.quantity}
                        onClick={(value: number) => updateCartItemQuantity({ cartItemId: item.id, quantity: value })}
                      />

                      <p className="hidden sm:block sm:font-extrabold sm:text-[24px]/[32px] sm:text-[#1f1f1f] md:tracking-tight md:leading-[30px]">
                        총 {formatPrice(item.product.price * item.quantity)}원
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center sm:items-start">
                    <p className="font-normal text-[13px]/[16px] tracking-tight text-[#6b6b6b] sm:hidden">
                      택배 3,000원
                    </p>
                    <p className="hidden sm:block sm:font-normal sm:text-[14px]/[17px] tracking-tight text-[#6b6b6b]">
                      택배 배송비 3,000원
                    </p>
                    <Button
                      onClick={() => {
                        if (user?.role === "USER") {
                          router.push(`/cart/order?cartItemId=${item.id}`);
                        }

                        if (user?.role !== "USER") {
                          // Order 생성 API
                          setIsDisabled(true);
                          orderRequest([item.id]);
                        }
                      }}
                      type="white"
                      label={user?.role === "USER" ? "바로 요청" : "즉시 구매"}
                      disabled={isDisabled ? isDisabled : user?.role === "USER" ? false : !canPurchase}
                      className={clsx(
                        user?.role === "USER"
                          ? false
                          : !canPurchase && "bg-primary-50 border-primary-300 text-primary-400 cursor-default",
                        "w-[88px] h-[40px] font-normal text-[13px]/[16px] tracking-tight outline-none sm:w-[99px] sm:h-[44px] sm:text-[16px]/[20px]",
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
