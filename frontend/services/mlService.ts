// ML Service for backend ML model analysis
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

import { AnalysisResult } from '../types';

export const analyzeImageWithML = async (file: File): Promise<AnalysisResult> => {
    try {
        // Create form data
        const formData = new FormData();
        formData.append('image', file);

        // Send to backend ML API
        const response = await fetch(`${API_BASE_URL}/api/ml/analyze`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Analysis failed with status ${response.status}`);
        }

        const result = await response.json();

        // Ensure result matches AnalysisResult interface
        return {
            productName: result.productName || 'Cosmetic Product',
            brand: result.brand || 'ML Analysis',
            status: result.status,
            confidenceScore: result.confidenceScore,
            reasoning: result.reasoning || [],
            extractedText: result.extractedText || [],
            batchCode: result.batchCode || '',
            officialWebsite: result.officialWebsite || '',
            reportingUrl: result.reportingUrl || ''
        } as AnalysisResult;

    } catch (error: any) {
        console.error('ML Analysis Error:', error);
        throw new Error(error.message || 'Failed to analyze image. Please try again.');
    }
};

// Check if ML service is available
export const checkMLStatus = async (): Promise<boolean> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/ml/ml-status`);
        if (!response.ok) return false;

        const status = await response.json();
        return status.ready === true;
    } catch (error) {
        console.error('ML status check failed:', error);
        return false;
    }
};
