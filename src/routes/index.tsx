import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";

const AppRoot = lazy(() => import("@/AppRoot"));

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div id="root" className="h-full">
      {mounted ? (
        <Suspense fallback={null}>
          <AppRoot />
        </Suspense>
      ) : null}
    </div>
  );
}
