import {
  Eye,
  EyeOff,
} from "lucide-react";

import {
  useState,
  type InputHTMLAttributes,
} from "react";

import { Input } from "@/components/ui/input";

interface PasswordInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type"
  > {}

function PasswordInput(
  props: PasswordInputProps,
) {
  const [show, setShow] =
    useState(false);

  return (
    <div className="relative">
      <Input
        {...props}
        type={show ? "text" : "password"}
        className="pr-10"
      />

      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        aria-label={
          show
            ? "Hide password"
            : "Show password"
        }
      >
        {show ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

export default PasswordInput;