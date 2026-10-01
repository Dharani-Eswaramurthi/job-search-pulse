import { handleDashboard } from '../../server/endpoint.js';

export default async function handler(request) {
  const result = await handleDashboard(request.method, request.url);
  return Response.json(result.body, { status: result.status, headers: result.headers });
}
export const config = { path: '/api/dashboard' };
