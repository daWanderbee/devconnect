"use client";
import UserImg from "@/src/components/assets/svg/user.svg"; 
import { DirectionAwareHover } from "@/src/components/ui/direction-aware-hover";

export function DirectionAwareHoverDemo({img,fullname}) {
  const imageUrl =
    img ||
    UserImg;
  return (
    (<div className=" h-[40rem] relative  flex items-center justify-center">
      <DirectionAwareHover className="shadow-xl" imageUrl={imageUrl}>
        <p className="font-bold text-xl">{fullname}</p>
      </DirectionAwareHover>
    </div>)
  );
}
