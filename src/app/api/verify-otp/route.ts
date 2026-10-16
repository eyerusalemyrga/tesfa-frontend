import { forward } from "../forward";

export const POST = (request: Request) => forward(request, "/verify-otp/");
