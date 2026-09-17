import { Socket } from "socket.io";

import { tokenUtil } from "../common/utilities";

export const socketAuthentication = (
  socket: Socket,
  next: (err?: Error) => void
) => {
  try {
    const token =
      socket.handshake.auth?.token;

    if (!token) {
      return next(
        new Error(
          "Authentication token is required."
        )
      );
    }

    const payload =
      tokenUtil.verifyAccessToken(token);

    socket.data.user = payload;

    next();
  } catch {
    next(
      new Error(
        "Invalid or expired authentication token."
      )
    );
  }
};