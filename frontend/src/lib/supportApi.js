import { axiosInstance } from "./axios";

// Support API functions
export const submitSupportTicket = async (ticketData) => {
  const response = await axiosInstance.post("/support/tickets", ticketData);
  return response.data;
};

export const getSupportTickets = async () => {
  const response = await axiosInstance.get("/support/tickets");
  return response.data;
};
