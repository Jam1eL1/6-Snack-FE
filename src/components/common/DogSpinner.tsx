import Image from "next/image";
import img_dog from "@/assets/images/img_dog.png";
import ic_dot from "@/assets/icons/ic_dot.svg";

export default function DogSpinner() {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex gap-2">
        <div className="relative w-2 h-2">
          <Image src={ic_dot} alt="Loading dot" fill className="object-contain bounce-y animation-delay-0" />
        </div>
        <div className="relative w-2 h-2">
          <Image src={ic_dot} alt="Loading dot" fill className="object-contain bounce-y animation-delay-200" />
        </div>
        <div className="relative w-2 h-2">
          <Image src={ic_dot} alt="Loading dot" fill className="object-contain bounce-y animation-delay-400" />
        </div>
      </div>

      <div className="relative w-20 h-16">
        <Image src={img_dog} alt="Loading mascot" fill className="object-contain" />
      </div>
    </div>
  );
}
