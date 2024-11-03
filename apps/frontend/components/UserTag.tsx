import { UserTagProps } from "@/lib/types";
import { capitalizeFirstLetter } from "@/lib/utils";

import closeIcon from "@/assets/closeIcon.svg";

function UserTag({ name, index, avatar_image, deselectUser }: UserTagProps) {
  return (
    <div className="flex flex-shrink-0 h-fit cursor-default bg-white items-center px-1 border border-solid border-gray-300 py-[3px] rounded-md gap-[5px] w-fit">
      <img alt="" className="w-4 h-4 rounded-full" src={avatar_image} />
      <div className="text-gray-700 font-medium text-sm">
        {capitalizeFirstLetter(name.split(" ")[0])}
      </div>
      <button
        type="button"
        onClick={() => deselectUser(index)}
        aria-label="Deselect This User"
      >
        <img alt="" src={closeIcon.src} />
      </button>
    </div>
  );
}

export default UserTag;
