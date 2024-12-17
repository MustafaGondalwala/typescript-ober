import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model";

export class UserService {
  private userModel: UserModel;

  constructor() {
    this.userModel = new UserModel();
  }

  async createUser(username: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userModel.create(username, hashedPassword);
  }

  async authenticate(username: string, password: string) {
    const user = await this.userModel.findByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid username or password");
    }
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET || "secret", {
      expiresIn: "1h",
    });
  }
}
