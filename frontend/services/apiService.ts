// API Service for backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface ApiResponse<T> {
    data?: T;
    error?: string;
    message?: string;
}

// Save scan to database
export const saveScanToDatabase = async (scanData: any): Promise<ApiResponse<any>> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/scans`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(scanData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to save scan');
        }

        return { data: data.data, message: data.message };
    } catch (error: any) {
        console.error('Error saving scan to database:', error);
        return { error: error.message || 'Failed to save scan' };
    }
};

// Fetch all scans from database
export const fetchScansFromDatabase = async (): Promise<ApiResponse<any[]>> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/scans`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch scans');
        }

        return { data: data.data };
    } catch (error: any) {
        console.error('Error fetching scans from database:', error);
        return { error: error.message || 'Failed to fetch scans' };
    }
};

// Delete scan by ID
export const deleteScanFromDatabase = async (id: string): Promise<ApiResponse<any>> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/scans/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to delete scan');
        }

        return { data, message: data.message };
    } catch (error: any) {
        console.error('Error deleting scan from database:', error);
        return { error: error.message || 'Failed to delete scan' };
    }
};

// Health check
export const checkApiHealth = async (): Promise<boolean> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/health`);
        return response.ok;
    } catch (error) {
        console.error('API health check failed:', error);
        return false;
    }
};

// Fetch scan statistics
export const fetchScanStatistics = async (): Promise<ApiResponse<{
    totalScans: number;
    fakeScans: number;
    authenticScans: number;
    fakePercentage: string;
}>> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/scans/stats/summary`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch statistics');
        }

        return { data };
    } catch (error: any) {
        console.error('Error fetching statistics:', error);
        return { error: error.message || 'Failed to fetch statistics' };
    }
};

