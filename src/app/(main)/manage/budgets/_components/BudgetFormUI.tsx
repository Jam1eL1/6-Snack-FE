"use client";

import React from "react";
import Toast from "@/components/common/Toast";
import { TToastVariant } from "@/types/toast.types";
import { formatDollarInput } from "@/lib/utils/currency.util";

interface BudgetFormUIProps {
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

  // 숫자에 3자리마다 쉼표 추가하는 함수
  function formatNumberWithCommas(value: string): string {
    if (!value || value === "") return "";
    const num = Number(value);
    if (isNaN(num)) return "";
    return formatDollarInput(num);
  }

  // 한글 금액 단위 포맷 함수 (3백5십만원 등)
  function formatKoreanCurrencyUnit(value: string): string {
    if (!value || value === "0") return "0원";
    const num = Number(value);
    if (isNaN(num) || num === 0) return "0원";

    // 1000만원 이상은 NaN 방지를 위해 간단하게 처리
    if (num >= 100000000) return "1억원 이상";

    // 만원 단위 이하
    if (num < 10000) return num + "원";

    // 만원 단위 이상
    const units = ["", "십", "백", "천"];
    const man = Math.floor(num / 10000);
    let manStr = "";
    const manArr = man.toString().split("").reverse();
    for (let i = manArr.length - 1; i >= 0; i--) {
      const digit = Number(manArr[i]);
      if (digit > 0) {
        manStr += digit + units[i];
      }
    }
    manStr += "만원";

    // 만원 이하 처리
    const rest = num % 10000;
    let restStr = "";
    if (rest > 0) {
      const restArr = rest.toString().split("").reverse();
      for (let i = restArr.length - 1; i >= 0; i--) {
        const digit = Number(restArr[i]);
        if (digit > 0) {
          restStr += digit + units[i];
        }
      }
      restStr += "원";
    }

    return manStr + (restStr ? restStr : "");
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
                  <div className="self-stretch border-b-2 border-neutral-700 inline-flex justify-center items-center gap-1 w-full max-w-full h-[49px] pb-[12px] scrollbar-hide overflow-x-visible">
                    <input
                      type="text"
                      inputMode="numeric"
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
                        const onlyNums = e.target.value.replace(/[^0-9]/g, "");
                        // 99999999 (천만원 미만)까지만 입력 가능
                        if (onlyNums.length <= 8) {
                          onChange("currentMonthBudget", onlyNums);
                        }
                      }}
                      disabled={loading}
                    />
                    <div className="text-[color:var(--color-primary-950)] font-bold leading-[100%] align-middle tracking-tight sm:text-3xl md:text-4xl">
                      원
                    </div>
                  </div>
                  {errors?.currentMonthBudget && (
                    <p className="text-red-500 text-xs mt-1 ml-2">{errors.currentMonthBudget}</p>
                  )}
                  <div className="self-stretch text-[color:var(--color-primary-400)] text-sm md:text-base font-bold">
                    {formatKoreanCurrencyUnit(currentMonthBudget)}
                  </div>
                </div>
                {/* 다음 달 예산 */}
                <div className="self-stretch flex flex-col justify-center items-start gap-3">
                  <div className="self-stretch text-[color:var(--color-primary-950)] text-sm md:text-base font-bold">
                    매달 시작
                  </div>
                  <div className="self-stretch border-b-2 border-neutral-700 inline-flex justify-center items-center gap-1 w-full max-w-full h-[49px] pb-[12px] scrollbar-hide overflow-x-visible">
                    <input
                      type="text"
                      inputMode="numeric"
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
                        const onlyNums = e.target.value.replace(/[^0-9]/g, "");
                        // 99999999 (천만원 미만)까지만 입력 가능
                        if (onlyNums.length <= 8) {
                          onChange("nextMonthBudget", onlyNums);
                        }
                      }}
                      disabled={loading}
                    />
                    <div className="text-[color:var(--color-primary-950)] font-bold leading-[100%] align-middle tracking-tight sm:text-3xl md:text-4xl">
                      원
                    </div>
                  </div>
                  {errors?.nextMonthBudget && (
                    <p className="text-red-500 text-xs mt-1 ml-2">{errors.nextMonthBudget}</p>
                  )}
                  <div className="self-stretch text-[color:var(--color-primary-400)] text-sm md:text-base font-bold">
                    {formatKoreanCurrencyUnit(nextMonthBudget)}
                  </div>
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
