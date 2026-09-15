import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { Restaurant } from "@/types/restaurant.types";

import { getRestaurants } from "@/services/restaurants/restaurant.service";

const SELECTED_RESTAURANT_KEY =
  "dineflow_selected_restaurant_id";

interface RestaurantContextType {
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  selectedRestaurantId: string | null;
  isLoading: boolean;

  setSelectedRestaurantId: (
    restaurantId: string | null,
  ) => void;

  refreshRestaurants: () => Promise<void>;
}

const RestaurantContext =
  createContext<RestaurantContextType | undefined>(
    undefined,
  );

interface RestaurantProviderProps {
  children: ReactNode;
}

export function RestaurantProvider({
  children,
}: RestaurantProviderProps) {
  const [restaurants, setRestaurants] =
    useState<Restaurant[]>([]);

  const [selectedRestaurantId, setSelectedRestaurantIdState] =
    useState<string | null>(() => {
      return localStorage.getItem(
        SELECTED_RESTAURANT_KEY,
      );
    });

  const [isLoading, setIsLoading] =
    useState(true);

  const refreshRestaurants = async () => {
    try {
      setIsLoading(true);

      const response =
        await getRestaurants();

      const data =
        (response as any)?.data ??
        response;

      const restaurantList =
        Array.isArray(data)
          ? data
          : data?.restaurants ?? [];

      setRestaurants(restaurantList);

      /*
       * If there is no selected restaurant,
       * automatically select the first available one.
       */
      if (
        !selectedRestaurantId &&
        restaurantList.length > 0
      ) {
        const firstRestaurant =
          restaurantList[0];

        setSelectedRestaurantIdState(
          firstRestaurant.id,
        );

        localStorage.setItem(
          SELECTED_RESTAURANT_KEY,
          firstRestaurant.id,
        );
      }

      /*
       * If the previously selected restaurant
       * no longer exists, select the first one.
       */
      if (
        selectedRestaurantId &&
        !restaurantList.some(
          (restaurant: Restaurant) =>
            restaurant.id ===
            selectedRestaurantId,
        )
      ) {
        if (restaurantList.length > 0) {
          const firstRestaurant =
            restaurantList[0];

          setSelectedRestaurantIdState(
            firstRestaurant.id,
          );

          localStorage.setItem(
            SELECTED_RESTAURANT_KEY,
            firstRestaurant.id,
          );
        } else {
          setSelectedRestaurantIdState(null);
          localStorage.removeItem(
            SELECTED_RESTAURANT_KEY,
          );
        }
      }
    } catch (error) {
      console.error(
        "Failed to load restaurants:",
        error,
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshRestaurants();
  }, []);

  const setSelectedRestaurantId = (
    restaurantId: string | null,
  ) => {
    setSelectedRestaurantIdState(
      restaurantId,
    );

    if (restaurantId) {
      localStorage.setItem(
        SELECTED_RESTAURANT_KEY,
        restaurantId,
      );
    } else {
      localStorage.removeItem(
        SELECTED_RESTAURANT_KEY,
      );
    }
  };

  const selectedRestaurant =
    restaurants.find(
      (restaurant) =>
        restaurant.id ===
        selectedRestaurantId,
    ) ?? null;

  return (
    <RestaurantContext.Provider
      value={{
        restaurants,
        selectedRestaurant,
        selectedRestaurantId,
        isLoading,
        setSelectedRestaurantId,
        refreshRestaurants,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context =
    useContext(RestaurantContext);

  if (!context) {
    throw new Error(
      "useRestaurant must be used inside RestaurantProvider",
    );
  }

  return context;
}