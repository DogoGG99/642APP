import { storage } from "../storage";
import { insertUserSchema } from "@shared/schema";
import { describe, it, expect, beforeEach, vi } from "vitest";
import bcrypt from "bcrypt";

describe("Autenticación", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Login", () => {
    it("debería retornar el usuario si las credenciales son correctas", async () => {
      const mockUser = {
        id: 1,
        username: "testuser",
        password: await bcrypt.hash("testpass", 10),
        role: "user"
      };

      vi.spyOn(storage, "getUserByUsername").mockResolvedValue(mockUser);

      const result = await storage.getUserByUsername("testuser");

      expect(result).toBeDefined();
      expect(result?.username).toBe("testuser");
      expect(await bcrypt.compare("testpass", result!.password)).toBe(true);
    });

    it("debería retornar undefined si el usuario no existe", async () => {
      vi.spyOn(storage, "getUserByUsername").mockResolvedValue(undefined);

      const result = await storage.getUserByUsername("nonexistent");

      expect(result).toBeUndefined();
    });
  });
});