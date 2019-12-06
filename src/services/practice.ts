import request from "../utils/request";

export function addPracticesHistory(params: G.AnyObject): Promise<G.Response> {
  return request.post("/practice/addPracticesHistory", params);
}
export function getLikePractices(params: G.AnyObject): Promise<G.Response> {
  return request.post("/practice/getLikePractices", params);
}
export function getPractices(params: G.AnyObject): Promise<G.Response> {
  return request.post("/practice/getPractices", params);
}
export function getPracticesHistory(params: G.AnyObject): Promise<G.Response> {
  return request.post("/practice/getPracticesHistory", params);
}
