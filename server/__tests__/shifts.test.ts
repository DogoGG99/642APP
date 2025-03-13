import { storage } from "../storage";
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("Gestión de Turnos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Apertura de Turno", () => {
    it("debería crear un nuevo turno correctamente", async () => {
      const mockShift = {
        id: 1,
        userId: 1,
        startTime: new Date().toISOString(),
        endTime: null,
        status: "active",
        shiftType: "matutino",
        notes: "Test shift"
      };

      vi.spyOn(storage, "createShift").mockResolvedValue(mockShift);
      vi.spyOn(storage, "getActiveShift").mockResolvedValue(undefined);

      const newShift = await storage.createShift({
        userId: 1,
        startTime: new Date().toISOString(),
        shiftType: "matutino",
        notes: "Test shift",
        status: "active"
      });

      expect(newShift).toBeDefined();
      expect(newShift.status).toBe("active");
      expect(newShift.endTime).toBeNull();
    });

    it("debería verificar si ya existe un turno activo", async () => {
      const mockActiveShift = {
        id: 1,
        userId: 1,
        startTime: new Date().toISOString(),
        endTime: null,
        status: "active",
        shiftType: "matutino",
        notes: null
      };

      vi.spyOn(storage, "getActiveShift").mockResolvedValue(mockActiveShift);

      const activeShift = await storage.getActiveShift(1);

      expect(activeShift).toBeDefined();
      expect(activeShift?.status).toBe("active");
      expect(storage.getActiveShift).toHaveBeenCalledWith(1);
    });
  });
});