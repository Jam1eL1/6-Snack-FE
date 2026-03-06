import { Skeleton } from "@/components/ui/Skeleton";

export default function OrderDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <main className="w-full max-w-[1200px] mx-auto pt-[30px] md:pt-[60px] flex flex-col justify-start items-start gap-[30px]">
        {/* 헤더 skeleton */}
        <header>
          <Skeleton className="h-[22px] w-[200px]" />
        </header>

        {/* 요청 품목 섹션 skeleton */}
        <section className="self-stretch flex flex-col justify-start items-start gap-5">
          <div className="flex items-center gap-2">
            <Skeleton className="h-[20px] w-[100px]" />
            <Skeleton className="h-[20px] w-[80px]" />
            <Skeleton className="h-5 w-5" />
          </div>

          <div className="w-full rounded-sm sm:shadow-[0px_0px_10px_0px_rgba(0,0,0,0.12)]">
            <div className="flex flex-col w-full sm:pt-[20px] sm:px-[20px] sm:pb-[30px] gap-[20px] sm:gap-0">
              {/* 상품 아이템 skeleton 3개 */}
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex w-full items-center gap-3 sm:gap-5 border-b pb-[20px] sm:pt-[20px] sm:pr-[20px] border-primary-100"
                >
                  <Skeleton className="w-[72px] sm:w-[140px] h-[72px] sm:h-[140px] rounded-xs" />
                  <div className="flex flex-col w-full justify-center items-start gap-[12px] sm:gap-[30px]">
                    <div className="flex flex-col justify-center items-start gap-1 sm:gap-[10px]">
                      <Skeleton className="h-[17px] sm:h-[20px] w-[150px]" />
                      <Skeleton className="h-[17px] sm:h-[20px] w-[100px]" />
                    </div>
                    <div className="flex w-full items-center justify-between">
                      <Skeleton className="h-[16px] sm:h-[20px] w-[80px]" />
                      <div className="sm:hidden">
                        <Skeleton className="h-[20px] w-[80px]" />
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:block">
                    <Skeleton className="h-[32px] w-[100px]" />
                  </div>
                </div>
              ))}

              {/* 주문 금액 정보 skeleton */}
              <div className="w-full flex flex-col gap-4 sm:gap-2.5 sm:pt-[20px] sm:px-[20px]">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-[17px] sm:h-[20px] w-[80px]" />
                  <Skeleton className="h-[17px] sm:h-[20px] w-[100px]" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-[17px] sm:h-[20px] w-[60px]" />
                  <Skeleton className="h-[17px] sm:h-[20px] w-[60px]" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-[22px] sm:h-[30px] w-[120px]" />
                  <Skeleton className="h-[22px] sm:h-[30px] w-[120px]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 요청 정보 섹션 skeleton */}
        <section className="self-stretch flex flex-col justify-start items-start">
          <div className="self-stretch px-2 py-3 sm:py-3.5 border-b border-primary-950 inline-flex justify-start items-center gap-2">
            <Skeleton className="h-[17px] sm:h-[20px] w-[80px]" />
          </div>
          <div className="self-stretch flex flex-col justify-center items-start sm:flex-row sm:justify-start sm:items-stretch">
            <div className="self-stretch inline-flex justify-start items-center sm:flex-1">
              <Skeleton className="w-[140px] h-[50px]" />
              <Skeleton className="flex-1 h-[50px]" />
            </div>
            <div className="self-stretch inline-flex justify-start items-center sm:flex-1">
              <Skeleton className="w-[140px] h-[50px]" />
              <Skeleton className="flex-1 h-[50px]" />
            </div>
          </div>
          <div className="self-stretch flex flex-col justify-center items-start">
            <div className="self-stretch inline-flex justify-start items-center">
              <Skeleton className="w-[140px] h-[50px]" />
              <Skeleton className="flex-1 h-[50px]" />
            </div>
          </div>
        </section>

        {/* 예산 정보 섹션 skeleton */}
        <section className="self-stretch flex flex-col justify-start items-start">
          <div className="self-stretch px-2 py-3 sm:py-3.5 border-b border-primary-950 inline-flex justify-start items-center gap-2">
            <Skeleton className="h-[17px] sm:h-[20px] w-[80px]" />
          </div>
          <div className="self-stretch flex flex-col justify-center items-start">
            <div className="self-stretch inline-flex justify-start items-center">
              <Skeleton className="w-[140px] h-[50px]" />
              <Skeleton className="flex-1 h-[50px]" />
            </div>
            <div className="self-stretch inline-flex justify-start items-center">
              <Skeleton className="w-[140px] h-[50px]" />
              <Skeleton className="flex-1 h-[50px]" />
            </div>
          </div>
          <div className="self-stretch flex flex-col justify-center items-start">
            <div className="self-stretch inline-flex justify-start items-center">
              <Skeleton className="w-[140px] h-[50px]" />
              <Skeleton className="flex-1 h-[50px]" />
            </div>
          </div>
        </section>
      </main>

      {/* 버튼 섹션 skeleton */}
      <section className="flex w-full justify-center gap-4 sm:gap-5 py-6 md:py-0 mt-[20px] md:mt-[70px] md:items-center">
        <Skeleton className="w-full h-16 md:max-w-[300px]" />
        <Skeleton className="w-full h-16 md:max-w-[300px]" />
      </section>
    </div>
  );
}
