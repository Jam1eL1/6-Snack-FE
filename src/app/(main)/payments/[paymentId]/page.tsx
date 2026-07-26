"use client";

import { FormEvent } from "react";
import { ArrowLeft, CreditCard, LockKeyhole, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const fieldClassName =
  "h-11 w-full rounded-md border border-primary-200 bg-white px-3 text-sm text-primary-950 outline-none transition placeholder:text-primary-400 focus-within:border-primary-700";

export default function PaymentPage() {
  const params = useParams<{ paymentId: string }>();
  const router = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: Call the complete Payment mutation after the Payment data is connected.
  };

  return (
    <main className="min-h-screen bg-primary-25 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-[1040px]">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary-600 transition hover:text-primary-950"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to order
        </button>

        <div className="overflow-hidden rounded-xl border border-primary-100 bg-white shadow-[0_12px_40px_rgba(34,34,34,0.08)]">
          <div className="grid md:grid-cols-[0.9fr_1.1fr]">
            <aside className="flex flex-col justify-between bg-primary-950 p-6 text-white sm:p-10">
              <div>
                <div className="mb-10 flex items-center gap-2">
                  <div className="flex size-9 items-center justify-center rounded-md bg-white/10">
                    <CreditCard className="size-5" aria-hidden="true" />
                  </div>
                  <span className="text-sm font-bold tracking-wide">Snack Payment</span>
                </div>

                <p className="text-sm text-primary-300">Amount due</p>
                {/* TODO: Replace this placeholder with formatCurrency(payment.amount). */}
                <p className="mt-2 text-4xl font-bold tracking-tight">$0.00</p>

                <dl className="mt-10 space-y-4 border-t border-white/15 pt-6 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-primary-300">Order</dt>
                    {/* TODO: Replace this placeholder with payment.orderId. */}
                    <dd className="max-w-[220px] truncate font-medium">Not loaded</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-primary-300">Payment reference</dt>
                    <dd className="font-medium">#{params.paymentId}</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-12 flex items-start gap-3 rounded-lg bg-white/5 p-4">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary-200" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold">Practice checkout</p>
                  <p className="mt-1 text-xs leading-5 text-primary-300">
                    This page uses a dummy Payment flow. Do not enter real card information.
                  </p>
                </div>
              </div>
            </aside>

            <section className="p-6 sm:p-10" aria-labelledby="payment-form-title">
              <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-primary-950">Payment Details</h1>
                <p className="mt-2 text-sm leading-6 text-primary-500">
                  Enter dummy card details to finish approving this order.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="cardholder-name" className="block text-sm font-semibold text-primary-800">
                    Name on card
                  </label>
                  <input
                    id="cardholder-name"
                    name="cardholderName"
                    type="text"
                    autoComplete="off"
                    placeholder="Jamie Lee"
                    className={fieldClassName}
                  />
                </div>

                <fieldset className="space-y-2">
                  <legend className="text-sm font-semibold text-primary-800">Card information</legend>
                  <div className="overflow-hidden rounded-md border border-primary-200 bg-white focus-within:border-primary-700">
                    <div className="relative">
                      <CreditCard
                        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary-400"
                        aria-hidden="true"
                      />
                      <label htmlFor="card-number" className="sr-only">
                        Card number
                      </label>
                      <input
                        id="card-number"
                        name="cardNumber"
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        maxLength={19}
                        placeholder="4242 4242 4242 4242"
                        className="h-11 w-full px-10 text-sm text-primary-950 outline-none placeholder:text-primary-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 border-t border-primary-200">
                      <div className="border-r border-primary-200">
                        <label htmlFor="card-expiry" className="sr-only">
                          Expiration date
                        </label>
                        <input
                          id="card-expiry"
                          name="cardExpiry"
                          type="text"
                          inputMode="numeric"
                          autoComplete="off"
                          maxLength={7}
                          placeholder="MM / YY"
                          className="h-11 w-full px-3 text-sm text-primary-950 outline-none placeholder:text-primary-400"
                        />
                      </div>
                      <div className="relative">
                        <label htmlFor="card-cvc" className="sr-only">
                          Security code
                        </label>
                        <input
                          id="card-cvc"
                          name="cardCvc"
                          type="text"
                          inputMode="numeric"
                          autoComplete="off"
                          maxLength={4}
                          placeholder="CVC"
                          className="h-11 w-full px-3 pr-10 text-sm text-primary-950 outline-none placeholder:text-primary-400"
                        />
                        <LockKeyhole
                          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-primary-400"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </div>
                </fieldset>

                <div className="rounded-md border border-secondary-500/20 bg-secondary-100 px-4 py-3">
                  <p className="text-xs leading-5 text-primary-700">
                    Use test values only. No card details should be sent to or stored by the backend.
                  </p>
                </div>

                <button
                  type="submit"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary-950 px-4 text-sm font-bold text-white transition hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <LockKeyhole className="size-4" aria-hidden="true" />
                  Complete dummy payment
                </button>

                <p className="text-center text-xs leading-5 text-primary-400">
                  Completing payment will approve the related order.
                </p>
              </form>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
