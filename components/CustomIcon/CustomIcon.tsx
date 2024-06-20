import { CustomIconsProps } from "@/components/CustomIcon/CustomIcons.types";
import React from "react";

export function CustomIcon(props: CustomIconsProps) {
  const { icon: Icon } = props;

  return (
    <div className="p-2 bg-slate-400/20 rounded-lg">
      <Icon strokeWidth={1} className="w-4 h-4" />
    </div>
  );
}
