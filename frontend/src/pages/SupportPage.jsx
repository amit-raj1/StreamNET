import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { submitSupportTicket, getSupportTickets } from "../lib/supportApi";
import {
  HelpCircleIcon,
  MessageSquareIcon,
  BugIcon,
  LightbulbIcon,
  ShieldIcon,
  BookOpenIcon,
  SendIcon,
  CheckCircleIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  ClockIcon,
  HeadphonesIcon,
  AlertTriangleIcon,
  TicketIcon,
  EyeIcon,
} from "lucide-react";
import toast from "react-hot-toast";

const SupportPage = () => {
  const [supportForm, setSupportForm] = useState({
    category: "",
    subject: "",
    message: "",
    priority: "medium",
  });
  const [submitted, setSubmitted] = useState(false);
  const [showTickets, setShowTickets] = useState(false);

  // Fetch user's tickets
  const { data: userTickets = { tickets: [] }, isLoading: ticketsLoading } = useQuery({
    queryKey: ["supportTickets"],
    queryFn: getSupportTickets,
    enabled: showTickets,
  });

  const { mutate: submitTicketMutation, isPending } = useMutation({
    mutationFn: submitSupportTicket,
    onSuccess: () => {
      setSubmitted(true);
      setSupportForm({
        category: "",
        subject: "",
        message: "",
        priority: "medium",
      });
      toast.success("Support ticket submitted successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to submit ticket. Please try again.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!supportForm.category || !supportForm.subject || !supportForm.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    submitTicketMutation(supportForm);
  };

  const categories = [
    { value: "technical", label: "Technical Issue", icon: BugIcon },
    { value: "account", label: "Account Problem", icon: UserIcon },
    { value: "feature", label: "Feature Request", icon: LightbulbIcon },
    { value: "security", label: "Security Concern", icon: ShieldIcon },
    { value: "general", label: "General Inquiry", icon: MessageSquareIcon },
  ];

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "Click on 'Forgot Password' on the login page and follow the instructions sent to your email.",
    },
    {
      question: "How can I block another user?",
      answer: "Currently, only administrators can block users. Please report problematic users through our support system.",
    },
    {
      question: "How do I change my learning language?",
      answer: "Go to your Profile page and update your learning language in the language preferences section.",
    },
    {
      question: "Can I delete my account?",
      answer: "Yes, you can request account deletion by contacting our support team. This action is permanent.",
    },
    {
      question: "How does friend matching work?",
      answer: "Our system matches users based on complementary languages - your learning language with others' native language.",
    },
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-base-100 p-6 flex items-center justify-center">
        <div className="card bg-base-200 w-full max-w-md shadow-xl">
          <div className="card-body text-center">
            <CheckCircleIcon className="size-16 text-success mx-auto mb-4" />
            <h2 className="card-title justify-center text-2xl mb-2">Ticket Submitted!</h2>
            <p className="opacity-70 mb-4">
              We've received your support request and will get back to you within 24 hours.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => {
                setSubmitted(false);
                setShowTickets(false);
              }}
            >
              Submit Another Ticket
            </button>
            <button
              className="btn btn-outline"
              onClick={() => setShowTickets(true)}
            >
              <TicketIcon className="size-4 mr-2" />
              View My Tickets
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
            <HeadphonesIcon className="size-10 text-primary" />
            Support Center
          </h1>
          <p className="text-lg opacity-70 max-w-2xl mx-auto">
            Need help? We're here for you! Browse our FAQ or submit a support ticket.
          </p>
          
          {/* Toggle Buttons */}
          <div className="flex justify-center gap-2 mt-6">
            <button
              className={`btn ${!showTickets ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setShowTickets(false)}
            >
              <MessageSquareIcon className="size-4 mr-2" />
              Submit New Ticket
            </button>
            <button
              className={`btn ${showTickets ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setShowTickets(true)}
            >
              <TicketIcon className="size-4 mr-2" />
              View My Tickets
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Support Form or Tickets View */}
          {!showTickets ? (
          <div className="card bg-base-200 shadow-xl">
            <div className="card-header p-6 border-b border-base-300">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <MessageSquareIcon className="size-6" />
                Submit a Ticket
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="card-body p-6 space-y-4">
              {/* Category */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Category *</span>
                </label>
                <select
                  className="select select-bordered"
                  value={supportForm.category}
                  onChange={(e) => setSupportForm({ ...supportForm, category: e.target.value })}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Priority</span>
                </label>
                <div className="flex gap-2">
                  {["low", "medium", "high"].map((priority) => (
                    <label key={priority} className="label cursor-pointer">
                      <input
                        type="radio"
                        name="priority"
                        className="radio radio-primary"
                        value={priority}
                        checked={supportForm.priority === priority}
                        onChange={(e) => setSupportForm({ ...supportForm, priority: e.target.value })}
                      />
                      <span className="label-text ml-2 capitalize">{priority}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Subject *</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  placeholder="Brief description of your issue"
                  value={supportForm.subject}
                  onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
                  required
                />
              </div>

              {/* Message */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Message *</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-32"
                  placeholder="Please provide detailed information about your issue"
                  value={supportForm.message}
                  onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <SendIcon className="size-4 mr-2" />
                    Submit Ticket
                  </>
                )}
              </button>
            </form>
          </div>
          ) : (
            /* Tickets View */
            <div className="card bg-base-200 shadow-xl">
              <div className="card-header p-6 border-b border-base-300">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <TicketIcon className="size-6" />
                    My Support Tickets
                  </h2>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setShowTickets(false)}
                  >
                    Create New Ticket
                  </button>
                </div>
              </div>
              <div className="card-body p-6">
                {ticketsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="skeleton h-20 w-full"></div>
                    ))}
                  </div>
                ) : userTickets?.tickets?.length === 0 ? (
                  <div className="text-center py-8">
                    <TicketIcon className="size-16 text-base-content opacity-40 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No tickets yet</h3>
                    <p className="opacity-70">Submit your first support ticket to get help.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userTickets?.tickets?.map((ticket) => (
                      <div key={ticket._id} className="card bg-base-100 shadow-sm border border-base-300">
                        <div className="card-body p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-lg">{ticket.subject}</h3>
                                <span className="font-mono text-xs bg-base-300 px-2 py-1 rounded">
                                  #{ticket._id.slice(-6)}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2 text-sm mb-2">
                                <span className="badge badge-outline capitalize">{ticket.category}</span>
                                <span className={`badge ${
                                  ticket.priority === 'low' ? 'badge-info' :
                                  ticket.priority === 'medium' ? 'badge-warning' : 'badge-error'
                                } capitalize`}>
                                  {ticket.priority} Priority
                                </span>
                              </div>
                              <p className="text-xs opacity-50">
                                Created: {new Date(ticket.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span className={`badge badge-lg ${
                                ticket.status === 'open' ? 'badge-error' :
                                ticket.status === 'in_progress' ? 'badge-warning' :
                                ticket.status === 'resolved' ? 'badge-success' : 'badge-neutral'
                              }`}>
                                <ClockIcon className="size-3 mr-1" />
                                {ticket.status.replace('_', ' ').toUpperCase()}
                              </span>
                            </div>
                          </div>
                          
                          {/* Ticket Message */}
                          <div className="bg-base-200 p-3 rounded-lg mb-3">
                            <p className="text-sm font-semibold mb-1">Your Message:</p>
                            <p className="text-sm whitespace-pre-wrap">{ticket.message}</p>
                          </div>

                          {/* Admin Response */}
                          {ticket.response && (
                            <div className="bg-success/10 border border-success/20 p-3 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <CheckCircleIcon className="size-4 text-success" />
                                <p className="text-sm font-semibold text-success">Admin Response:</p>
                              </div>
                              <p className="text-sm mb-2 whitespace-pre-wrap">{ticket.response}</p>
                              <div className="flex items-center justify-between text-xs opacity-70">
                                <span>Responded by: {ticket.respondedBy?.fullName || 'Support Team'}</span>
                                {ticket.respondedAt && (
                                  <span>
                                    {new Date(ticket.respondedAt).toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Status Timeline */}
                          <div className="mt-3 pt-3 border-t border-base-300">
                            <div className="flex items-center gap-4 text-xs">
                              <div className={`flex items-center gap-1 ${ticket.status !== 'open' ? 'opacity-50' : 'text-error'}`}>
                                <div className={`w-2 h-2 rounded-full ${ticket.status === 'open' ? 'bg-error' : 'bg-base-300'}`}></div>
                                <span>Open</span>
                              </div>
                              <div className={`flex items-center gap-1 ${ticket.status !== 'in_progress' ? 'opacity-50' : 'text-warning'}`}>
                                <div className={`w-2 h-2 rounded-full ${ticket.status === 'in_progress' ? 'bg-warning' : 'bg-base-300'}`}></div>
                                <span>In Progress</span>
                              </div>
                              <div className={`flex items-center gap-1 ${ticket.status !== 'resolved' && ticket.status !== 'closed' ? 'opacity-50' : 'text-success'}`}>
                                <div className={`w-2 h-2 rounded-full ${ticket.status === 'resolved' || ticket.status === 'closed' ? 'bg-success' : 'bg-base-300'}`}></div>
                                <span>Resolved</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* FAQ Section */}
          <div className="space-y-6">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-header p-6 border-b border-base-300">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <HelpCircleIcon className="size-6" />
                  Frequently Asked Questions
                </h2>
              </div>
              <div className="card-body p-6">
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <details key={index} className="collapse collapse-arrow bg-base-100">
                      <summary className="collapse-title text-lg font-medium">
                        {faq.question}
                      </summary>
                      <div className="collapse-content">
                        <p className="opacity-70">{faq.answer}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-header p-6 border-b border-base-300">
                <h2 className="text-xl font-semibold">Other Ways to Reach Us</h2>
              </div>
              <div className="card-body p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MailIcon className="size-5 text-primary" />
                    <div>
                      <p className="font-semibold">Email Support</p>
                      <p className="text-sm opacity-70">support@streamnet.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ClockIcon className="size-5 text-primary" />
                    <div>
                      <p className="font-semibold">Response Time</p>
                      <p className="text-sm opacity-70">Within 24 hours</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <AlertTriangleIcon className="size-5 text-warning" />
                    <div>
                      <p className="font-semibold">Emergency Issues</p>
                      <p className="text-sm opacity-70">For urgent security concerns</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
