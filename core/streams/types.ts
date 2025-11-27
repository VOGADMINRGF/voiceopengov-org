export type StreamEventKind =
  | "session_started"
  | "session_ended"
  | "agenda_autofilled"
  | "agenda_step_changed"
  | "message"
  | "heartbeat";

export type StreamEventPayload = {
  stepId?: string;
  stepPosition?: number;
  text?: string;
};

export type StreamEvent = {
  id: string;
  sessionId: string;
  kind: StreamEventKind;
  payload?: StreamEventPayload;
  createdAt: Date;
  createdByUserId?: string;
};
