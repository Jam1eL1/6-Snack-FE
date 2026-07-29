import Link from "next/link";
import SnackIconSvg from "@/components/svg/SnackIconSvg";
import SuperAdminSignUpForm from "./_components/SuperAdminSignUpForm";

const SuperAdminSignUpPage = () => {
  return (
    <main className="flex flex-col items-center justify-center gap-[46px] pt-[48px] sm:relative sm:gap-0 sm:pt-[160px]">
      <header className="flex w-full max-w-[480px] flex-col items-center justify-center sm:absolute sm:top-0 sm:max-w-[600px]">
        <div className="flex h-[140px] w-full items-center justify-center px-[50.92px] py-[38.18px] sm:h-[214px] sm:max-w-[500px] sm:px-[77.86px] sm:py-[58.4px]">
          <Link href="/" aria-label="Go to home">
            <SnackIconSvg className="h-[63.64px] w-[225.16px] sm:h-[97.3px] sm:w-[344px]" aria-label="Snack logo" />
          </Link>
        </div>

        <div className="sm:hidden">
          <div className="flex flex-col items-start justify-center gap-[10px]">
            <h1 id="signup-heading" className="text-lg/[22px] font-bold tracking-tight">
              Create a company administrator account
            </h1>
            <p className="text-left text-sm/[17px] tracking-tight text-primary-600">
              Team members can create accounts through invitation emails sent by their company administrator.
            </p>
          </div>
        </div>
      </header>

      <section
        className="flex w-full flex-col items-center justify-center sm:absolute sm:top-[152.12px] sm:w-[600px] sm:items-start sm:rounded-xs sm:bg-white sm:px-[60px] sm:py-[40px] sm:shadow-[0px_0px_40px_0px_rgba(0,0,0,0.10)]"
        aria-label="Company administrator signup"
      >
        <div className="hidden sm:mb-5 sm:block">
          <div className="flex flex-col items-start justify-center gap-[10px]">
            <h1 id="signup-form-heading" className="text-2xl/[30px] font-bold tracking-tight text-primary-950">
              Create a company administrator account
            </h1>
            <p className="text-left text-base/[20px] tracking-tight text-primary-600">
              Team members can create accounts through invitation emails sent by their company administrator.
            </p>
          </div>
        </div>

        <SuperAdminSignUpForm />

        <nav aria-label="Account links" className="mt-6 flex w-full justify-center">
          <p className="w-full text-center text-base/[20px] tracking-tight text-primary-500">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-bold text-primary-950 underline decoration-primary-950 underline-offset-2"
            >
              Sign in
            </Link>
          </p>
        </nav>
      </section>
    </main>
  );
};

export default SuperAdminSignUpPage;
