import {
  Request,
  Response,
  NextFunction,
} from "express";

import { BadRequestError } from "../../../common/errors";
import { cartService } from "../services/cart.service";

export class CartController {
  private sessionId(req: Request): string {
    const value = req.header("x-cart-session-id");
    if (!value) throw new BadRequestError("x-cart-session-id header is required.");
    return value;
  }

  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const cart =
        await cartService.create(
          req.body
        );

      res.status(201).json({
        success: true,
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const cart =
        await cartService.getById(
          String(req.params.cartId),
          this.sessionId(req)
        );

      res.json({
        success: true,
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  async addItem(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const cart =
        await cartService.addItem(
          String(req.params.cartId),
          this.sessionId(req),
          req.body
        );

      res.json({
        success: true,
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateItem(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const cart =
        await cartService.updateItem(
          String(req.params.cartId),
          this.sessionId(req),
          String(req.params.itemId),
          req.body
        );

      res.json({
        success: true,
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  async removeItem(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const cart =
        await cartService.removeItem(
          String(req.params.cartId),
          this.sessionId(req),
          String(req.params.itemId)
        );

      res.json({
        success: true,
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  async clear(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const cart =
        await cartService.clear(
          String(req.params.cartId),
          this.sessionId(req)
        );

      res.json({
        success: true,
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  async deactivate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const cart =
        await cartService.deactivate(
          String(req.params.cartId),
          this.sessionId(req)
        );

      res.json({
        success: true,
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const cartController =
  new CartController();