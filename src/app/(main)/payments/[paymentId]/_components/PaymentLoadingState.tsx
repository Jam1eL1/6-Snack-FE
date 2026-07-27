import DogSpinner from "@/components/common/DogSpinner";

export default function PaymentLoadingState() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center" aria-label="Loading Payment">
      <DogSpinner />
    </main>
  );
}
