import { forward } from "../forward";

export const GET = (request: Request) => forward(request, "/conversations/");
