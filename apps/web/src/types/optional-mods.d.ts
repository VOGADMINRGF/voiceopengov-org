// apps/web/src/types/optional-mods.d.ts
declare module "ioredis" {
    const Redis: any;
    export default Redis;
  }
  declare module "neo4j-driver" {
    export const auth: any;
    export const driver: any;
    const _default: any;
    export default _default;
  }
  