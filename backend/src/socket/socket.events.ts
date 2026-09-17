export const SOCKET_EVENTS = {
  CONNECTION: "connection",

  DISCONNECT: "disconnect",

  ORDER_CREATED: "order:created",

  ORDER_UPDATED: "order:updated",

  ORDER_CONFIRMED: "order:confirmed",

  ORDER_PREPARING: "order:preparing",

  ORDER_READY: "order:ready",

  ORDER_SERVED: "order:served",

  ORDER_CANCELLED: "order:cancelled",

  PAYMENT_SUCCESS: "payment:success",

  PAYMENT_FAILED: "payment:failed",

  NOTIFICATION: "notification",

  KITCHEN_UPDATE: "kitchen:update",

  WAITER_TASK: "waiter:task",

  JOIN_RESTAURANT: "restaurant:join",

  JOIN_BRANCH: "branch:join",

  LEAVE_RESTAURANT: "restaurant:leave",

  LEAVE_BRANCH: "branch:leave",
} as const;