"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

interface Props {
  children: React.ReactNode;
}

export default function QueryProvider({ children }: Props) {
  // Create a new QueryClient instance
  // This is done on the client side to ensure that the QueryClientProvider
  // can manage the state of queries and mutations effectively.
  // Using useState to ensure that the QueryClient is only created once
  // and persists across re-renders.
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
