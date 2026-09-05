import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import StatusBadge from "@/components/common/StatusBadge";

function App() {
  return (
    <main className="min-h-screen bg-[#FFFDF8] p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          title="DineFlow AI"
          description="Design system preview"
          action={
            <Button>
              Create Restaurant
            </Button>
          }
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>
                Total Orders
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-4xl font-bold">
                128
              </p>

              <StatusBadge status="completed" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Restaurant Status
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <StatusBadge status="active" />

              <Input placeholder="Search..." />

              <div className="flex gap-2">
                <Button>
                  Primary
                </Button>

                <Button variant="outline">
                  Outline
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Status
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <StatusBadge status="pending" />
              <StatusBadge status="paid" />
              <StatusBadge status="cancelled" />
              <StatusBadge status="ready" />
            </CardContent>
          </Card>
        </div>

        <section className="mt-8">
          <EmptyState
            title="No restaurants yet"
            description="Create your first restaurant to start managing your DineFlow workspace."
            action={
              <Button>
                Add Restaurant
              </Button>
            }
          />
        </section>
      </div>
    </main>
  );
}

export default App;