export async function extractStatements(gptResponse: string): Promise<string[]> {
    return gptResponse
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 10);
  }
  