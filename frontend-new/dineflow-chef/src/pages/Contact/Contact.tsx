import PublicPage from "@/components/common/PublicPage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

function Contact() {
  return (
    <PublicPage
      title="Contact us"
      description="Have a question? We'd love to hear from you."
    >
      <section className="mx-auto max-w-2xl px-5 pb-24">
        <form className="space-y-6 rounded-3xl border bg-white p-8">
          <div>
            <Label>Name</Label>
            <Input
              className="mt-2"
              placeholder="Your name"
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              className="mt-2"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <Label>Message</Label>
            <Textarea
              className="mt-2 min-h-32"
              placeholder="How can we help?"
            />
          </div>

          <Button className="w-full">
            Send Message
          </Button>
        </form>
      </section>
    </PublicPage>
  );
}

export default Contact;