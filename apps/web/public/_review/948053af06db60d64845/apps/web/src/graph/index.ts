import { GRAPH_PRIMARY } from "./graph.config";
import type { GraphRepo } from "./types";
import neo4jRepo from "./neo4jRepo";
import arangoRepo from "./arangoRepo";
import memgraphRepo from "./memgraphRepo";

let repo: GraphRepo;

switch (GRAPH_PRIMARY) {
  case "arango": repo = arangoRepo; break;
  case "memgraph": repo = memgraphRepo; break;
  case "neo4j":
  default: repo = neo4jRepo; break;
}

export default repo;