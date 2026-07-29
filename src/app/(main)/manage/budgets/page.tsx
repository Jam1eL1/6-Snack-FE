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
import { centsToDollars, dollarsToCents } from "@/lib/utils/currency.util";

const dollarAmountSchema = z.string().refine((value) => value === "" || /^\d+(\.\d{1,2})?$/.test(value), {
  message: "Enter a valid CAD amount with no more than two decimal places.",
});

const budgetSchema = z.object({
  currentMonthBudget: dollarAmountSchema.optional(),
  nextMonthBudget: dollarAmountSchema.optional(),
});

type BudgetInputs = z.infer<typeof budgetSchema>;

interface BudgetResponse {
  currentMonthBudget?: number;
  monthlyBudget?: number;
}

function ManageBudgetsPage() {
  const queryClient = useQueryClient();
  const [showSubmitSpinner, setShowSubmitSpinner] = useState(false);

  // Fetch the saved budgets.
  const { data, isLoading: isQueryLoading } = useQuery<BudgetResponse>({
    queryKey: queryKeys.budgets.all,
    queryFn: getBudgets,
  });

  // Configure the budget form.
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

  // Initialize the form with the saved budgets.
  useEffect(() => {
    if (data) {
      reset({
        currentMonthBudget:
          data.currentMonthBudget !== undefined ? String(centsToDollars(data.currentMonthBudget)) : "",
        nextMonthBudget: data.monthlyBudget !== undefined ? String(centsToDollars(data.monthlyBudget)) : "",
      });
    }
  }, [data, reset]);

  // Update the budgets.
  const {
    mutate: updateBudgets,
    isPending: isMutating,
    isSuccess,
  } = useMutation({
    mutationFn: (formData: BudgetInputs) =>
      patchBudgets({
        currentMonthBudget: dollarsToCents(formData.currentMonthBudget ?? 0),
        monthlyBudget: dollarsToCents(formData.nextMonthBudget ?? 0),
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

  // Adapt field changes for BudgetFormUI.
  const handleUIChange = (field: "currentMonthBudget" | "nextMonthBudget", value: string) => {
    setValue(field, value);
  };

  // Show a spinner while loading the initial budget data.
  if (isQueryLoading) {
    return (
      <div className="flex flex-1 flex-col justify-center items-center" role="main">
        <DogSpinner />
        <p className="mt-4 text-neutral-600 text-sm font-['SUIT']">Loading budget information...</p>
      </div>
    );
  }

  return (
    <main
      className="flex flex-1 flex-col justify-center relative"
      role="main"
      aria-labelledby="budget-management-heading"
    >
      {/* Overlay shown while saving. */}
      {showSubmitSpinner && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex flex-col justify-center items-center z-10">
          <DogSpinner />
          <p className="mt-4 text-neutral-600 text-sm font-['SUIT']">Saving budgets...</p>
        </div>
      )}

      <section aria-labelledby="budget-form-section" role="region">
        <h2 id="budget-form-section" className="sr-only">
          Budget settings form
        </h2>
        <BudgetFormUI
          savedCurrentMonthBudget={data?.currentMonthBudget}
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
