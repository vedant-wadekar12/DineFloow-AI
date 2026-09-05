import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

function Dashboard() {
  const {
    user,
    logout,
  } = useAuth();

  return (
    <main className="min-h-screen bg-[#FFFDF8] p-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Welcome back
            </p>

            <h1 className="text-3xl font-bold">
              {user?.firstName ??
                user?.name ??
                user?.email}
            </h1>
          </div>

          <Button
            variant="outline"
            onClick={logout}
          >
            Logout
          </Button>
        </div>

        <div className="mt-10 rounded-2xl border bg-white p-8">
          <h2 className="text-xl font-semibold">
            DineFlow Dashboard
          </h2>

          <p className="mt-2 text-gray-500">
            Authentication is working. The full
            application dashboard will be built in Phase 6.
          </p>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;