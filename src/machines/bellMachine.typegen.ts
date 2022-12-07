// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    ringing: "done.invoke.bell.ringing:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingActions: {};
  eventsCausingServices: {
    ringing: "RING";
  };
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates: "not-ringing" | "ringing";
  tags: never;
}
