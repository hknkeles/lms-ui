"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Card from "@/components/shared/Card";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function DevRoleSwitcher() {
  const { user, setRole } = useAuth() as any;
  const router = useRouter();
  const [role, setLocalRole] = useState<string>(user?.role || "student");

  useEffect(() => {
    setLocalRole(user?.role || role);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role]);

  return (
    <div className="fixed right-4 bottom-4 z-[9999]">
      <Card className="p-3 bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700 shadow-xl">
        <div className="flex items-center gap-2">
          <Select value={role} onValueChange={(v) => setLocalRole(v)}>
            <SelectTrigger className="w-36 h-8 text-sm">
              <SelectValue placeholder="Rol seç" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
            </SelectContent>
          </Select>
          <Button
            size="sm"
            onClick={() => {
              setRole(role);
              if (role === "admin") router.push("/admin");
              else if (role === "teacher") router.push("/teacher");
              else router.push("/");
            }}
          >
            Uygula
          </Button>
        </div>
      </Card>
    </div>
  );
}


