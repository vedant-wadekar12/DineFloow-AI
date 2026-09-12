interface MenuItemStatusBadgeProps {
  isAvailable: boolean;
  isActive?: boolean;
}

export default function MenuItemStatusBadge({
  isAvailable,
  isActive = true,
}: MenuItemStatusBadgeProps) {
  if (!isActive) {
    return (
      <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
        Inactive
      </span>
    );
  }

  if (!isAvailable) {
    return (
      <span className="inline-flex rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
        Unavailable
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
      Available
    </span>
  );
}