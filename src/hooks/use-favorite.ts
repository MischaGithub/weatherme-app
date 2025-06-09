import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface FavoriteCity {
  id: string;
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
  addedAt: number;
}

const LOCAL_STORAGE_KEY = "favorites";

function getFavoritesFromStorage(): FavoriteCity[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored) as FavoriteCity[];
  } catch {
    return [];
  }
}

function saveFavoritesToStorage(favorites: FavoriteCity[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(favorites));
}

export function useFavorites() {
  const queryClient = useQueryClient();

  // Query to load favorites from localStorage
  const favoritesQuery = useQuery<FavoriteCity[]>({
    queryKey: ["favorites"],
    queryFn: () => getFavoritesFromStorage(),
    staleTime: Infinity,
  });

  // Mutation to add a favorite city
  const addFavorite = useMutation<
    FavoriteCity[], // Return type of mutationFn
    Error, // Error type
    Omit<FavoriteCity, "id" | "addedAt"> // Variables type: input city data without id/addedAt
  >({
    mutationFn: async (city) => {
      const currentFavorites =
        queryClient.getQueryData<FavoriteCity[]>(["favorites"]) || [];

      const newFavorite: FavoriteCity = {
        ...city,
        id: `${city.lat}-${city.lon}`,
        addedAt: Date.now(),
      };

      // Prevent duplicates
      if (currentFavorites.some((fav) => fav.id === newFavorite.id)) {
        return currentFavorites;
      }

      const newFavorites = [...currentFavorites, newFavorite];
      saveFavoritesToStorage(newFavorites);
      queryClient.setQueryData(["favorites"], newFavorites);

      return newFavorites;
    },
  });

  // Mutation to remove a favorite city by id
  const removeFavorite = useMutation<
    FavoriteCity[], // Return type
    Error,
    string // city id to remove
  >({
    mutationFn: async (cityId) => {
      const currentFavorites =
        queryClient.getQueryData<FavoriteCity[]>(["favorites"]) || [];

      const newFavorites = currentFavorites.filter(
        (city) => city.id !== cityId
      );

      saveFavoritesToStorage(newFavorites);
      queryClient.setQueryData(["favorites"], newFavorites);

      return newFavorites;
    },
  });

  // Helper to check if a city is favorite by lat/lon
  const isFavorite = (lat: number, lon: number) => {
    const favs = favoritesQuery.data ?? [];
    return favs.some((city) => city.lat === lat && city.lon === lon);
  };

  return {
    favorites: favoritesQuery.data ?? [],
    addFavorite,
    removeFavorite,
    isFavorite,
  };
}
