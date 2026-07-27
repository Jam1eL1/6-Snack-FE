type TInvalidPaymentStateProps = {
  onReturnToOrders: () => void;
};

export default function InvalidPaymentState({ onReturnToOrders }: TInvalidPaymentStateProps) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-primary-100 bg-white p-8 text-center shadow-[0_12px_40px_rgba(34,34,34,0.08)]">
        <p className="text-sm font-semibold text-primary-500">Invalid Payment</p>

        <h1 className="mt-2 text-xl font-bold text-primary-950">This payment ID is invalid</h1>

        <p className="mt-3 text-sm leading-6 text-primary-500">
          Go to Manage Orders and select a purchase request to continue.
        </p>

        <button
          type="button"
          onClick={onReturnToOrders}
          className="mt-6 h-11 w-full rounded-md bg-primary-950 px-4 text-sm font-bold text-white transition hover:bg-primary-800"
        >
          Go to Manage Orders
        </button>
      </div>
    </main>
  );
}
