import { handleDashboard } from '../server/endpoint.js';

export default async function handler(req, res) {
  const result = await handleDashboard(req.method, req.url);
  for (const [key, value] of Object.entries(result.headers)) res.setHeader(key, value);
  res.status(result.status).json(result.body);
}
