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

  // Show a temporary toast.
  const showToast = (message: string, variant: TToastVariant = "success") => {
    setToastMessage(message);
    setToastVariant(variant);
    setToastVisible(true);

    // Hide the toast after three seconds.
    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  React.useEffect(() => {
    if (success) {
      showToast("Budget updated successfully.", "success");
    }
    // Validation errors can be handled here if an error toast is needed.
    // if (errors.currentMonthBudget || errors.nextMonthBudget) {
    //   showToast("Failed to update the budget.", "error");
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
      {/* Toast */}
      <Toast text={toastMessage} variant={toastVariant} isVisible={toastVisible} />

      <div className="flex flex-1 flex-col justify-center sm:flex-row">
        <div className="w-full sm:w-1/2">
          <form onSubmit={onSubmit} className="w-full flex flex-col gap-20 mt-[20px]">
            <div className="self-stretch flex flex-col justify-start items-start gap-12">
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <h1
                  id="budget-management-heading"
                  className="self-stretch text-lg font-bold text-primary-950 md:text-2xl"
                >
                  Budget Management
                </h1>
                <div className="self-stretch text-sm font-normal text-primary-400 md:text-base">
                  Set this month’s budget to manage your spending.
                </div>
              </div>
              <div className="self-stretch flex flex-col justify-center items-start gap-16">
                {/* Current month budget */}
                <div className="self-stretch flex flex-col justify-center items-start gap-3">
                  <div className="self-stretch text-base font-bold text-primary-950 md:text-lg">This Month</div>
                  {savedCurrentMonthBudget !== undefined && (
                    <div className="self-stretch text-base font-normal text-primary-400 md:text-lg">
                      Currently saved: {formatCurrency(savedCurrentMonthBudget)}
                    </div>
                  )}
                  <div className="self-stretch border-b-2 border-neutral-700 inline-flex justify-center items-center gap-1 w-full max-w-full h-[49px] pb-[12px] scrollbar-hide overflow-x-visible">
                    <input
                      type="text"
                      inputMode="decimal"
                      className={
                        `h-8 min-w-0 flex-1 border-none bg-transparent text-base font-extrabold leading-none tracking-tight outline-none md:text-lg` +
                        (currentMonthBudget
                          ? " text-primary-950"
                          : " text-primary-300 placeholder:text-base placeholder:font-bold placeholder:leading-none placeholder:tracking-tight placeholder:text-primary-300 md:placeholder:text-lg")
                      }
                      placeholder="Enter a budget"
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
                    <div className="text-base font-bold leading-none tracking-tight text-primary-950 md:text-lg">
                      CAD
                    </div>
                  </div>
                  {errors?.currentMonthBudget && (
                    <p className="text-red-500 text-xs mt-1 ml-2">{errors.currentMonthBudget}</p>
                  )}
                </div>
                {/* Recurring budget starting next month */}
                <div className="self-stretch flex flex-col justify-center items-start gap-3">
                  <div className="self-stretch text-base font-bold text-primary-950 md:text-lg">
                    Starting Next Month
                  </div>
                  <div className="self-stretch border-b-2 border-neutral-700 inline-flex justify-center items-center gap-1 w-full max-w-full h-[49px] pb-[12px] scrollbar-hide overflow-x-visible">
                    <input
                      type="text"
                      inputMode="decimal"
                      className={
                        `h-8 min-w-0 flex-1 border-none bg-transparent text-base font-extrabold leading-none tracking-tight outline-none md:text-lg` +
                        (nextMonthBudget
                          ? " text-primary-950"
                          : " text-primary-300 placeholder:text-base placeholder:font-bold placeholder:leading-none placeholder:tracking-tight placeholder:text-primary-300 md:placeholder:text-lg")
                      }
                      placeholder="Enter a budget"
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
                    <div className="text-base font-bold leading-none tracking-tight text-primary-950 md:text-lg">
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
                {loading ? "Saving..." : "Save Changes"}
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
