import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001';

// Export report as DOCX
export const exportReportToDocx = async (companyId = null) => {
    try {
        const response = await axios.post(
            `${API_URL}/api/reports/export-docx`,
            { companyId },
            {
                withCredentials: true,
                responseType: 'blob'
            }
        );

        // Check if response is actually a valid blob (DOCX file)
        if (!response.data || response.data.size === 0) {
            throw new Error('Empty response from server');
        }

        // Verify content type is correct
        const contentType = response.headers['content-type'] || '';
        if (!contentType.includes('officedocument') && !contentType.includes('document')) {
            // If not a DOCX, try to read as text to get error message
            const text = await response.data.text();
            if (text) {
                try {
                    const errorData = JSON.parse(text);
                    throw new Error(errorData.message || 'Failed to generate report');
                } catch {
                    throw new Error('Server error: ' + text.substring(0, 100));
                }
            }
        }

        // Create a blob URL and trigger download
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `hiring_report_${Date.now()}.docx`);
        document.body.appendChild(link);
        link.click();
        link.parentElement.removeChild(link);
        window.URL.revokeObjectURL(url);

        return {
            success: true,
            message: 'Report exported successfully'
        };
    } catch (error) {
        console.error('Error exporting report:', error);
        let errorMsg = 'Failed to export report';
        
        if (error.response) {
            if (error.response.status === 401) {
                errorMsg = 'You are not authorized';
            } else if (error.response.status === 500) {
                errorMsg = 'Server error generating report';
            } else if (error.response.data) {
                try {
                    const errorData = error.response.data;
                    if (typeof errorData === 'string') {
                        errorMsg = errorData;
                    } else if (errorData.message) {
                        errorMsg = errorData.message;
                    }
                } catch (e) {
                    // Continue with default error message
                }
            }
        } else if (error.message) {
            errorMsg = error.message;
        }
        
        return {
            success: false,
            message: errorMsg
        };
    }
};

// Fetch report data for preview
export const fetchReportData = async (companyId = null) => {
    try {
        const params = companyId ? `?companyId=${companyId}` : '';
        const response = await axios.get(
            `${API_URL}/api/reports/data${params}`,
            { withCredentials: true }
        );

        return response.data;
    } catch (error) {
        console.error('Error fetching report data:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch report data'
        };
    }
};
