import Image, { StaticImageData } from "next/image";
import React, { Fragment } from "react";
import Desktop from "./Desktop";
import { formatDate } from "@/lib/utils/formatDate.util";
import { formatCurrency } from "@/lib/utils/currency.util";

type TCategory = {
  id: number;
  name: string;
  parentId: number;
};

type TCreator = {
  id: string;
  email: string;
  name: string;
  password: string;
  companyId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  hashedRefreshToken: string;
  role: string;
};

type TItems = {
  id: number;
  categoryId: number;
  creatorId: string;
  name: string;
  price: number;
  imageUrl: string | StaticImageData;
  linkUrl: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  category: TCategory;
  creator: TCreator;
}[];

type TProductListProps = {
  products: {
    items: TItems;
    meta: {
      totalCount: number;
      currentPage: number;
      itemsPerPage: number;
      totalPages: number;
    };
  };
};

export default function ProductList({ products }: TProductListProps) {
  return (
    <>
      {products.items.map((item) => (
        <Fragment key={item.id}>
          <div className="border-b-[1px] border-primary-100 md:hidden">
            <div className="flex flex-col w-full gap-[10px] min-w-[327px] max-w-[696px] h-[120px] mt-[20px] mb-[30px] sm:mt-[30px]">
              <p className="font-extrabold text-[16px]/[20px]">{formatDate(item.createdAt)}</p>
              <div className="flex gap-[20px]">
                <div className="flex justify-center items-center min-w-[90px] h-[90px] p-[24px] rounded-[2px] bg-primary-50">
                  <div className="relative w-[29px] h-[50px]">
                    <Image src={item.imageUrl} alt={item.name} fill className="object-contain" />
                  </div>
                </div>
                <div className="flex flex-col min-w-[217px] gap-[10px]">
                  <div className="flex flex-col gap-[6px] sm:gap-[4px]">
                    <p className="font-normal text-[12px]/[15px] text-primary-500">{item.category.name}</p>
                    <p className="font-normal text-[14px]/[17px] tracking-tight text-primary-950 line-clamp-1 sm:text-[16px]/[20px]">
                      {item.name}
                    </p>
                    <p className="font-extrabold text-[14px]/[17px] tracking-tight text-primary-950">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                  <p className="font-normal text-[14px]/[17px] tracking-tight text-primary-600 truncate">
                    {item.linkUrl.split("https://")}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <Desktop>
            <div className="flex justify-center w-full">
              <div className="flex justify-start items-center w-full h-[100px] px-[40px] gap-[80px] border-b-[1px] border-[#e6e6e6]">
                <div className="flex justify-start items-center w-[320px] h-[40px] gap-[20px]">
                  <div className="flex justify-center items-center w-[40px] h-[40px] px-[12px] rounded-[2px] bg-primary-50">
                    <div className="relative w-[16px] h-[27.77px]">
                      <Image src={item.imageUrl} alt={item.name} fill className="object-contain" />
                    </div>
                  </div>
                  <p className="font-normal text-[16px]/[20px] tracking-tight text-primary-950 line-clamp-2">
                    {item.name}
                  </p>
                </div>
                <p className="w-[180px] font-normal text-[16px]/[20px] tracking-tight text-primary-950">
                  {formatDate(item.createdAt)}
                </p>
                <p className="w-[180px] font-normal text-[16px]/[20px] tracking-tight text-primary-950">
                  {item.category.name}
                </p>
                <p className="w-[160px] font-normal text-[16px]/[20px] tracking-tight text-primary-950">
                  {formatCurrency(item.price)}
                </p>
                <p className="w-[112px] font-normal text-[16px]/[20px] tracking-tight text-primary-950 truncate">
                  {item.linkUrl.split("https://")}
                </p>
              </div>
            </div>
          </Desktop>
        </Fragment>
      ))}
    </>
  );
}
