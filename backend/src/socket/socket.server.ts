import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { createAdapter } from "@socket.io/redis-adapter";
import IORedis from "ioredis";

import { socketAuthentication } from "./socket.auth";
import { SOCKET_EVENTS } from "./socket.events";
import { logger } from "../config";

export let io: Server;

const redisUrl = process.env.REDIS_URL ?? "redis://127.0.0.1:6379";

const pubClient = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
  enableOfflineQueue: false,
  connectTimeout: 1000,
  lazyConnect: true,
  retryStrategy(times) {
    if (times > 1) return null; // stop retrying quickly when Redis is offline
    return 100;
  },
});
const subClient = pubClient.duplicate();

pubClient.on("error", (err) => {
  logger.warn("Socket.IO Redis pubClient connection issue:", err.message);
});
subClient.on("error", (err) => {
  logger.warn("Socket.IO Redis subClient connection issue:", err.message);
});

export const initializeSocket = (
  httpServer: HttpServer
) => {
  io = new Server(httpServer, {
    cors: {
      origin: true,
      credentials: true,
    },
  });

  Promise.all([pubClient.connect(), subClient.connect()])
    .then(() => {
      io.adapter(createAdapter(pubClient, subClient));
      logger.info("✅ Socket.IO Redis Adapter initialized successfully");
    })
    .catch((err) => {
      logger.warn(
        "⚠️ Socket.IO Redis Adapter connection failed; fallback to local memory adapter:",
        err.message
      );
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