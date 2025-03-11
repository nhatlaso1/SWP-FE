import { apiClient, apiEndpoints } from "./utils.api";

export interface FeedbackRequest {
    rating: number;
    comment: string;
    createdDate: string;
    status: boolean;
    productId: number;
}

export const createFeedback = async (
    feedbackData: FeedbackRequest,
    token: string
): Promise<any> => {
    try {
        const response = await apiClient.post(
            `${apiEndpoints.Feedback}/create-feedback`,
            feedbackData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error creating feedback:", error);
        throw error;
    }
};
