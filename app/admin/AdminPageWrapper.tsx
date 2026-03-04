"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserData } from "@/lib/cookie";

interface AdminPageWrapperProps {
  children: ReactNode;
}

export default function AdminPageWrapper({ children }: AdminPageWrapperProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getUserData();

    if (!user || user.role !== "admin") {
      router.push("/"); // redirect non-admins
      return;
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-semibold">
        Checking permissions...
      </div>
    );
  }

  return <>{children}</>;
}
