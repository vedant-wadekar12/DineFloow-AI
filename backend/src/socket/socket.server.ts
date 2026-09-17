import { Server } from "socket.io";
import { Server as HttpServer } from "http";

import { socketAuthentication } from "./socket.auth";
import { SOCKET_EVENTS } from "./socket.events";

export let io: Server;

export const initializeSocket = (
  httpServer: HttpServer
) => {
  io = new Server(httpServer, {
    cors: {
      origin: true,
      credentials: true,
    },
  });

  io.use(socketAuthentication);

  io.on(
    SOCKET_EVENTS.CONNECTION,
    (socket) => {
      const user = socket.data.user;

      // Join user-specific room
      if (user?.userId) {
        socket.join(
          `user:${user.userId}`
        );
      }

      // Join restaurant-specific room
      if (user?.restaurantId) {
        socket.join(
          `restaurant:${user.restaurantId}`
        );
      }

      // Join branch-specific room
      if (user?.branchId) {
        socket.join(
          `branch:${user.branchId}`
        );
      }

      // Join restaurant manually
      socket.on(
        SOCKET_EVENTS.JOIN_RESTAURANT,
        (restaurantId: string) => {
          if (
            user?.restaurantId ===
            restaurantId
          ) {
            socket.join(
              `restaurant:${restaurantId}`
            );
          }
        }
      );

      // Join branch manually
      socket.on(
        SOCKET_EVENTS.JOIN_BRANCH,
        (branchId: string) => {
          if (
            user?.branchId ===
            branchId
          ) {
            socket.join(
              `branch:${branchId}`
            );
          }
        }
      );

      // Leave restaurant
      socket.on(
        SOCKET_EVENTS.LEAVE_RESTAURANT,
        (restaurantId: string) => {
          socket.leave(
            `restaurant:${restaurantId}`
          );
        }
      );

      // Leave branch
      socket.on(
        SOCKET_EVENTS.LEAVE_BRANCH,
        (branchId: string) => {
          socket.leave(
            `branch:${branchId}`
          );
        }
      );

      // Disconnect
      socket.on(
        SOCKET_EVENTS.DISCONNECT,
        () => {
          // Socket cleanup is handled automatically.
        }
      );
    }
  );

  return io;
};

// Emit event to all users in a restaurant
export const emitToRestaurant = (
  restaurantId: string,
  event: string,
  data: unknown
) => {
  if (!io) {
    return;
  }

  io.to(
    `restaurant:${restaurantId}`
  ).emit(event, data);
};

// Emit event to all users in a branch
export const emitToBranch = (
  branchId: string,
  event: string,
  data: unknown
) => {
  if (!io) {
    return;
  }

  io.to(
    `branch:${branchId}`
  ).emit(event, data);
};

// Emit event to a specific user
export const emitToUser = (
  userId: string,
  event: string,
  data: unknown
) => {
  if (!io) {
    return;
  }

  io.to(
    `user:${userId}`
  ).emit(event, data);
};