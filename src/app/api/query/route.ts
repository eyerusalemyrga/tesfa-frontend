import { forward } from "../forward";

// Tesfa AI can take up to ~95s to answer.
export const maxDuration = 120;

export const POST = (request: Request) => forward(request, "/query/");
