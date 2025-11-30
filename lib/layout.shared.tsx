import { Logo } from "@/components/ui/logo";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <div className="flex gap-2 items-center">
          <div className="bg-background rounded-sm border">
            <Logo className="w-6 h-6" />
          </div>{" "}
          JOYCO Registry
        </div>
      ),
    },
  };
}
