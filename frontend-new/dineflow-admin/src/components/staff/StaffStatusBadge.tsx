interface StaffStatusBadgeProps {
  isActive: boolean;
}

export default function StaffStatusBadge({
  isActive,
}: StaffStatusBadgeProps) {
  return (
    <span
      className={
        isActive
          ? "inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700"
          : "inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600"
      }
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}