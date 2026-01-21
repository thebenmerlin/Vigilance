/**
 * =============================================================================
 * VIGILANCE DASHBOARD - API Client
 * =============================================================================
 * 
 * Centralized API client for all backend communication.
 * 
 * Features:
 * - Axios instance with base configuration
 * - Request/response interceptors for error handling
 * - Typed API functions for each endpoint
 * 
 * TODO: Update BASE_URL for production deployment
 * TODO: Add authentication token handling when auth is implemented
 * =============================================================================
 */

import axios from 'axios';
import type {
    Alert,
    ApiResponse,
    PaginatedResponse,
    Sensor,
    SectorPrediction,
    SystemStatus,
    Threat,
} from '@/types';

// =============================================================================
// AXIOS INSTANCE CONFIGURATION
// =============================================================================

/**
 * Base URL for API requests
 * In development: Vite proxy handles /api -> http://localhost:3001
 * In production: Update this to your deployed backend URL
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Configured Axios instance
 * All API calls should use this instance, not the default axios
 */
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10 second timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

// =============================================================================
// INTERCEPTORS
// =============================================================================

/**
 * Request interceptor
 * - Adds auth token when available
 * - Logs requests in development
 */
apiClient.interceptors.request.use(
    (config) => {
        // TODO: Add auth token when implementing authentication
        // const token = localStorage.getItem('auth_token');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }

        // Development logging
        if (import.meta.env.DEV) {
            console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor
 * - Handles common error cases
 * - Logs errors in development
 */
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Log error details in development
        if (import.meta.env.DEV) {
            console.error('[API Error]', error.response?.data || error.message);
        }

        // Handle specific error codes
        if (error.response?.status === 401) {
            // TODO: Redirect to login when auth is implemented
            console.warn('Unauthorized - authentication required');
        }

        if (error.response?.status === 503) {
            console.error('Service unavailable - backend may be down');
        }

        return Promise.reject(error);
    }
);

// =============================================================================
// API FUNCTIONS
// =============================================================================

/**
 * Health check endpoint
 * Use this to verify backend connectivity
 */
export async function checkHealth(): Promise<ApiResponse<{ status: string }>> {
    const response = await apiClient.get('/health');
    return response.data;
}

// -----------------------------------------------------------------------------
// THREATS
// -----------------------------------------------------------------------------

/**
 * Fetch current active threats
 */
export async function getThreats(): Promise<ApiResponse<Threat[]>> {
    const response = await apiClient.get('/threats');
    return response.data;
}

/**
 * Fetch a single threat by ID
 */
export async function getThreatById(id: string): Promise<ApiResponse<Threat>> {
    const response = await apiClient.get(`/threats/${id}`);
    return response.data;
}

// -----------------------------------------------------------------------------
// ALERTS
// -----------------------------------------------------------------------------

/**
 * Fetch recent alerts with optional pagination
 */
export async function getAlerts(
    page = 1,
    limit = 20
): Promise<PaginatedResponse<Alert>> {
    const response = await apiClient.get('/alerts', {
        params: { page, limit },
    });
    return response.data;
}

/**
 * Acknowledge an alert
 */
export async function acknowledgeAlert(
    alertId: string,
    userId: string
): Promise<ApiResponse<Alert>> {
    const response = await apiClient.patch(`/alerts/${alertId}/acknowledge`, {
        userId,
    });
    return response.data;
}

// -----------------------------------------------------------------------------
// SENSORS
// -----------------------------------------------------------------------------

/**
 * Fetch all sensors with their current status
 */
export async function getSensors(): Promise<ApiResponse<Sensor[]>> {
    const response = await apiClient.get('/sensors');
    return response.data;
}

/**
 * Fetch sensors by sector
 */
export async function getSensorsBySector(
    sector: string
): Promise<ApiResponse<Sensor[]>> {
    const response = await apiClient.get(`/sensors/sector/${sector}`);
    return response.data;
}

// -----------------------------------------------------------------------------
// PREDICTIONS
// -----------------------------------------------------------------------------

/**
 * Fetch threat predictions for next 24 hours
 */
export async function getPredictions(): Promise<ApiResponse<SectorPrediction[]>> {
    const response = await apiClient.get('/predictions');
    return response.data;
}

/**
 * Fetch predictions for a specific sector
 */
export async function getPredictionsBySector(
    sector: string
): Promise<ApiResponse<SectorPrediction>> {
    const response = await apiClient.get(`/predictions/sector/${sector}`);
    return response.data;
}

// -----------------------------------------------------------------------------
// SYSTEM STATUS
// -----------------------------------------------------------------------------

/**
 * Fetch overall system status
 */
export async function getSystemStatus(): Promise<ApiResponse<SystemStatus>> {
    const response = await apiClient.get('/status');
    return response.data;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Check if the backend is reachable
 * Useful for connection status indicators
 */
export async function isBackendAvailable(): Promise<boolean> {
    try {
        await checkHealth();
        return true;
    } catch {
        return false;
    }
}
