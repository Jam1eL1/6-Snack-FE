"use client";

import React from "react";
import Toast from "@/components/common/Toast";
import { TToastVariant } from "@/types/toast.types";
import { formatCurrency, formatDollarInput } from "@/lib/utils/currency.util";

interface BudgetFormUIProps {
  savedCurrentMonthBudget?: number;
  currentMonthBudget: string;
  nextMonthBudget: string;
  onChange: (field: "currentMonthBudget" | "nextMonthBudget", value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  success: boolean;
  errors?: {
    currentMonthBudget?: string;
    nextMonthBudget?: string;
  };
}

const BudgetFormUI: React.FC<BudgetFormUIProps> = ({
  savedCurrentMonthBudget,
  currentMonthBudget,
  nextMonthBudget,
  onChange,
  onSubmit,
  loading,
  success,
  errors,
}) => {
  const [toastVisible, setToastVisible] = React.useState<boolean>(false);
  const [toastMessage, setToastMessage] = React.useState<string>("");
  const [toastVariant, setToastVariant] = React.useState<TToastVariant>("success");

  // Toast를 보여주는 함수
  const showToast = (message: string, variant: TToastVariant = "success") => {
    setToastMessage(message);
    setToastVariant(variant);
    setToastVisible(true);

    // 3초 후 자동으로 숨김
    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  React.useEffect(() => {
    if (success) {
      showToast("예산이 성공적으로 수정되었습니다.", "success");
    }
    // 실패 케이스는 errors에 따라 별도 처리 가능
    // if (errors.currentMonthBudget || errors.nextMonthBudget) {
    //   showToast("예산 수정에 실패했습니다.", "error");
    // }
  }, [success]);

  // Format the dollar input while preserving an unfinished decimal value.
  function formatNumberWithCommas(value: string): string {
    if (!value) return "";

    const [wholeDollars, decimalCents] = value.split(".");
    const formattedWholeDollars = formatDollarInput(Number(wholeDollars || 0));

    return decimalCents !== undefined ? `${formattedWholeDollars}.${decimalCents}` : formattedWholeDollars;
  }

  return (
    <>
      {/* Toast 컴포넌트 */}
      <Toast text={toastMessage} variant={toastVariant} isVisible={toastVisible} />

      <div className="flex flex-1 flex-col justify-center sm:flex-row">
        <div className="w-full sm:w-1/2">
          <form onSubmit={onSubmit} className="w-full flex flex-col gap-20 mt-[20px]">
            <div className="self-stretch flex flex-col justify-start items-start gap-12">
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="self-stretch text-[color:var(--color-primary-950)] text-lg md:text-2xl font-bold">
                  예산 관리
                </div>
                <div className="self-stretch text-[color:var(--color-primary-400)] text-sm md:text-base font-normal">
                  이번 달 예산을 정해서 지출을 관리해보세요
                </div>
              </div>
              <div className="self-stretch flex flex-col justify-center items-start gap-16">
                {/* 이번 달 예산 */}
                <div className="self-stretch flex flex-col justify-center items-start gap-3">
                  <div className="self-stretch text-[color:var(--color-primary-950)] text-sm md:text-base font-bold">
                    이번 달
                  </div>
                  {savedCurrentMonthBudget !== undefined && (
                    <div className="self-stretch text-[color:var(--color-primary-400)] text-sm md:text-base font-normal">
                      Currently saved: {formatCurrency(savedCurrentMonthBudget)}
                    </div>
                  )}
                  <div className="self-stretch border-b-2 border-neutral-700 inline-flex justify-center items-center gap-1 w-full max-w-full h-[49px] pb-[12px] scrollbar-hide overflow-x-visible">
                    <input
                      type="text"
                      inputMode="decimal"
                      style={
                        currentMonthBudget ? { color: "var(--color-primary-950)", height: "37px" } : { height: "37px" }
                      }
                      className={
                        `flex-1 min-w-0 bg-transparent outline-none border-none` +
                        (currentMonthBudget
                          ? " text-[color:var(--color-primary-950)] font-extrabold text-[20px] sm:text-[32px] md:text-[40px] tracking-tight leading-[100%] align-middle"
                          : " text-neutral-300 text-xl sm:text-3xl md:text-3xl font-bold placeholder:text-neutral-300 placeholder:font-bold placeholder:text-[18px] sm:placeholder:text-[32px] md:placeholder:text-[32px] placeholder:leading-[100%] placeholder:align-bottom placeholder:tracking-tight")
                      }
                      placeholder="예산을 입력해주세요"
                      value={
                        currentMonthBudget && currentMonthBudget !== "0"
                          ? formatNumberWithCommas(currentMonthBudget)
                          : currentMonthBudget === "0"
                            ? "0"
                            : ""
                      }
                      onChange={(e) => {
                        const dollarValue = e.target.value.replace(/,/g, "");
                        const wholeDollarLength = dollarValue.split(".")[0].length;

                        if (/^\d*(\.\d{0,2})?$/.test(dollarValue) && wholeDollarLength <= 8) {
                          onChange("currentMonthBudget", dollarValue);
                        }
                      }}
                      disabled={loading}
                    />
                    <div className="text-[color:var(--color-primary-950)] font-bold leading-[100%] align-middle tracking-tight sm:text-3xl md:text-4xl">
                      CAD
                    </div>
                  </div>
                  {errors?.currentMonthBudget && (
                    <p className="text-red-500 text-xs mt-1 ml-2">{errors.currentMonthBudget}</p>
                  )}
                </div>
                {/* 다음 달 예산 */}
                <div className="self-stretch flex flex-col justify-center items-start gap-3">
                  <div className="self-stretch text-[color:var(--color-primary-950)] text-sm md:text-base font-bold">
                    매달 시작
                  </div>
                  <div className="self-stretch border-b-2 border-neutral-700 inline-flex justify-center items-center gap-1 w-full max-w-full h-[49px] pb-[12px] scrollbar-hide overflow-x-visible">
                    <input
                      type="text"
                      inputMode="decimal"
                      style={
                        nextMonthBudget ? { color: "var(--color-primary-950)", height: "37px" } : { height: "37px" }
                      }
                      className={
                        `flex-1 min-w-0 bg-transparent outline-none border-none` +
                        (nextMonthBudget
                          ? " text-[color:var(--color-primary-950)] font-extrabold text-[20px] sm:text-[32px] md:text-[40px] tracking-tight leading-[100%] align-middle"
                          : " text-neutral-300 text-xl sm:text-3xl md:text-3xl font-bold placeholder:text-neutral-300 placeholder:font-bold placeholder:text-[18px] sm:placeholder:text-[32px] md:placeholder:text-[32px] placeholder:leading-[100%] placeholder:align-bottom placeholder:tracking-tight")
                      }
                      placeholder="예산을 입력해주세요"
                      value={
                        nextMonthBudget && nextMonthBudget !== "0"
                          ? formatNumberWithCommas(nextMonthBudget)
                          : nextMonthBudget === "0"
                            ? "0"
                            : ""
                      }
                      onChange={(e) => {
                        const dollarValue = e.target.value.replace(/,/g, "");
                        const wholeDollarLength = dollarValue.split(".")[0].length;

                        if (/^\d*(\.\d{0,2})?$/.test(dollarValue) && wholeDollarLength <= 8) {
                          onChange("nextMonthBudget", dollarValue);
                        }
                      }}
                      disabled={loading}
                    />
                    <div className="text-[color:var(--color-primary-950)] font-bold leading-[100%] align-middle tracking-tight sm:text-3xl md:text-4xl">
                      CAD
                    </div>
                  </div>
                  {errors?.nextMonthBudget && (
                    <p className="text-red-500 text-xs mt-1 ml-2">{errors.nextMonthBudget}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="self-stretch h-16 px-4 py-3 bg-neutral-800 rounded-sm inline-flex justify-center items-center mt-8">
              <button
                type="submit"
                className="w-full h-full text-center text-white text-base font-bold cursor-pointer"
                disabled={loading}
              >
                {loading ? "저장 중..." : "수정하기"}
              </button>
            </div>
          </form>
        </div>
        <div className="hidden sm:block w-1/2" />
      </div>
    </>
  );
};

export default BudgetFormUI;
