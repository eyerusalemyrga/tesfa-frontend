import { forward } from "../forward";

export const GET = (request: Request) => forward(request, "/profile/");
export const PATCH = (request: Request) => forward(request, "/profile/");
