import axiosInstance from './axiosInstance';

export interface PageContentResponse {
  data: {
    content: string;
    title?: string;
    lastUpdated?: string;
  };
  success: boolean;
  message: string;
}

/**
 * Fetches page content from the API
 * @param pageType The type of page content to fetch (e.g., 'privacy-policy', 'terms')
 * @returns Promise with the page content response
 */
export const fetchPageContent = async (pageType: string): Promise<PageContentResponse> => {
  try {
    const response = await axiosInstance.get<PageContentResponse>(`/api/1.0/page-content/${pageType}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${pageType} content:`, error);
    throw error;
  }
};
