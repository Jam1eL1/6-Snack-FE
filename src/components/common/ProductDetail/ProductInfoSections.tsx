import React, { useState } from "react";
import InfoSection from "./InfoSection";

export default function ProductInfoSections() {
  const [isBenefitOpen, setIsBenefitOpen] = useState(false);
  const [isDeliveryMethodOpen, setIsDeliveryMethodOpen] = useState(false);
  const [isDeliveryFeeOpen, setIsDeliveryFeeOpen] = useState(false);

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <InfoSection
        title="Purchase Benefits"
        isOpen={isBenefitOpen}
        onToggle={() => setIsBenefitOpen((isOpen) => !isOpen)}
      >
        Earn 5 points
      </InfoSection>

      <InfoSection
        title="Shipping Method"
        isOpen={isDeliveryMethodOpen}
        onToggle={() => setIsDeliveryMethodOpen((isOpen) => !isOpen)}
      >
        Parcel delivery
      </InfoSection>

      <InfoSection
        title="Shipping Fee"
        isOpen={isDeliveryFeeOpen}
        onToggle={() => setIsDeliveryFeeOpen((isOpen) => !isOpen)}
      >
        $5 flat-rate shipping.
      </InfoSection>
    </div>
  );
}
