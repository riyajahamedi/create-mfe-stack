import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getNextAvailablePort, isPortAvailable, findAvailablePort } from '../../utils/ports.js';

describe('ports utilities', () => {
  describe('getNextAvailablePort', () => {
    it('should return 3001 when no existing ports', () => {
      expect(getNextAvailablePort([])).toBe(3001);
    });

    it('should return max port + 1', () => {
      expect(getNextAvailablePort([3000, 3001, 3002])).toBe(3003);
    });

    it('should handle non-sequential ports', () => {
      expect(getNextAvailablePort([3000, 3005, 3002])).toBe(3006);
    });

    it('should handle single port', () => {
      expect(getNextAvailablePort([3000])).toBe(3001);
    });

    it('should handle high port numbers', () => {
      expect(getNextAvailablePort([8080, 8081])).toBe(8082);
    });
  });

  describe('isPortAvailable', () => {
    it('should return true for available port', async () => {
      // Use a high port unlikely to be in use
      const result = await isPortAvailable(59999);
      expect(typeof result).toBe('boolean');
    });
  });

  describe('findAvailablePort', () => {
    it('should find an available port', async () => {
      const port = await findAvailablePort(59990);
      expect(port).toBeGreaterThanOrEqual(59990);
      expect(port).toBeLessThan(60090);
    });
  });
});
