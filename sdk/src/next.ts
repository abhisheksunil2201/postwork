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
  const postwork = initPostwork(apiKey, apiUrl);
  postwork.identify(userId, userProperties);
  await postwork.fetchFeatureFlags();
  return postwork.getFeatureFlags();
}
