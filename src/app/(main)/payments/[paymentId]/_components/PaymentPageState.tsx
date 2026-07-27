import { CircleCheck, CircleX } from "lucide-react";

type TPaymentPageStateProps = {
  eyebrow: string;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  variant?: "default" | "success";
};

export default function PaymentPageState({
  eyebrow,
  title,
  description,
  actionLabel,
  onAction,
  variant = "default",
}: TPaymentPageStateProps) {
  const Icon = variant === "success" ? CircleCheck : CircleX;

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-primary-100 bg-white p-8 text-center shadow-[0_12px_40px_rgba(34,34,34,0.08)]">
        <Icon
          className={`mx-auto size-10 ${variant === "success" ? "text-secondary-500" : "text-error-500"}`}
          aria-hidden="true"
        />
        <p className="mt-4 text-sm font-semibold text-primary-500">{eyebrow}</p>
        <h1 className="mt-2 text-xl font-bold text-primary-950">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-primary-500">{description}</p>

        <button
          type="button"
          onClick={onAction}
          className="mt-6 h-11 w-full rounded-md bg-primary-950 px-4 text-sm font-bold text-white transition hover:bg-primary-800"
        >
          {actionLabel}
        </button>
      </div>
    </main>
  );
}
