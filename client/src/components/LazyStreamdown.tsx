import { lazy, Suspense, type ComponentProps } from "react";

const Streamdown = lazy(() =>
  import("streamdown").then((mod) => ({ default: mod.Streamdown }))
);

export function LazyStreamdown(props: ComponentProps<typeof Streamdown>) {
  return (
    <Suspense fallback={null}>
      <Streamdown {...props} />
    </Suspense>
  );
}

