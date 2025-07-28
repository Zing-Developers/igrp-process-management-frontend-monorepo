// api.config.ts
export interface ApiConfig {
  baseUrl: string;
  endpoints: {
    // Process endpoints
    processes: string;
    processStart: string;
    
    // Task endpoints
    tasks: string;
    tasksClaim: string;
    tasksRelease: string;
    tasksComplete: string;
    
    // Area endpoints
    areas: string;
    areaProjects: string;
    projects: string;
  };
}

// Helper function to safely get environment variables (called lazily)
const getEnvVar = (key: string, defaultValue: string): string => {
  try {
    // Debug: Log what we're looking for
    console.log(`Looking for environment variable: ${key}`);
    
    // Check for Next.js client-side environment variables
    console.log(`Checking Next.js key: ${key}`);
    console.log(`process.env[${key}]:`, process.env[key]);
    
    if (process.env[key]) {
      console.log(`Found ${key}:`, process.env[key]);
      return process.env[key] || defaultValue;
    }
    
    console.log(`No environment variable found for ${key}, using default:`, defaultValue);
    return defaultValue;
  } catch (error) {
    console.warn(`Error reading environment variable ${key}:`, error);
    return defaultValue;
  }
};
// Function to create default configuration (called lazily)
const createDefaultConfig = (): ApiConfig => {
  console.log('[API Config] Creating default configuration...');
  return {
    baseUrl: getEnvVar('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:8080/activiti-api/api'),
    endpoints: {
      // Process endpoints
      processes: getEnvVar('NEXT_PUBLIC_PROCESSES_ENDPOINT', 'processes1'),
      processStart: getEnvVar('NEXT_PUBLIC_PROCESS_START_ENDPOINT', 'processes/start'),
      
      // Task endpoints
      tasks: getEnvVar('NEXT_PUBLIC_TASKS_ENDPOINT', 'tasks'),
      tasksClaim: getEnvVar('NEXT_PUBLIC_TASKS_CLAIM_ENDPOINT', 'tasks/claim'),
      tasksRelease: getEnvVar('NEXT_PUBLIC_TASKS_RELEASE_ENDPOINT', 'tasks/release'),
      tasksComplete: getEnvVar('NEXT_PUBLIC_TASKS_COMPLETE_ENDPOINT', 'tasks/complete'),
      
      // Area endpoints
      areas: getEnvVar('NEXT_PUBLIC_AREAS_ENDPOINT', 'areas'),
      areaProjects: getEnvVar('NEXT_PUBLIC_AREA_PROJECTS_ENDPOINT', 'area-projects'),
      projects: getEnvVar('NEXT_PUBLIC_PROJECTS_ENDPOINT', 'projects'),
    },
  };
};

// Configuration that can be overridden
let currentConfig: ApiConfig | null = null;

// Function to get or create the default configuration
const getDefaultConfig = (): ApiConfig => {
  if (!currentConfig) {
    currentConfig = createDefaultConfig();
  }
  return currentConfig;
};

// Function to configure the API settings
export const configureApi = (config: Partial<ApiConfig>): void => {
  const defaultConfig = getDefaultConfig();
  currentConfig = {
    ...defaultConfig,
    ...config,
    endpoints: {
      ...defaultConfig.endpoints,
      ...(config.endpoints || {}),
    },
  };
  console.log('[API Config] Configuration updated:', currentConfig);
};

// Function to get current configuration
export const getApiConfig = (): ApiConfig => {
  return currentConfig || getDefaultConfig();
};

// For backward compatibility, export the config object
export const apiConfig = new Proxy({} as ApiConfig, {
  get(target, prop) {
    const config = getApiConfig();
    return config[prop as keyof ApiConfig];
  }
});