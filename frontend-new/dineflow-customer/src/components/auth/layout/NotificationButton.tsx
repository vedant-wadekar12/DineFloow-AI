import { Bell } from "lucide-react";

function NotificationButton() {
  return (
    <button
      type="button"
      className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#FF6B35]"
      aria-label="Notifications"
    >
      <Bell className="h-[18px] w-[18px]" />

      <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#FF6B35]" />
    </button>
  );
}

export default NotificationButton;