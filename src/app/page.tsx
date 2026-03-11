import Link from "next/link";
import ArrowRightIcon from "@/components/svg/ArrowRightIconSvg";
import Image from "next/image";
import mobileImg from "@/assets/images/landing/landingPage_mobile.webp";
import tabletImg from "@/assets/images/landing/landingPage_tablet.webp";
import desktopImg from "@/assets/images/landing/landingPage_desktop.webp";

const CARD_TEXTS = [
  "Consolidate all your office procurement in one place\nand manage spending smarter.",
  "Designed for both administrators and employees\nto use effortlessly.",
  "Browse a wide range of items\nat a glance.",
  "Request purchases in just a few clicks.",
];

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center justify-start pt-10 flex-grow">
        <h1 className="text-center text-2xl sm:text-4xl md:text-5xl font-extrabold text-primary-950 leading-tight">
          The Single Platform for Smart Office Procurement.
        </h1>

        <h2 className="mt-2 text-center text-lg sm:text-xl md:text-2xl font-semibold text-primary-300">
          From breakroom snacks to office supplies, manage all spend and expenses smarter.
        </h2>

        <Link
          href="/signup/super-admin"
          className="mt-6 bg-primary-950 text-white px-5 py-2.5 rounded-full flex items-center gap-1"
        >
          <span className="text-base font-bold">Sign Up</span>
          <ArrowRightIcon />
        </Link>

        <div className="mt-10 w-full max-w-[1300px] rounded-[10px] overflow-hidden">
          <Image
            src={mobileImg}
            alt="mobile preview"
            width={1300}
            height={600}
            className="block sm:hidden w-full h-auto"
          />
          <Image
            src={tabletImg}
            alt="tablet preview"
            width={1300}
            height={600}
            className="hidden sm:block md:hidden w-full h-auto"
          />
          <Image
            src={desktopImg}
            alt="desktop preview"
            width={1300}
            height={600}
            className="hidden md:block w-full h-auto"
          />
        </div>
      </div>

      {/* Desktop/Tablet Fixed Slide */}
      <div className="hidden sm:block fixed bottom-0 w-full py-6 overflow-hidden z-20 bg-transparent backdrop-blur">
        <div className="flex animate-slide gap-10 w-max px-8">
          {[...CARD_TEXTS, ...CARD_TEXTS, ...CARD_TEXTS].map((text, idx) => (
            <div
              key={idx}
              className="h-[112px] px-[30px] py-[30px] bg-white/20 rounded-lg shadow-[0_7px_20px_rgba(0,0,0,0.02)] outline outline-1 outline-offset-[-1px] outline-primary-100 backdrop-blur-[20px] inline-flex justify-center items-center"
            >
              <div className="text-primary-500 text-base font-medium whitespace-pre-line">{text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Fixed Slide */}
      <div className="block sm:hidden fixed bottom-0 w-full z-20 bg-transparent backdrop-blur ">
        <div className="h-[260px] relative">
          {[0, 1].map((row) => (
            <div
              key={row}
              className={`absolute left-0 w-full h-[112px] overflow-hidden ${row === 1 ? "top-[130px]" : "top-0"}`}
            >
              <div className={`flex ${row % 2 === 0 ? "animate-slide" : "animate-slide-reverse"} gap-6 w-max px-8`}>
                {[...CARD_TEXTS, ...CARD_TEXTS].map((text, idx) => (
                  <div
                    key={`row${row}-${idx}`}
                    className="min-w-[250px] h-[112px] px-6 py-4 bg-white/40 rounded-lg shadow-md outline outline-1 outline-offset-[-1px] outline-primary-100 backdrop-blur-[20px] flex items-center justify-center"
                  >
                    <div className="text-primary-500 text-base font-medium whitespace-pre-line text-center">{text}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
