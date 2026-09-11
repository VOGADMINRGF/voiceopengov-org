type Environment = Record<string, string | undefined>;

export function readSecret(name: string, environment: Environment = process.env) {
  const value = environment[name]?.trim();
  return value || undefined;
}

export function requireSecret(name: string, environment: Environment = process.env) {
  const value = readSecret(name, environment);
  if (!value) throw new Error(`Missing required secret: ${name}`);
  return value;
}
