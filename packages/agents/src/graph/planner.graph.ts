import { END, START, StateGraph } from "@langchain/langgraph";
import { PlannerState, PlannerStateType } from "../state/planner.state";
import PlannerAgent from "../planner/planner.agent";
import { safeNode } from "./safeNode";

const plannerAgent = new PlannerAgent();

const plannerGraph = new StateGraph(PlannerState)

plannerGraph.addNode("plannerNode", safeNode(plannerAgent, "Planner Node"))
.addEdge(START, "plannerNode")
.addEdge("plannerNode", END)
