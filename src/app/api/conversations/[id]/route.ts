import { forward } from "../../forward";

type Context = { params: Promise<{ id: string }> };

async function toBackend(request: Request, { params }: Context) {
  const { id } = await params;
  return forward(request, `/conversations/${id}/`);
}

export { toBackend as GET, toBackend as PATCH, toBackend as DELETE };
