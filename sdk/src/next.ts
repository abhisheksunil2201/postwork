import FeatureFlags from "./client";

export async function getFeatureFlags(apiUrl: string): Promise<FeatureFlags> {
  const featureFlags = new FeatureFlags(apiUrl);
  await featureFlags.fetchFlags();
  return featureFlags;
}
