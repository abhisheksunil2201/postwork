import axios from "axios";

interface User {
  id: string;
  [key: string]: any; // Additional user properties
}

interface Flags {
  [key: string]: boolean;
}

class PostworkClient {
  private apiKey: string;
  private apiUrl: string;
  private user: User | null = null;
  private flags: Flags = {};

  constructor(apiKey: string, apiUrl: string) {
    this.apiKey = apiKey;
    this.apiUrl = apiUrl;
  }

  // Identify a user
  identify(userId: string, userProperties: Record<string, any> = {}): void {
    this.user = { id: userId, ...userProperties };
    this.fetchFeatureFlags();
  }

  // Fetch feature flags for the identified user
  async fetchFeatureFlags(): Promise<void> {
    if (!this.user) {
      console.error("No user identified. Call identify() first.");
      return;
    }

    try {
      const response = await axios.post<{ flags: Flags }>(
        `${this.apiUrl}/api/feature_flags`,
        {
          user_id: this.user.id,
          properties: this.user,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );

      this.flags = response.data.flags || {};
    } catch (error) {
      console.error("Failed to fetch feature flags:", error);
    }
  }

  // Check if a feature flag is enabled for the user
  isFeatureEnabled(flagKey: string): boolean {
    return !!this.flags[flagKey];
  }

  // Get all feature flags for the user
  getFeatureFlags(): Flags {
    return this.flags;
  }
}

export default PostworkClient;
