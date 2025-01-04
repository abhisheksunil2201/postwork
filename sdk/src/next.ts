import PostworkClient from "./client";

let postworkInstance: PostworkClient | null = null;

export function initPostwork(apiKey: string, apiUrl: string): PostworkClient {
  if (!postworkInstance) {
    postworkInstance = new PostworkClient(apiKey, apiUrl);
  }
  return postworkInstance;
}

export async function getFeatureFlags(
  apiKey: string,
  userId: string,
  userProperties: Record<string, any> = {},
  apiUrl: string
): Promise<PostworkClient["flags"]> {
  const posthog = initPostwork(apiKey, apiUrl);
  posthog.identify(userId, userProperties);
  await posthog.fetchFeatureFlags();
  return posthog.getFeatureFlags();
}
