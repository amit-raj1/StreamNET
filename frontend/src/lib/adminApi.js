import { axiosInstance } from "./axios";

// Admin API functions
export const getAdminStats = async () => {
  const response = await axiosInstance.get("/admin/stats");
  return response.data;
};

export const getAllUsersAdmin = async (params) => {
  const { page = 1, limit = 10, search = "", status = "all" } = params || {};
  const response = await axiosInstance.get(
    `/admin/users?page=${page}&limit=${limit}&search=${search}&status=${status}`
  );
  return response.data;
};

export const toggleBlockUser = async ({ userId, action }) => {
  const response = await axiosInstance.put(`/admin/users/${userId}/block`, { action });
  return response.data;
};

export const updateUserRole = async ({ userId, isAdmin }) => {
  const response = await axiosInstance.put(`/admin/users/${userId}/role`, { isAdmin });
  return response.data;
};

export const deleteUserAdmin = async (userId) => {
  const response = await axiosInstance.delete(`/admin/users/${userId}`);
  return response.data;
};

// Support ticket admin functions
export const getAllSupportTickets = async (params) => {
  const { page = 1, limit = 10, search = "", status = "all", priority = "all" } = params || {};
  const response = await axiosInstance.get(
    `/support/admin/tickets?page=${page}&limit=${limit}&search=${search}&status=${status}&priority=${priority}`
  );
  return response.data;
};

export const respondToSupportTicket = async ({ ticketId, response }) => {
  const res = await axiosInstance.put(`/support/admin/tickets/${ticketId}/respond`, { response });
  return res.data;
};

export const updateTicketStatus = async ({ ticketId, status }) => {
  const response = await axiosInstance.put(`/support/admin/tickets/${ticketId}/status`, { status });
  return response.data;
};
