import { http, HttpResponse } from 'msw';
import config from '../config';

const baseURL = config.api.baseURL;

export const handlers = [
  // Mock character names endpoint
  http.get(`${baseURL}/characters`, () => {
    return HttpResponse.json(['Luna', 'Alex', 'Emma']);
  }),

  // Mock AI response endpoint
  http.get(`${baseURL}/ai/response`, () => {
    return HttpResponse.json({
      result: true,
      data: {
        Response: 'This is a mock response',
        Error: null
      }
    });
  }),

  // Mock other endpoints as needed...
]; 