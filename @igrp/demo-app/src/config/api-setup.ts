import { configureApi } from '@igrp/platform-process-management-client-ts/src/config/api.config';

// Function to get environment variable with fallback for Next.js
const getEnvVar = (key: string, defaultValue: string): string => {
  try {
    // Debug: Log what we're looking for
    console.log(`Looking for environment variable: ${key}`);
    
    // Method 1: Check for Next.js client-side environment variables
    const nextPublicKey = key.replace('VITE_', 'NEXT_PUBLIC_');
    console.log(`Checking Next.js key: ${nextPublicKey}`);
    console.log(`process.env[${nextPublicKey}]:`, process.env[nextPublicKey]);
    
    if (process.env[nextPublicKey]) {
      console.log(`Found ${nextPublicKey}:`, process.env[nextPublicKey]);
      return process.env[nextPublicKey] || defaultValue;
    }
    
    // Method 2: Check for original key in process.env
    console.log(`Checking original key: ${key}`);
    console.log(`process.env[${key}]:`, process.env[key]);
    
    if (process.env[key]) {
      console.log(`Found ${key}:`, process.env[key]);
      return process.env[key] || defaultValue;
    }
    
    // Method 3: Check window object (similar to IGRP config pattern)
    if (typeof window !== 'undefined') {
      const windowKey = nextPublicKey.replace('NEXT_PUBLIC_', 'IGRP_PUBLIC_');
      console.log(`Checking window key: ${windowKey}`);
      console.log(`window[${windowKey}]:`, (window as any)[windowKey]);
      
      if ((window as any)[windowKey]) {
        console.log(`Found on window ${windowKey}:`, (window as any)[windowKey]);
        return (window as any)[windowKey] || defaultValue;
      }
    }
    
    console.log(`No environment variable found for ${key}, using default:`, defaultValue);
    return defaultValue;
  } catch (error) {
    console.warn(`Error reading environment variable ${key}:`, error);
    return defaultValue;
  }
};

// Initialize API configuration with environment variables
export const initializeApiConfig = (): void => {
  console.log('Initializing API configuration...');
  console.log('Available process.env keys:', Object.keys(process.env).filter(key => key.includes('API') || key.includes('PROCESS')));
  
  const config = {
    baseUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost:8080/activiti-api/api'),
    endpoints: {
      processes: getEnvVar('VITE_PROCESSES_ENDPOINT', 'processes'),
      processStart: getEnvVar('VITE_PROCESS_START_ENDPOINT', 'processes/start'),
      tasks: getEnvVar('VITE_TASKS_ENDPOINT', 'tasks'),
      tasksClaim: getEnvVar('VITE_TASKS_CLAIM_ENDPOINT', 'tasks/claim'),
      tasksRelease: getEnvVar('VITE_TASKS_RELEASE_ENDPOINT', 'tasks/release'),
      tasksComplete: getEnvVar('VITE_TASKS_COMPLETE_ENDPOINT', 'tasks/complete'),
      areas: getEnvVar('VITE_AREAS_ENDPOINT', 'areas'),
      areaProjects: getEnvVar('VITE_AREA_PROJECTS_ENDPOINT', 'area-projects'),
      projects: getEnvVar('VITE_PROJECTS_ENDPOINT', 'projects'),
    },
  };
  
  console.log('Final API configuration:', config);
  configureApi(config);
};