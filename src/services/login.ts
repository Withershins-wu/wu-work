import request from "@/utils/request";

export function login(params: G.AnyObject): Promise<G.Response> {
  return request.post("/demo/user/login", params);
}
export function register(params: G.AnyObject): Promise<G.Response> {
  return request.post("/demo/user/register", params);
}
