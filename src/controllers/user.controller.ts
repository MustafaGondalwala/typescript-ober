import { Request, Response } from "express";
import { trace, SpanStatusCode } from "@opentelemetry/api";
import { UserService } from "../services/user.service";
import { logger } from "../utils/logger";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async signup(req: Request, res: Response) {
    const span = trace.getTracer("default").startSpan("signup");
    try {
      const { username, password } = req.body;
      const user = await this.userService.createUser(username, password);
      span.setStatus({ code: SpanStatusCode.OK });
      logger.info("User signed up successfully", { username });
      res.status(201).json({ message: "User created", user });
    } catch (error: any) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
      logger.error("Error signing up user", { error: error.message });
      res.status(500).json({ error: error.message });
    } finally {
      span.end();
    }
  }

  async login(req: Request, res: Response) {
    const span = trace.getTracer("default").startSpan("login");
    try {
      const { username, password } = req.body;
      const token = await this.userService.authenticate(username, password);
      span.setStatus({ code: SpanStatusCode.OK });
      logger.info("User logged in successfully", { username });
      res.status(200).json({ token });
    } catch (error: any) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
      logger.error("Error logging in user", { error: error.message });
      res.status(401).json({ error: error.message });
    } finally {
      span.end();
    }
  }
}
