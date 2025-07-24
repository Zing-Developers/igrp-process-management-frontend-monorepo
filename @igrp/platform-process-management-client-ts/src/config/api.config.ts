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

// Default configuration
const defaultConfig: ApiConfig = {
  baseUrl: 'http://localhost:8080/activiti-api/api',
  endpoints: {
    // Process endpoints
    processes: 'processes1',
    processStart: 'processes/start',
    
    // Task endpoints
    tasks: 'tasks',
    tasksClaim: 'tasks/claim',
    tasksRelease: 'tasks/release',
    tasksComplete: 'tasks/complete',
    
    // Area endpoints
    areas: 'areas',
    areaProjects: 'area-projects',
    projects: 'projects',
  },
};

// Configuration that can be overridden
let currentConfig: ApiConfig = { ...defaultConfig };

// Function to configure the API settings
export const configureApi = (config: Partial<ApiConfig>): void => {
  currentConfig = {
    ...currentConfig,
    ...config,
    endpoints: {
      ...currentConfig.endpoints,
      ...(config.endpoints || {}),
    },
  };
};

// Function to get current configuration
export const getApiConfig = (): ApiConfig => currentConfig;

// For backward compatibility, export the config object
export const apiConfig = new Proxy({} as ApiConfig, {
  get(target, prop) {
    return currentConfig[prop as keyof ApiConfig];
  }
});