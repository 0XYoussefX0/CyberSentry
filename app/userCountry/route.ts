import { geolocation } from "@vercel/functions";

export function GET(request: Request) {
  const { country } = geolocation(request);
  const response = JSON.stringify({ country });
  return new Response(response);
}
