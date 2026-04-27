import React, { useState } from "react";
import InfoSection from "./InfoSection";

export default function ProductInfoSections() {
  const [isBenefitOpen, setIsBenefitOpen] = useState(false);
  const [isDeliveryMethodOpen, setIsDeliveryMethodOpen] = useState(false);
  const [isDeliveryFeeOpen, setIsDeliveryFeeOpen] = useState(false);

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <InfoSection title="Purchase Benefits" isOpen={isBenefitOpen} onToggle={() => setIsBenefitOpen(!isBenefitOpen)}>
        Earn 5 points
      </InfoSection>

      <InfoSection
        title="Shipping Method"
        isOpen={isDeliveryMethodOpen}
        onToggle={() => setIsDeliveryMethodOpen(!isDeliveryMethodOpen)}
      >
        Parcel delivery
      </InfoSection>

      <InfoSection
        title="Shipping Fee"
        isOpen={isDeliveryFeeOpen}
        onToggle={() => setIsDeliveryFeeOpen(!isDeliveryFeeOpen)}
      >
        $5 flat-rate shipping. Free shipping on orders over $50.{" "}
        <span className="text-primary-400">Additional fee for remote areas</span>
      </InfoSection>
    </div>
  );
}
