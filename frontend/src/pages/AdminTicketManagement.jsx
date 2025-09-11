import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getAllSupportTickets, 
  respondToSupportTicket,
  updateTicketStatus 
} from "../lib/adminApi";
import {
  TicketIcon,
  EyeIcon,
  MessageSquareIcon,
  ClockIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  SearchIcon,
  FilterIcon,
} from "lucide-react";
import toast from "react-hot-toast";

const AdminTicketManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [response, setResponse] = useState("");
  const [showResponseModal, setShowResponseModal] = useState(false);

  const queryClient = useQueryClient();

  // Fetch all support tickets
  const { data: ticketsData, isLoading } = useQuery({
    queryKey: ["adminSupportTickets", currentPage, searchTerm, statusFilter, priorityFilter],
    queryFn: () => getAllSupportTickets({
      page: currentPage,
      limit: 10,
      search: searchTerm,
      status: statusFilter,
      priority: priorityFilter,
    }),
  });

  // Respond to ticket mutation
  const { mutate: respondToTicketMutation, isPending: isResponding } = useMutation({
    mutationFn: respondToSupportTicket,
    onSuccess: () => {
      toast.success("Response sent successfully!");
      setShowResponseModal(false);
      setResponse("");
      setSelectedTicket(null);
      queryClient.invalidateQueries({ queryKey: ["adminSupportTickets"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send response");
    },
  });

  // Update ticket status mutation
  const { mutate: updateStatusMutation } = useMutation({
    mutationFn: updateTicketStatus,
    onSuccess: () => {
      toast.success("Ticket status updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["adminSupportTickets"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update status");
    },
  });

  const handleRespond = () => {
    if (!response.trim()) {
      toast.error("Please enter a response");
      return;
    }
    respondToTicketMutation({
      ticketId: selectedTicket._id,
      response: response.trim(),
    });
  };

  const handleStatusUpdate = (ticketId, newStatus) => {
    updateStatusMutation({ ticketId, status: newStatus });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "open": return "badge-error";
      case "in_progress": return "badge-warning";
      case "resolved": return "badge-success";
      case "closed": return "badge-neutral";
      default: return "badge-neutral";
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case "low": return "badge-info";
      case "medium": return "badge-warning";
      case "high": return "badge-error";
      default: return "badge-neutral";
    }
  };

  const tickets = ticketsData?.tickets || [];
  const totalPages = ticketsData?.pagination?.pages || 1;

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
            <TicketIcon className="size-8 text-primary" />
            Ticket Management
          </h1>
          <p className="text-base-content/70">Manage and respond to user support tickets</p>
        </div>

        {/* Filters */}
        <div className="card bg-base-200 shadow-xl mb-6">
          <div className="card-body p-6">
            <div className="flex flex-wrap gap-4">
              {/* Search */}
              <div className="form-control flex-1 min-w-64">
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    className="input input-bordered w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="btn btn-square btn-primary">
                    <SearchIcon className="size-5" />
                  </button>
                </div>
              </div>

              {/* Status Filter */}
              <div className="form-control">
                <select
                  className="select select-bordered"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div className="form-control">
                <select
                  className="select select-bordered"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="all">All Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tickets Table */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body p-0">
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Ticket ID</th>
                      <th>User</th>
                      <th>Subject</th>
                      <th>Category</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket) => (
                      <tr key={ticket._id}>
                        <td className="font-mono text-sm">
                          #{ticket._id.slice(-6)}
                        </td>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="mask mask-squircle size-12">
                                <img src={ticket.user?.profilePic} alt="User" />
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">{ticket.user?.fullName}</div>
                              <div className="text-sm opacity-50">{ticket.user?.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="max-w-48 truncate">{ticket.subject}</div>
                        </td>
                        <td>
                          <span className="badge badge-outline capitalize">
                            {ticket.category}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${getPriorityBadgeClass(ticket.priority)} capitalize`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td>
                          <div className="dropdown">
                            <div tabIndex={0} role="button" className={`badge ${getStatusBadgeClass(ticket.status)} capitalize cursor-pointer`}>
                              {ticket.status.replace('_', ' ')}
                            </div>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                              {["open", "in_progress", "resolved", "closed"].map((status) => (
                                <li key={status}>
                                  <a 
                                    onClick={() => handleStatusUpdate(ticket._id, status)}
                                    className={ticket.status === status ? "active" : ""}
                                  >
                                    {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </td>
                        <td>
                          <div className="text-sm">
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs opacity-50">
                            {new Date(ticket.createdAt).toLocaleTimeString()}
                          </div>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <button 
                              className="btn btn-ghost btn-sm"
                              onClick={() => {
                                setSelectedTicket(ticket);
                                setShowResponseModal(true);
                              }}
                            >
                              <MessageSquareIcon className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center p-6">
                  <div className="join">
                    <button 
                      className="join-item btn"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      «
                    </button>
                    <button className="join-item btn btn-active">
                      Page {currentPage}
                    </button>
                    <button 
                      className="join-item btn"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      »
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Response Modal */}
        {showResponseModal && selectedTicket && (
          <div className="modal modal-open">
            <div className="modal-box max-w-4xl">
              <h3 className="font-bold text-lg mb-4">
                Respond to Ticket #{selectedTicket._id.slice(-6)}
              </h3>
              
              {/* Ticket Details */}
              <div className="bg-base-200 p-4 rounded-lg mb-4">
                <h4 className="font-semibold mb-2">{selectedTicket.subject}</h4>
                <p className="text-sm mb-2">{selectedTicket.message}</p>
                <div className="flex gap-2 text-sm opacity-70">
                  <span>Category: {selectedTicket.category}</span>
                  <span>Priority: {selectedTicket.priority}</span>
                  <span>Status: {selectedTicket.status}</span>
                </div>
              </div>

              {/* Existing Response */}
              {selectedTicket.response && (
                <div className="bg-success/10 p-4 rounded-lg mb-4">
                  <h5 className="font-semibold text-success mb-2">Previous Response:</h5>
                  <p className="text-sm">{selectedTicket.response}</p>
                  {selectedTicket.respondedAt && (
                    <p className="text-xs opacity-50 mt-2">
                      Responded: {new Date(selectedTicket.respondedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              )}

              {/* Response Form */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Your Response *</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-32"
                  placeholder="Enter your response to the user..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                ></textarea>
              </div>

              <div className="modal-action">
                <button 
                  className="btn"
                  onClick={() => {
                    setShowResponseModal(false);
                    setResponse("");
                    setSelectedTicket(null);
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleRespond}
                  disabled={isResponding || !response.trim()}
                >
                  {isResponding ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Sending...
                    </>
                  ) : (
                    "Send Response"
                  )}
                </button>
              </div>
            </div>
            <div className="modal-backdrop" onClick={() => {
              setShowResponseModal(false);
              setResponse("");
              setSelectedTicket(null);
            }}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTicketManagement;
