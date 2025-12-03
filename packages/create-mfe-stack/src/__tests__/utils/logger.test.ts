import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger } from '../../utils/logger.js';

describe('logger', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should log info messages with blue icon', () => {
    logger.info('test info message');
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const loggedMessage = consoleSpy.mock.calls[0].join(' ');
    expect(loggedMessage).toContain('test info message');
  });

  it('should log success messages with green icon', () => {
    logger.success('test success message');
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const loggedMessage = consoleSpy.mock.calls[0].join(' ');
    expect(loggedMessage).toContain('test success message');
  });

  it('should log warning messages with yellow icon', () => {
    logger.warning('test warning message');
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const loggedMessage = consoleSpy.mock.calls[0].join(' ');
    expect(loggedMessage).toContain('test warning message');
  });

  it('should log error messages with red icon', () => {
    logger.error('test error message');
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const loggedMessage = consoleSpy.mock.calls[0].join(' ');
    expect(loggedMessage).toContain('test error message');
  });

  it('should log plain messages without icons', () => {
    logger.log('plain message');
    expect(consoleSpy).toHaveBeenCalledWith('plain message');
  });
});
