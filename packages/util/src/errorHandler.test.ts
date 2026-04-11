import { describe, it, expect, vi } from 'vitest';
import type { NextFunction, Request, Response } from 'express';
import { AppError, ValidationError, NotFoundError, errorHandler } from './errorHandler.ts';

function mockRes(): Response {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
}

const mockReq = {} as Request;
const mockNext = (() => {}) as NextFunction;

describe('AppError', () => {
  it('sets statusCode and isOperational', () => {
    const err = new AppError('bad', 422);
    expect(err.statusCode).toBe(422);
    expect(err.isOperational).toBe(true);
    expect(err.message).toBe('bad');
  });
});

describe('ValidationError', () => {
  it('has status 400 and default message', () => {
    const err = new ValidationError();
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe('Invalid request');
  });
});

describe('NotFoundError', () => {
  it('has status 404 and default message', () => {
    const err = new NotFoundError();
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe('Not found');
  });
});

describe('errorHandler', () => {
  it('responds with AppError statusCode and message', () => {
    const res = mockRes();
    errorHandler(new AppError('oops', 418), mockReq, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(418);
    expect(res.json).toHaveBeenCalledWith({ error: 'oops' });
  });

  it('responds 500 for unknown errors', () => {
    const res = mockRes();
    errorHandler(new Error('boom'), mockReq, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });

  it('responds 500 for non-Error throws', () => {
    const res = mockRes();
    errorHandler('string error', mockReq, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
