import api from "../lib/api/axios";

export interface FeedbackCreateDTO {
    type: string;
    rating: number;
    message: string;
}

const sendFeedback = async (data: FeedbackCreateDTO): Promise<any> => {
    const response = await api.post('/feedbacks', data);
    return response.data;
};

export default {
    sendFeedback
};
