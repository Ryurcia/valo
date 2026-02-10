"use client";

import { useEffect } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Idea } from "@/types";

interface PaginatedIdeasResponse {
  ideas: Idea[];
  nextCursor: string | null;
}

export const FEED_QUERY_KEY = ["feed", "ideas"] as const;
const PAGE_SIZE = 30;

async function fetchFeedPage({
  pageParam,
}: {
  pageParam: string | null;
}): Promise<PaginatedIdeasResponse> {
  const params = new URLSearchParams({ limit: String(PAGE_SIZE) });
  if (pageParam) {
    params.set("cursor", pageParam);
  }

  const res = await fetch(`/api/ideas?${params.toString()}`);
  if (!res.ok) {
    throw new Error("Failed to fetch feed");
  }
  return res.json();
}

export function useFeedQuery() {
  const queryClient = useQueryClient();

  const query = useInfiniteQuery({
    queryKey: FEED_QUERY_KEY,
    queryFn: fetchFeedPage,
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    const channel = supabase
      .channel("ideas-feed")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "ideas",
        },
        (payload) => {
          const newIdea = payload.new as Idea;

          queryClient.setQueryData(
            FEED_QUERY_KEY,
            (oldData: typeof query.data | undefined) => {
              if (!oldData) return oldData;

              const firstPage = oldData.pages[0];
              if (firstPage.ideas.some((idea) => idea.id === newIdea.id)) {
                return oldData;
              }

              return {
                ...oldData,
                pages: [
                  {
                    ...firstPage,
                    ideas: [newIdea, ...firstPage.ideas],
                  },
                  ...oldData.pages.slice(1),
                ],
              };
            }
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
}
