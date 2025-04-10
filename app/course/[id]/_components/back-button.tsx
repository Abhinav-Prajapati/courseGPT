"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      className="mb-6 flex items-center gap-2"
      onClick={() => router.push("/course")}
    >
      <ArrowLeft size={16} /> Back to Dashboard
    </Button>
  );
}
