import * as HTTP from "./http";
import { Cluster, IListApiReponse } from "@/types/api";

export function getClusters(): Promise<Cluster[]> {
  return HTTP.get("/api/v1/cluster/?page_size=100").then(async (r) => {
    if (!r.ok) throw new Error("Unable to get clusters.");
    const data: IListApiReponse<Cluster> = await r.json();
    return data.results;
  });
}
