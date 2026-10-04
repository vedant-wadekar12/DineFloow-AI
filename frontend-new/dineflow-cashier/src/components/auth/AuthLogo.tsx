import { Utensils } from "lucide-react";

export default function AuthLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF6B35] text-white shadow-sm">
        <Utensils className="h-5 w-5" />
      </div>
      <div>
        <p className="text-base font-bold text-gray-900">DineFlow</p>
        <p className="text-[11px] font-medium text-[#FF6B35]">AI RESTAURANT OS</p>
      </div>
    </div>
  );
}
