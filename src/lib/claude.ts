export function isClaudeConfigured() {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export async function generateClaudeReport() {
  if (!isClaudeConfigured()) {
    return null;
  }

  return null;
}
