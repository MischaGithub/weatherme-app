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

// Read favorite cities from localStorage
function getFavoritesFromStorage(): FavoriteCity[] {
  if (typeof window === "undefined") return []; // Prevent errors during SSR
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored) as FavoriteCity[];
  } catch {
    return [];
  }
}

// Save the updated favorites list back to localStorage
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

  // Add a favorite city
  const addFavorite = useMutation<
    FavoriteCity[], // Return type of mutationFn
    Error, // Error type
    Omit<FavoriteCity, "id" | "addedAt">
  >({
    mutationFn: async (city) => {
      // Get the current list of favorites from the cache
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

      // Add the new favorite to the list and update localStorage + query cache
      const newFavorites = [...currentFavorites, newFavorite];
      saveFavoritesToStorage(newFavorites);
      queryClient.setQueryData(["favorites"], newFavorites);

      return newFavorites;
    },
  });

  // Remove a favorite city by id
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

  // Check if a city is favorite by lat/lon
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
