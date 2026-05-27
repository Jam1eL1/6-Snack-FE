"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBudgets, patchBudgets } from "@/lib/api/budgets.api";
import { queryKeys } from "@/lib/queryKeys";
import BudgetFormUI from "./_components/BudgetFormUI";
import DogSpinner from "@/components/common/DogSpinner";

const budgetSchema = z.object({
  currentMonthBudget: z.string().optional(),
  nextMonthBudget: z.string().optional(),
});

type BudgetInputs = z.infer<typeof budgetSchema>;

interface BudgetResponse {
  currentMonthBudget?: number;
  monthlyBudget?: number;
}

function ManageBudgetsPage() {
  const queryClient = useQueryClient();
  const [showSubmitSpinner, setShowSubmitSpinner] = useState(false);

  // 예산 데이터 패칭
  const { data, isLoading: isQueryLoading } = useQuery<BudgetResponse>({
    queryKey: queryKeys.budgets.all,
    queryFn: getBudgets,
  });

  // 폼 세팅
  const {
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    reset,
  } = useForm<BudgetInputs>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      currentMonthBudget: "",
      nextMonthBudget: "",
    },
  });

  // 쿼리 데이터로 폼 초기화
  useEffect(() => {
    if (data) {
      reset({
        currentMonthBudget: data.currentMonthBudget?.toString() ?? "",
        nextMonthBudget: data.monthlyBudget?.toString() ?? "",
      });
    }
  }, [data, reset]);

  // 예산 수정 뮤테이션
  const {
    mutate: updateBudgets,
    isPending: isMutating,
    isSuccess,
  } = useMutation({
    mutationFn: (formData: BudgetInputs) =>
      patchBudgets({
        currentMonthBudget: Number(formData.currentMonthBudget) || 0,
        monthlyBudget: Number(formData.nextMonthBudget) || 0,
      }),
    onMutate: () => {
      setShowSubmitSpinner(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminOrders.detailPrefix });
      setShowSubmitSpinner(false);
    },
    onError: () => {
      setShowSubmitSpinner(false);
    },
  });

  // BudgetFormUI에 맞는 핸들러
  const handleUIChange = (field: "currentMonthBudget" | "nextMonthBudget", value: string) => {
    setValue(field, value);
  };

  // 초기 데이터 로딩 중일 때 스피너 표시
  if (isQueryLoading) {
    return (
      <div className="flex flex-1 flex-col justify-center items-center" role="main">
        <DogSpinner />
        <p className="mt-4 text-neutral-600 text-sm font-['SUIT']">예산 정보를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <main className="flex flex-1 flex-col justify-center relative" role="main" aria-labelledby="budget-management-heading">
      {/* 제출 중 오버레이 스피너 */}
      {showSubmitSpinner && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex flex-col justify-center items-center z-10">
          <DogSpinner />
          <p className="mt-4 text-neutral-600 text-sm font-['SUIT']">예산을 저장하는 중...</p>
        </div>
      )}

      <header className="sr-only">
        <h1 id="budget-management-heading">예산 관리</h1>
      </header>
      <section aria-labelledby="budget-form-section" role="region">
        <h2 id="budget-form-section" className="sr-only">예산 설정 폼</h2>
        <BudgetFormUI
          currentMonthBudget={String((typeof watch === "function" ? watch("currentMonthBudget") : "") || "")}
          nextMonthBudget={String((typeof watch === "function" ? watch("nextMonthBudget") : "") || "")}
          onChange={handleUIChange}
          onSubmit={handleSubmit((formData) => updateBudgets(formData))}
          loading={isQueryLoading || isMutating}
          success={isSuccess}
          errors={{
            currentMonthBudget: errors.currentMonthBudget?.message,
            nextMonthBudget: errors.nextMonthBudget?.message,
          }}
        />
      </section>
    </main>
  );
}

export default ManageBudgetsPage;
