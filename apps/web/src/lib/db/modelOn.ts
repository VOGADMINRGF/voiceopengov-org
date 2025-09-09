import type { Connection, Model, Schema } from "mongoose";

/**
 * Registriert ein Model *auf einer Connection*, ohne globale mongoose.models zu verwenden.
 * Verhindert "OverwriteModelError" bei Hot Reload.
 */
export function modelOn<T>(conn: Connection, name: string, schema: Schema, collection?: string): Model<T> {
  return (conn.models[name] as Model<T>) || conn.model<T>(name, schema, collection);
}
