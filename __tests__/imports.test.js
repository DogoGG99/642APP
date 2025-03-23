const { describe, it, expect } = require('@jest/globals');

describe('Import Tests', () => {
  it('should properly import drizzle-zod', async () => {
    const { createInsertSchema } = await import('drizzle-zod');
    expect(createInsertSchema).toBeDefined();
    console.log('createInsertSchema:', typeof createInsertSchema);
  });

  it('should properly import drizzle-orm', async () => {
    const { pgTable, text } = await import('drizzle-orm/pg-core');
    expect(pgTable).toBeDefined();
    expect(text).toBeDefined();
    console.log('pgTable:', typeof pgTable);
    console.log('text:', typeof text);
  });

  it('should properly import zod', async () => {
    const { z } = await import('zod');
    expect(z).toBeDefined();
    console.log('z:', typeof z);
  });
});
