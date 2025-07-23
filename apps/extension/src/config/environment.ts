// Environment configuration for the extension
// These values should be set based on your deployment environment

interface EnvironmentConfig {
  apiBaseUrl: string;
}

// Development configuration
const development: EnvironmentConfig = {
  apiBaseUrl: "http://localhost:3001/api",
};

// Production configuration
const production: EnvironmentConfig = {
  apiBaseUrl: "https://your-api-domain.com/api",
};

// Determine environment based on extension ID or manifest
const isProduction = false; //!chrome.runtime.id?.includes("development");

export const config: EnvironmentConfig = isProduction
  ? production
  : development;

export default config;
