import { forward } from "../forward";

export const GET = (request: Request) => forward(request, "/users/");
export const POST = (request: Request) => forward(request, "/users/");
