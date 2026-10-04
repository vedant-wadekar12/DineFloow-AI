import { UserRound } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import ModulePage from "@/components/workspace/ModulePage";
import { Card, CardContent } from "@/components/ui/card";
export default function Profile() { const {user}=useAuth(); return <ModulePage title="Profile" description="View the signed-in user's account context."><Card><CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-[#FF6B35]"><UserRound/></div><div><p className="text-lg font-semibold">{user?.firstName || user?.name || "User"} {user?.lastName || ""}</p><p className="text-sm text-gray-500">{user?.email}</p><p className="mt-1 text-xs font-medium text-[#FF6B35]">{user?.role ?? "Authenticated user"}</p></div></CardContent></Card></ModulePage>; }
