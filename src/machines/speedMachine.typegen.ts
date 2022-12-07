// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    geoSpeed: "done.invoke.speed.auto:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingActions: {
    manualSpeedDecrease: "MANUAL_SPEED_DECREASE";
    manualSpeedIncrease: "MANUAL_SPEED_INCREASE";
    setSpeed: "SET_SPEED";
  };
  eventsCausingServices: {
    geoSpeed: "START_AUTO";
  };
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates: "auto" | "static";
  tags: never;
}
