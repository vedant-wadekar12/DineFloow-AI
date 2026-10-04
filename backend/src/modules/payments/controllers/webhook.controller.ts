import { Request, Response, NextFunction } from "express";
import { webhookService } from "../services/webhook.service";

export class WebhookController {
  handleRazorpayWebhook = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const rawBody =
        (req as any).rawBody ||
        Buffer.from(JSON.stringify(req.body));

      const signature =
        (req.headers["x-razorpay-signature"] as string) ||
        (req.headers["x-signature"] as string);

      const requestId = (req as any).id;

      const result = await webhookService.processRazorpayWebhook(
        rawBody,
        signature,
        req.body,
        requestId
      );

      return res.status(200).json({
        success: true,
        message: "Webhook processed successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const webhookController = new WebhookController();
