import axios from "axios";

interface Flags {
  [key: string]: boolean | string | number;
}

class FeatureFlags {
  private apiUrl: string;
  public flags: Flags;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
    this.flags = {};
  }

  async fetchFlags(): Promise<void> {
    try {
      const response = await axios.get<Flags>(`${this.apiUrl}/api/flags`);
      this.flags = response.data;
    } catch (error) {
      console.error("Failed to fetch feature flags:", error);
    }
  }

  isEnabled(key: string): boolean {
    return Boolean(this.flags[key]);
  }
}

export default FeatureFlags;
