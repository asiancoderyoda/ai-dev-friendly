import { traceable } from "langsmith/traceable";
import { PlannerStateType } from "../state/planner.state";

function safeNode(fn: any, name: string) {
  return async (state: PlannerStateType) => {
    const traced = traceable(
      async () => fn(state),
      {
        name,
        metadata: {
            
        },
      }
    );

    try {
      return await traced();
    } catch (err: any) {
      console.error("Node failed:", err);

      return {
        ...state,
        error: err.message,
      };
    }
  };
}

export {
    safeNode
}