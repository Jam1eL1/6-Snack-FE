import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { productRegistrationSchema, type ProductRegistrationFormData } from "@/lib/schemas/product.schema";
import { CATEGORIES } from "@/lib/constants/categories";
import { useCreateProduct } from "./useProductMutations";
import { SessionExpiredError } from "@/lib/api/auth.errors";

type UseProductRegistrationFormProps = {
  onSubmitSuccess?: () => void;
  onClose?: () => void;
  initialData?: {
    productName: string;
    price: string;
    productLink: string;
    parentCategory: string;
    childrenCategory: string;
    imageUrl?: string;
  };
};

export const useProductRegistrationForm = ({
  onSubmitSuccess,
  onClose,
  initialData,
}: UseProductRegistrationFormProps) => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const createProductMutation = useCreateProduct();

  const form = useForm<ProductRegistrationFormData>({
    resolver: zodResolver(productRegistrationSchema),
    mode: "onChange",
    defaultValues: {
      productName: "",
      price: "",
      productLink: "",
      parentCategory: "",
      childrenCategory: "",
    },
  });

  const { watch, setValue, reset, trigger } = form;
  const watchedValues = watch();

  // Set initial form data.
  useEffect(() => {
    if (initialData) {
      setValue("productName", initialData.productName);
      setValue("price", initialData.price);
      setValue("productLink", initialData.productLink);
      setValue("parentCategory", initialData.parentCategory);
      setValue("childrenCategory", initialData.childrenCategory);
      if (initialData.imageUrl) {
        setImagePreviewUrl(initialData.imageUrl);
      }
    }
  }, [initialData, setValue]);
  // Handle image selection.
  const handleImageChange = (file: File | null) => {
    if (file) {
      setValue("imageFile", file);
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setValue("imageFile", null);
      setImagePreviewUrl(null);
    }
    // Revalidate the image field.
    trigger("imageFile");
  };

  const handleImageRemove = () => {
    setValue("imageFile", null);
    setImagePreviewUrl(null);
    // Revalidate the image field.
    trigger("imageFile");
  };

  // Handle category selection.
  const handleParentCategoryChange = (value: string) => {
    setValue("parentCategory", value);
    setValue("childrenCategory", "");
  };

  const handleChildrenCategoryChange = (value: string) => {
    setValue("childrenCategory", value);
  };

  // Submit the form.
  const onSubmit = async (data: ProductRegistrationFormData) => {
    try {
      // Map selected categories to the backend category id.
      const categoryId = getCategoryId(data.parentCategory, data.childrenCategory);

      const formData = new FormData();
      formData.append("name", data.productName);
      formData.append("price", data.price);
      formData.append("linkUrl", data.productLink);
      formData.append("categoryId", categoryId.toString());

      if (data.imageFile && data.imageFile.size > 0) {
        formData.append("image", data.imageFile);
      }

      await createProductMutation.mutateAsync(formData);

      reset();
      setImagePreviewUrl(null);
      onSubmitSuccess?.();
      onClose?.();
    } catch (error) {
      if (error instanceof SessionExpiredError) return;

      console.error("Failed to create product:", error);
    }
  };

  // Category options.
  const parentCategoryOptions = CATEGORIES.parentCategory.map((category) => category.name);
  const childrenCategoryOptions = watchedValues.parentCategory
    ? CATEGORIES.childrenCategory[watchedValues.parentCategory as keyof typeof CATEGORIES.childrenCategory]?.map(
        (category) => category.name,
      ) || []
    : [];

  return {
    form,
    imagePreviewUrl,
    createProductMutation,
    parentCategoryOptions,
    childrenCategoryOptions,
    handleImageChange,
    handleImageRemove,
    handleParentCategoryChange,
    handleChildrenCategoryChange,
    onSubmit: form.handleSubmit(onSubmit),
  };
};

// Get the backend category id for selected category names.
const getCategoryId = (mainCategory: string, subCategory: string): number => {
  const parentCategory = CATEGORIES.parentCategory.find((cat) => cat.name === mainCategory);
  if (!parentCategory) return 1;

  const childrenCategories = CATEGORIES.childrenCategory[mainCategory as keyof typeof CATEGORIES.childrenCategory];
  const subCategoryObj = childrenCategories?.find((cat) => cat.name === subCategory);

  return subCategoryObj?.id || 1;
};
