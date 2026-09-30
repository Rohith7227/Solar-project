"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type LeadStatus = "new" | "contacted" | "converted";
type StatusFilter = "all" | LeadStatus;

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  customer_type: string | null;
  monthly_bill: number | null;
  location: string | null;
  message: string | null;
  source: string | null;
  status: LeadStatus | null;
  follow_up_note: string | null;
  next_follow_up: string | null;
  created_at: string;
  assigned_staff_id: number | null;
};

type Customer = {
  id: number;
  lead_id: string;
  name: string;
  phone: string;
  email: string | null;
  customer_type: string | null;
  monthly_bill: number | null;
  location: string | null;
  message: string | null;
  source: string | null;
  assigned_staff_id: number | null;
  converted_at: string;
  created_at: string;
};

type Staff = {
  id: number;
  name: string;
  phone: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  user_id: string | null;
};

type CustomerProject = {
  id: number;
  customer_id: number;
  project_name: string;
  system_capacity: number | null;
  project_status: string;
  installation_address: string | null;
  estimated_cost: number | null;
  final_cost: number | null;
  total_cost: number | null;
  installation_date: string | null;
  completion_date: string | null;
  payment_status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};


type ProjectPayment = {
  id: number;
  project_id: number;
  amount: number;
  payment_date: string;
  payment_method: string;
  reference: string | null;
  notes: string | null;
  created_at: string;
};


type ProjectTimelineEvent = {
  id: number;
  project_id: number;
  stage: string;
  stage_date: string;
  notes: string | null;
  created_at: string;
};

const PROJECT_TIMELINE_STAGES = [
  "New",
  "Site Survey",
  "Quotation",
  "Advance Received",
  "Material Ordered",
  "Installation Scheduled",
  "Installation",
  "Inspection",
  "Completed",
];

type Section =
  | "overview"
  | "leads"
  | "staff"
  | "followups"
  | "customers"
  | "projects";

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createClient();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [assignmentStaff, setAssignmentStaff] = useState<
    { id: number; name: string }[]
  >([]);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [projects, setProjects] = useState<CustomerProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<CustomerProject | null>(null);
  const [payments, setPayments] = useState<ProjectPayment[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<ProjectTimelineEvent[]>([]);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [timelineProjectId, setTimelineProjectId] = useState<number | null>(null);
  const [timelineForm, setTimelineForm] = useState({ stage: "New", stage_date: new Date().toISOString().slice(0, 10), notes: "" });
  const [savingTimeline, setSavingTimeline] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);
  const [editingPaymentId, setEditingPaymentId] = useState<number | null>(null);
  const [paymentProjectId, setPaymentProjectId] = useState<number | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    payment_date: new Date().toISOString().slice(0, 10),
    payment_method: "Bank Transfer",
    reference: "",
    notes: "",
  });

  const [convertingLeadId, setConvertingLeadId] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [activeSection, setActiveSection] =
    useState<Section>("overview");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const [customerSearchTerm, setCustomerSearchTerm] =
    useState("");

  type CustomerSortKey =
    | "name"
    | "phone"
    | "customer_type"
    | "location"
    | "monthly_bill"
    | "converted_at";

  const [customerSortKey, setCustomerSortKey] =
    useState<CustomerSortKey>("converted_at");

  const [customerSortDirection, setCustomerSortDirection] =
    useState<"asc" | "desc">("desc");

  const [assignmentFilter, setAssignmentFilter] =
    useState<string>("all");

  const [selectedLead, setSelectedLead] =
    useState<Lead | null>(null);

  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const [projectSearchTerm, setProjectSearchTerm] = useState("");
  const [projectStatusFilter, setProjectStatusFilter] = useState("all");
  const [projectSortKey, setProjectSortKey] =
    useState<"project_name" | "project_status" | "system_capacity" | "payment_status" | "created_at">("created_at");
  const [projectSortDirection, setProjectSortDirection] =
    useState<"asc" | "desc">("desc");

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [savingProject, setSavingProject] = useState(false);
  const [editProjectId, setEditProjectId] = useState<number | null>(null);
  const [projectCustomerId, setProjectCustomerId] = useState<number | null>(null);
  const [projectForm, setProjectForm] = useState({
    project_name: "",
    system_capacity: "",
    project_status: "new",
    installation_address: "",
    estimated_cost: "",
    final_cost: "",
    total_cost: "",
    installation_date: "",
    completion_date: "",
    payment_status: "pending",
    notes: "",
  });

  const [updatingLeadId, setUpdatingLeadId] =
    useState<string | null>(null);

  const [updatingStaffId, setUpdatingStaffId] =
    useState<number | null>(null);

  const [showInviteModal, setShowInviteModal] =
    useState(false);

  const [inviteName, setInviteName] = useState("");
  const [invitePhone, setInvitePhone] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");

  const [invitingStaff, setInvitingStaff] =
    useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    setError("");

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      router.push("/admin/login");
      return;
    }

    const [
      { data: leadData, error: leadError },
      { data: staffData, error: staffError },
      { data: customerData, error: customerError },
      { data: projectData, error: projectError },
      { data: paymentData, error: paymentError },
      { data: timelineData, error: timelineError },
    ] = await Promise.all([
      supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("staff")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("customer_projects")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("project_payments")
        .select("*")
        .order("payment_date", { ascending: false })
        .order("created_at", { ascending: false }),
      supabase
        .from("project_timeline")
        .select("*")
        .order("stage_date", { ascending: true })
        .order("created_at", { ascending: true }),
    ]);

    const {
      data: assignmentStaffData,
      error: assignmentStaffError,
    } = await supabase.rpc(
      "get_active_staff_for_assignment"
    );

    if (assignmentStaffError) {
      setError(
        `Unable to load assignment staff: ${assignmentStaffError.message}`
      );
      setLoading(false);
      return;
    }

    setAssignmentStaff(
      (assignmentStaffData || []) as {
        id: number;
        name: string;
      }[]
    );

    if (leadError) {
      setError(
        `Unable to load leads: ${leadError.message}`
      );
      setLoading(false);
      return;
    }

    if (staffError) {
      setError(
        `Unable to load staff: ${staffError.message}`
      );
      setLoading(false);
      return;
    }

    if (customerError) {
      setError(
        `Unable to load customers: ${customerError.message}`
      );
      setLoading(false);
      return;
    }

    if (projectError) {
      setError(
        `Unable to load customer projects: ${projectError.message}`
      );
      setLoading(false);
      return;
    }

    if (paymentError) {
      setError(
        `Unable to load project payments: ${paymentError.message}`
      );
      setLoading(false);
      return;
    }

    if (timelineError) {
      setError(`Unable to load project timeline: ${timelineError.message}`);
      setLoading(false);
      return;
    }

    setLeads((leadData || []) as Lead[]);
    setStaff((staffData || []) as Staff[]);
    setCustomers((customerData || []) as Customer[]);
    setProjects((projectData || []) as CustomerProject[]);
    setPayments((paymentData || []) as ProjectPayment[]);
    setTimelineEvents((timelineData || []) as ProjectTimelineEvent[]);
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();

    router.push("/admin/login");
    router.refresh();
  }

  async function assignLead(leadId: string, staffId: number | null) {
    setUpdatingLeadId(leadId);
    setError("");
    setSuccess("");

    const { error } = await supabase
      .from("leads")
      .update({
        assigned_staff_id: staffId,
      })
      .eq("id", leadId);

    if (error) {
      setError(`Unable to assign lead: ${error.message}`);
      setUpdatingLeadId(null);
      return;
    }

    setLeads((current) =>
      current.map((lead) =>
        lead.id === leadId
          ? { ...lead, assigned_staff_id: staffId }
          : lead
      )
    );

    setSelectedLead((current) =>
      current && current.id === leadId
        ? { ...current, assigned_staff_id: staffId }
        : current
    );

    const assignedMember = staff.find((member) => member.id === staffId);
    setSuccess(
      assignedMember
        ? `Lead assigned to ${assignedMember.name}.`
        : "Lead unassigned successfully."
    );
    setUpdatingLeadId(null);

    setTimeout(() => setSuccess(""), 2500);
  }

  async function convertLeadToCustomer(lead: Lead) {
    if (lead.status === "converted") {
      const existing = customers.find((customer) => customer.lead_id === lead.id);
      if (existing) {
        setSuccess(`${lead.name} is already a customer.`);
        setSelectedLead(null);
        setTimeout(() => setSuccess(""), 2500);
        return;
      }
    }

    setConvertingLeadId(lead.id);
    setError("");
    setSuccess("");

    const { data, error } = await supabase.rpc(
      "convert_lead_to_customer",
      { p_lead_id: lead.id }
    );

    if (error) {
      setError(`Unable to convert lead: ${error.message}`);
      setConvertingLeadId(null);
      return;
    }

    const customer = Array.isArray(data) ? (data[0] as Customer | undefined) : (data as Customer | null);

    if (!customer) {
      setError("Lead was converted, but the customer record could not be returned.");
      setConvertingLeadId(null);
      return;
    }

    setCustomers((current) => {
      const exists = current.some((item) => item.id === customer.id);
      return exists
        ? current.map((item) => item.id === customer.id ? customer : item)
        : [customer, ...current];
    });

    setLeads((current) =>
      current.map((item) =>
        item.id === lead.id ? { ...item, status: "converted" } : item
      )
    );

    setSelectedLead((current) =>
      current && current.id === lead.id
        ? { ...current, status: "converted" }
        : current
    );

    setSuccess(`${lead.name} converted to a customer successfully.`);
    setConvertingLeadId(null);

    setTimeout(() => setSuccess(""), 3000);
  }

  async function updateLeadStatus(
    leadId: string,
    newStatus: LeadStatus
  ) {
    setUpdatingLeadId(leadId);
    setError("");
    setSuccess("");

    const { error } = await supabase
      .from("leads")
      .update({
        status: newStatus,
      })
      .eq("id", leadId);

    if (error) {
      setError(
        `Unable to update lead: ${error.message}`
      );
      setUpdatingLeadId(null);
      return;
    }

    setLeads((current) =>
      current.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              status: newStatus,
            }
          : lead
      )
    );

    setSuccess("Lead status updated successfully.");
    setUpdatingLeadId(null);

    setTimeout(() => {
      setSuccess("");
    }, 2500);
  }

  async function updateFollowUp(
    leadId: string,
    note: string,
    date: string
  ) {
    setUpdatingLeadId(leadId);
    setError("");
    setSuccess("");

    const { error } = await supabase
      .from("leads")
      .update({
        follow_up_note: note.trim() || null,
        next_follow_up: date || null,
      })
      .eq("id", leadId);

    if (error) {
      setError(
        `Unable to save follow-up: ${error.message}`
      );
      setUpdatingLeadId(null);
      return;
    }

    setLeads((current) =>
      current.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              follow_up_note: note.trim() || null,
              next_follow_up: date || null,
            }
          : lead
      )
    );

    setSuccess("Follow-up information saved.");
    setUpdatingLeadId(null);

    setTimeout(() => {
      setSuccess("");
    }, 2500);
  }

  async function toggleStaffStatus(
    staffMember: Staff
  ) {
    const newStatus =
      staffMember.status === "active"
        ? "inactive"
        : "active";

    setUpdatingStaffId(staffMember.id);
    setError("");
    setSuccess("");

    const { error } = await supabase
      .from("staff")
      .update({
        status: newStatus,
      })
      .eq("id", staffMember.id);

    if (error) {
      setError(
        `Unable to update staff status: ${error.message}`
      );
      setUpdatingStaffId(null);
      return;
    }

    setStaff((current) =>
      current.map((member) =>
        member.id === staffMember.id
          ? {
              ...member,
              status: newStatus,
            }
          : member
      )
    );

    setSuccess(
      `${staffMember.name} is now ${newStatus}.`
    );

    setUpdatingStaffId(null);

    setTimeout(() => {
      setSuccess("");
    }, 2500);
  }

  async function inviteStaff() {
    if (!inviteName.trim()) {
      setError("Please enter the staff name.");
      return;
    }

    if (!invitePhone.trim()) {
      setError("Please enter the staff phone number.");
      return;
    }

    if (!inviteEmail.trim()) {
      setError("Please enter the staff email.");
      return;
    }

    setInvitingStaff(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "/api/admin/staff/invite",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: inviteName.trim(),
            phone: invitePhone.trim(),
            email: inviteEmail.trim(),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to invite staff."
        );
      }

      setShowInviteModal(false);

      setInviteName("");
      setInvitePhone("");
      setInviteEmail("");

      setSuccess(
        "Staff invitation sent successfully."
      );

      await loadDashboard();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to invite staff."
      );
    } finally {
      setInvitingStaff(false);
    }
  }

  function openNewProjectModalForCustomer(customerId: number) {
    openNewProjectModal(customerId);
  }

  function openNewProjectModal(customerId?: number) {
    setEditProjectId(null);
    setProjectCustomerId(customerId ?? (customers[0]?.id ?? null));
    setProjectForm({
      project_name: "",
      system_capacity: "",
      project_status: "new",
      installation_address: "",
      estimated_cost: "",
      final_cost: "",
      installation_date: "",
      completion_date: "",
      payment_status: "pending",
      notes: "",
    });
    setShowProjectModal(true);
  }

  function openEditProjectModal(project: CustomerProject) {
    setEditProjectId(project.id);
    setProjectCustomerId(project.customer_id);
    setProjectForm({
      project_name: project.project_name || "",
      system_capacity: project.system_capacity !== null ? String(project.system_capacity) : "",
      project_status: project.project_status || "new",
      installation_address: project.installation_address || "",
      estimated_cost: project.estimated_cost !== null ? String(project.estimated_cost) : "",
      final_cost: project.final_cost !== null ? String(project.final_cost) : "",
      total_cost: project.total_cost !== null ? String(project.total_cost) : (project.final_cost !== null ? String(project.final_cost) : (project.estimated_cost !== null ? String(project.estimated_cost) : "")),
      installation_date: project.installation_date || "",
      completion_date: project.completion_date || "",
      payment_status: project.payment_status || "pending",
      notes: project.notes || "",
    });
    setError("");
    setSuccess("");
    setShowProjectModal(true);
  }

  async function updateProject() {
    if (!editProjectId) return;

    if (!projectCustomerId) {
      setError("Please select a customer.");
      return;
    }

    if (!projectForm.project_name.trim()) {
      setError("Please enter a project name.");
      return;
    }

    setSavingProject(true);
    setError("");
    setSuccess("");

    const { data, error } = await supabase
      .from("customer_projects")
      .update({
        customer_id: projectCustomerId,
        project_name: projectForm.project_name.trim(),
        system_capacity: projectForm.system_capacity ? Number(projectForm.system_capacity) : null,
        project_status: projectForm.project_status,
        installation_address: projectForm.installation_address.trim() || null,
        estimated_cost: projectForm.estimated_cost ? Number(projectForm.estimated_cost) : null,
        final_cost: projectForm.final_cost ? Number(projectForm.final_cost) : null,
        total_cost: projectForm.total_cost ? Number(projectForm.total_cost) : null,
        installation_date: projectForm.installation_date || null,
        completion_date: projectForm.completion_date || null,
        payment_status: projectForm.payment_status,
        notes: projectForm.notes.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", editProjectId)
      .select("*")
      .single();

    if (error) {
      setError(`Unable to update project: ${error.message}`);
      setSavingProject(false);
      return;
    }

    setProjects((current) =>
      current.map((project) =>
        project.id === editProjectId ? (data as CustomerProject) : project
      )
    );
    setShowProjectModal(false);
    setEditProjectId(null);
    setSavingProject(false);
    setSuccess("Customer project updated successfully.");
    setTimeout(() => setSuccess(""), 3000);
  }

  async function deleteProject(project: CustomerProject) {
    const confirmed = window.confirm(
      `Delete project "${project.project_name}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    setError("");
    setSuccess("");

    const { error } = await supabase
      .from("customer_projects")
      .delete()
      .eq("id", project.id);

    if (error) {
      setError(`Unable to delete project: ${error.message}`);
      return;
    }

    setProjects((current) => current.filter((item) => item.id !== project.id));
    setSuccess("Customer project deleted successfully.");
    setTimeout(() => setSuccess(""), 3000);
  }

  async function createProject() {
    if (!projectCustomerId) {
      setError("Please select a customer.");
      return;
    }

    if (!projectForm.project_name.trim()) {
      setError("Please enter a project name.");
      return;
    }

    setSavingProject(true);
    setError("");
    setSuccess("");

    const { data, error } = await supabase
      .from("customer_projects")
      .insert({
        customer_id: projectCustomerId,
        project_name: projectForm.project_name.trim(),
        system_capacity: projectForm.system_capacity
          ? Number(projectForm.system_capacity)
          : null,
        project_status: projectForm.project_status,
        installation_address:
          projectForm.installation_address.trim() || null,
        estimated_cost: projectForm.estimated_cost
          ? Number(projectForm.estimated_cost)
          : null,
        final_cost: projectForm.final_cost
          ? Number(projectForm.final_cost)
          : null,
        total_cost: projectForm.total_cost
          ? Number(projectForm.total_cost)
          : null,
        installation_date:
          projectForm.installation_date || null,
        completion_date:
          projectForm.completion_date || null,
        payment_status: projectForm.payment_status,
        notes: projectForm.notes.trim() || null,
      })
      .select("*")
      .single();

    if (error) {
      setError(`Unable to create project: ${error.message}`);
      setSavingProject(false);
      return;
    }

    setProjects((current) => [data as CustomerProject, ...current]);
    setShowProjectModal(false);
    setSavingProject(false);
    setSuccess("Customer project created successfully.");

    setTimeout(() => setSuccess(""), 3000);
  }

  function openTimelineModal(project: CustomerProject) {
    const events = timelineEvents.filter((item) => item.project_id === project.id);
    const latest = events[events.length - 1];
    setTimelineProjectId(project.id);
    setTimelineForm({
      stage: latest?.stage || "New",
      stage_date: new Date().toISOString().slice(0, 10),
      notes: "",
    });
    setError("");
    setSuccess("");
    setShowTimelineModal(true);
  }

  async function saveTimelineStage() {
    if (!timelineProjectId) return;
    setSavingTimeline(true);
    setError("");
    setSuccess("");

    const { data, error } = await supabase
      .from("project_timeline")
      .insert({
        project_id: timelineProjectId,
        stage: timelineForm.stage,
        stage_date: timelineForm.stage_date,
        notes: timelineForm.notes.trim() || null,
      })
      .select("*")
      .single();

    if (error) {
      setError(`Unable to save project stage: ${error.message}`);
      setSavingTimeline(false);
      return;
    }

    const nextEvents = [...timelineEvents, data as ProjectTimelineEvent].sort((a, b) =>
      new Date(a.stage_date).getTime() - new Date(b.stage_date).getTime()
    );
    setTimelineEvents(nextEvents);
    setShowTimelineModal(false);
    setSavingTimeline(false);
    setSuccess("Project timeline updated successfully.");
    setTimeout(() => setSuccess(""), 3000);
  }

  function openProjectDetails(project: CustomerProject) {
    setSelectedProject(project);
  }

  function openAddPaymentModal(project: CustomerProject) {
    setEditingPaymentId(null);
    setPaymentProjectId(project.id);
    setPaymentForm({
      amount: "",
      payment_date: new Date().toISOString().slice(0, 10),
      payment_method: "Bank Transfer",
      reference: "",
      notes: "",
    });
    setError("");
    setSuccess("");
    setShowPaymentModal(true);
  }

  function openEditPaymentModal(payment: ProjectPayment) {
    setEditingPaymentId(payment.id);
    setPaymentProjectId(payment.project_id);
    setPaymentForm({
      amount: String(payment.amount),
      payment_date: payment.payment_date || new Date().toISOString().slice(0, 10),
      payment_method: payment.payment_method || "Bank Transfer",
      reference: payment.reference || "",
      notes: payment.notes || "",
    });
    setError("");
    setSuccess("");
    setShowPaymentModal(true);
  }

  async function refreshProjectPaymentStatus(projectId: number, nextPayments: ProjectPayment[]) {
    const project = projects.find((item) => item.id === projectId);
    if (!project) return;

    const totalCost = project.total_cost ?? project.final_cost ?? project.estimated_cost;
    if (totalCost === null || totalCost === undefined) return;

    const amountPaid = nextPayments
      .filter((payment) => payment.project_id === projectId)
      .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

    const paymentStatus =
      amountPaid <= 0 ? "pending" : amountPaid >= Number(totalCost) ? "paid" : "partial";

    const { error } = await supabase
      .from("customer_projects")
      .update({
        payment_status: paymentStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId);

    if (!error) {
      setProjects((current) =>
        current.map((item) =>
          item.id === projectId
            ? { ...item, payment_status: paymentStatus }
            : item
        )
      );
    }
  }

  async function saveProjectPayment() {
    if (!paymentProjectId) return;

    const amount = Number(paymentForm.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Please enter a valid payment amount greater than 0.");
      return;
    }

    const project = projects.find((item) => item.id === paymentProjectId);
    if (!project) {
      setError("Project not found.");
      return;
    }

    const totalCost = project.total_cost ?? project.final_cost ?? project.estimated_cost;
    const existingPayments = payments.filter((payment) => payment.project_id === paymentProjectId);
    const otherPaymentsTotal = existingPayments
      .filter((payment) => payment.id !== editingPaymentId)
      .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

    if (totalCost !== null && totalCost !== undefined) {
      const remainingBalance = Number(totalCost) - otherPaymentsTotal;
      if (amount > remainingBalance) {
        setError(
          `Payment cannot exceed the remaining balance of ${formatProjectCurrency(Math.max(remainingBalance, 0))}.`
        );
        return;
      }
    }

    setSavingPayment(true);
    setError("");
    setSuccess("");

    if (editingPaymentId) {
      const { data, error } = await supabase
        .from("project_payments")
        .update({
          amount,
          payment_date: paymentForm.payment_date,
          payment_method: paymentForm.payment_method,
          reference: paymentForm.reference.trim() || null,
          notes: paymentForm.notes.trim() || null,
        })
        .eq("id", editingPaymentId)
        .select("*")
        .single();

      if (error) {
        setError(`Unable to update payment: ${error.message}`);
        setSavingPayment(false);
        return;
      }

      const nextPayments = payments.map((payment) =>
        payment.id === editingPaymentId ? (data as ProjectPayment) : payment
      );
      setPayments(nextPayments);
      await refreshProjectPaymentStatus(paymentProjectId, nextPayments);
      setSavingPayment(false);
      setShowPaymentModal(false);
      setEditingPaymentId(null);
      setSuccess("Payment updated successfully.");
      setTimeout(() => setSuccess(""), 3000);
      return;
    }

    const { data, error } = await supabase
      .from("project_payments")
      .insert({
        project_id: paymentProjectId,
        amount,
        payment_date: paymentForm.payment_date,
        payment_method: paymentForm.payment_method,
        reference: paymentForm.reference.trim() || null,
        notes: paymentForm.notes.trim() || null,
      })
      .select("*")
      .single();

    if (error) {
      setError(`Unable to add payment: ${error.message}`);
      setSavingPayment(false);
      return;
    }

    const nextPayments = [data as ProjectPayment, ...payments];
    setPayments(nextPayments);
    await refreshProjectPaymentStatus(paymentProjectId, nextPayments);
    setSavingPayment(false);
    setShowPaymentModal(false);
    setSuccess("Payment recorded successfully.");
    setTimeout(() => setSuccess(""), 3000);
  }

  async function deleteProjectPayment(payment: ProjectPayment) {
    const confirmed = window.confirm(
      `Delete this payment of ${formatProjectCurrency(payment.amount)}? This action cannot be undone.`
    );
    if (!confirmed) return;

    setError("");
    setSuccess("");

    const { error } = await supabase
      .from("project_payments")
      .delete()
      .eq("id", payment.id);

    if (error) {
      setError(`Unable to delete payment: ${error.message}`);
      return;
    }

    const nextPayments = payments.filter((item) => item.id !== payment.id);
    setPayments(nextPayments);
    await refreshProjectPaymentStatus(payment.project_id, nextPayments);
    setSuccess("Payment deleted successfully.");
    setTimeout(() => setSuccess(""), 3000);
  }

  const filteredAndSortedProjects = useMemo(() => {
    const search = projectSearchTerm.toLowerCase().trim();

    const filtered = projects.filter((project) => {
      const customer = customers.find(
        (item) => item.id === project.customer_id
      );

      const matchesStatus =
        projectStatusFilter === "all" ||
        project.project_status === projectStatusFilter;

      const matchesSearch =
        !search ||
        project.project_name.toLowerCase().includes(search) ||
        project.project_status.toLowerCase().includes(search) ||
        project.payment_status.toLowerCase().includes(search) ||
        customer?.name.toLowerCase().includes(search) ||
        customer?.phone.toLowerCase().includes(search);

      return matchesStatus && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      const direction =
        projectSortDirection === "asc" ? 1 : -1;

      if (projectSortKey === "system_capacity") {
        return (
          ((a.system_capacity ?? -Infinity) -
            (b.system_capacity ?? -Infinity)) *
          direction
        );
      }

      if (projectSortKey === "created_at") {
        return (
          (new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()) *
          direction
        );
      }

      const valueA =
        String(a[projectSortKey] ?? "").toLowerCase();
      const valueB =
        String(b[projectSortKey] ?? "").toLowerCase();

      return (
        valueA.localeCompare(valueB, "en", {
          numeric: true,
          sensitivity: "base",
        }) * direction
      );
    });
  }, [
    projects,
    customers,
    projectSearchTerm,
    projectStatusFilter,
    projectSortKey,
    projectSortDirection,
  ]);

  function handleProjectSort(
    key:
      | "project_name"
      | "project_status"
      | "system_capacity"
      | "payment_status"
      | "created_at"
  ) {
    if (projectSortKey === key) {
      setProjectSortDirection((current) =>
        current === "asc" ? "desc" : "asc"
      );
      return;
    }

    setProjectSortKey(key);
    setProjectSortDirection(
      key === "created_at" ? "desc" : "asc"
    );
  }

  function projectSortIcon(
    key:
      | "project_name"
      | "project_status"
      | "system_capacity"
      | "payment_status"
      | "created_at"
  ) {
    if (projectSortKey !== key) return "↕";
    return projectSortDirection === "asc" ? "↑" : "↓";
  }

  /* ================================
     LEAD METRICS
  ================================= */

  const totalLeads = leads.length;

  const newLeads = leads.filter(
    (lead) => lead.status === "new"
  ).length;

  const contactedLeads = leads.filter(
    (lead) => lead.status === "contacted"
  ).length;

  const convertedLeads = leads.filter(
    (lead) => lead.status === "converted"
  ).length;

  const activeStaff = staff.filter(
    (member) => member.status === "active"
  ).length;

  const inactiveStaff = staff.filter(
    (member) => member.status !== "active"
  ).length;

  const unassignedLeads = leads.filter(
    (lead) => lead.assigned_staff_id === null
  ).length;

  const conversionRate =
    totalLeads > 0
      ? Math.round(
          (convertedLeads / totalLeads) * 100
        )
      : 0;

  const contactRate =
    totalLeads > 0
      ? Math.round(
          (contactedLeads / totalLeads) * 100
        )
      : 0;

  const pipelineRate =
    totalLeads > 0
      ? Math.round(
          ((contactedLeads + convertedLeads) /
            totalLeads) *
            100
        )
      : 0;

  const upcomingFollowUps = leads
    .filter((lead) => lead.next_follow_up)
    .sort((a, b) => {
      const dateA = new Date(
        a.next_follow_up as string
      ).getTime();

      const dateB = new Date(
        b.next_follow_up as string
      ).getTime();

      return dateA - dateB;
    });

  /* ================================
     MONTHLY LEAD CHART
  ================================= */

  const monthlyLeadData = useMemo(() => {
    const months: {
      key: string;
      label: string;
      count: number;
      converted: number;
    }[] = [];

    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - i,
        1
      );

      const year = date.getFullYear();
      const month = date.getMonth();

      const label = date.toLocaleDateString(
        "en-IN",
        {
          month: "short",
        }
      );

      const count = leads.filter((lead) => {
        const created = new Date(
          lead.created_at
        );

        return (
          created.getFullYear() === year &&
          created.getMonth() === month
        );
      }).length;

      const converted = leads.filter((lead) => {
        const created = new Date(
          lead.created_at
        );

        return (
          created.getFullYear() === year &&
          created.getMonth() === month &&
          lead.status === "converted"
        );
      }).length;

      months.push({
        key: `${year}-${month}`,
        label,
        count,
        converted,
      });
    }

    return months;
  }, [leads]);

  const monthlyMax = Math.max(
    ...monthlyLeadData.map((item) => item.count),
    1
  );

  /* ================================
     FILTERED LEADS
  ================================= */

  const filteredLeads = useMemo(() => {
    const search = searchTerm
      .toLowerCase()
      .trim();

    return leads.filter((lead) => {
      const matchesStatus =
        statusFilter === "all" ||
        lead.status === statusFilter;

      const matchesSearch =
        !search ||
        lead.name
          ?.toLowerCase()
          .includes(search) ||
        lead.phone
          ?.toLowerCase()
          .includes(search) ||
        lead.email
          ?.toLowerCase()
          .includes(search) ||
        lead.location
          ?.toLowerCase()
          .includes(search) ||
        lead.customer_type
          ?.toLowerCase()
          .includes(search);

      const matchesAssignment =
        assignmentFilter === "all" ||
        (assignmentFilter === "unassigned" &&
          lead.assigned_staff_id === null) ||
        lead.assigned_staff_id === Number(assignmentFilter);

      return matchesStatus && matchesSearch && matchesAssignment;
    });
  }, [leads, searchTerm, statusFilter, assignmentFilter]);

  const filteredAndSortedCustomers = useMemo(() => {
    const search = customerSearchTerm.toLowerCase().trim();

    const filtered = customers.filter((customer) => {
      if (!search) return true;

      return [
        customer.name,
        customer.phone,
        customer.email,
        customer.customer_type,
        customer.location,
        customer.source,
      ].some((value) =>
        value?.toLowerCase().includes(search)
      );
    });

    return [...filtered].sort((a, b) => {
      const direction = customerSortDirection === "asc" ? 1 : -1;

      if (customerSortKey === "monthly_bill") {
        return (
          ((a.monthly_bill ?? -Infinity) -
            (b.monthly_bill ?? -Infinity)) *
          direction
        );
      }

      if (customerSortKey === "converted_at") {
        return (
          (new Date(a.converted_at).getTime() -
            new Date(b.converted_at).getTime()) *
          direction
        );
      }

      const aValue = (a[customerSortKey] ?? "").toString().toLowerCase();
      const bValue = (b[customerSortKey] ?? "").toString().toLowerCase();

      return (
        aValue.localeCompare(bValue, "en", {
          numeric: true,
          sensitivity: "base",
        }) * direction
      );
    });
  }, [customers, customerSearchTerm, customerSortKey, customerSortDirection]);

  function handleCustomerSort(key: CustomerSortKey) {
    if (customerSortKey === key) {
      setCustomerSortDirection((current) =>
        current === "asc" ? "desc" : "asc"
      );
      return;
    }

    setCustomerSortKey(key);
    setCustomerSortDirection(key === "converted_at" ? "desc" : "asc");
  }

  function customerSortIcon(key: CustomerSortKey) {
    if (customerSortKey !== key) return "↕";
    return customerSortDirection === "asc" ? "↑" : "↓";
  }

  function statusLabel(
    status: LeadStatus | null
  ) {
    if (status === "contacted") return "Contacted";
    if (status === "converted") return "Converted";
    return "New";
  }

  function statusClasses(
    status: LeadStatus | null
  ) {
    if (status === "contacted") {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }

    if (status === "converted") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    return "bg-blue-50 text-blue-700 border-blue-200";
  }

  function formatDate(date: string | null) {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  }

  function formatCurrency(value: number | null) {
    if (value === null || value === undefined) {
      return "—";
    }

    return `₹${value.toLocaleString("en-IN")}`;
  }

  function navigateTo(section: Section) {
    setActiveSection(section);
    setMobileMenuOpen(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />

            <p className="mt-4 text-sm font-medium text-slate-600">
              Loading admin dashboard...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* MOBILE HEADER */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white lg:hidden">
        <div className="flex items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
              Solar CRM
            </p>

            <h1 className="text-lg font-bold">
              Admin Dashboard
            </h1>
          </div>

          <button
            onClick={() =>
              setMobileMenuOpen(
                (current) => !current
              )
            }
            className="rounded-xl border border-slate-200 p-2.5"
          >
            <span className="text-xl">
              ☰
            </span>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white p-3">
            <MobileNavigation
              activeSection={activeSection}
              navigateTo={navigateTo}
            />

            <button
              onClick={handleLogout}
              className="mt-2 w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        )}
      </header>

      <div className="flex min-h-screen">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:block">
          <div className="sticky top-0 flex h-screen flex-col">
            <div className="border-b border-slate-100 px-6 py-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-xl text-white shadow-lg shadow-emerald-100">
                  ☀
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                    Solar CRM
                  </p>

                  <h1 className="text-lg font-bold text-slate-900">
                    Admin Panel
                  </h1>
                </div>
              </div>
            </div>

            <nav className="flex-1 space-y-1 px-3 py-6">
              <SidebarButton
                active={
                  activeSection === "overview"
                }
                label="Overview"
                icon="⌂"
                onClick={() =>
                  navigateTo("overview")
                }
              />

              <SidebarButton
                active={
                  activeSection === "leads"
                }
                label="Leads"
                icon="◉"
                count={totalLeads}
                onClick={() =>
                  navigateTo("leads")
                }
              />

              <SidebarButton
                active={
                  activeSection === "customers"
                }
                label="Customers"
                icon="♙"
                count={customers.length}
                onClick={() =>
                  navigateTo("customers")
                }
              />

              <SidebarButton
                active={
                  activeSection === "projects"
                }
                label="Projects"
                icon="▣"
                count={projects.length}
                onClick={() =>
                  navigateTo("projects")
                }
              />

              <SidebarButton
                active={
                  activeSection === "staff"
                }
                label="Staff"
                icon="♙"
                count={staff.length}
                onClick={() =>
                  navigateTo("staff")
                }
              />

              <SidebarButton
                active={
                  activeSection === "followups"
                }
                label="Follow-ups"
                icon="◷"
                count={upcomingFollowUps.length}
                onClick={() =>
                  navigateTo("followups")
                }
              />
            </nav>

            <div className="border-t border-slate-100 p-4">
              <div className="mb-3 rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">
                  CRM Status
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                  <span className="text-sm font-semibold text-slate-700">
                    System Online
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                ↪ Logout
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <section className="min-w-0 flex-1">
          <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {/* HEADER */}
            <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="mb-1 text-sm font-semibold text-emerald-600">
                  Solar Business CRM
                </p>

                <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                  {activeSection === "overview" &&
                    "Lead Performance Overview"}

                  {activeSection === "leads" &&
                    "Lead Management"}

                  {activeSection === "customers" &&
                    "Customer Management"}

                  {activeSection === "projects" &&
                    "Customer Projects"}

                  {activeSection === "staff" &&
                    "Staff Management"}

                  {activeSection === "followups" &&
                    "Follow-up Activity"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Monitor enquiries, conversion
                  performance and customer activity.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={loadDashboard}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700"
                >
                  ↻ Refresh
                </button>

                <button
                  onClick={() =>
                    setShowInviteModal(true)
                  }
                  className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                >
                  + Add Staff
                </button>
              </div>
            </div>

            {/* ALERTS */}
            {error && (
              <div className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <span>{error}</span>

                <button
                  onClick={() => setError("")}
                  className="font-bold"
                >
                  ×
                </button>
              </div>
            )}

            {success && (
              <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                ✓ {success}
              </div>
            )}

            {/* =========================================
                OVERVIEW
            ========================================== */}

            {activeSection === "overview" && (
              <>
                {/* KPI CARDS */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                  <KpiCard
                    title="Total Leads"
                    value={totalLeads}
                    subtitle="All enquiries"
                    icon="◉"
                    iconClass="bg-blue-50 text-blue-600"
                  />

                  <KpiCard
                    title="New Leads"
                    value={newLeads}
                    subtitle="Needs attention"
                    icon="✦"
                    iconClass="bg-cyan-50 text-cyan-600"
                  />

                  <KpiCard
                    title="Contacted"
                    value={contactedLeads}
                    subtitle="In progress"
                    icon="☎"
                    iconClass="bg-amber-50 text-amber-600"
                  />

                  <KpiCard
                    title="Converted"
                    value={convertedLeads}
                    subtitle={`${conversionRate}% conversion`}
                    icon="✓"
                    iconClass="bg-emerald-50 text-emerald-600"
                  />

                  <KpiCard
                    title="Active Staff"
                    value={activeStaff}
                    subtitle={`${inactiveStaff} inactive`}
                    icon="♙"
                    iconClass="bg-violet-50 text-violet-600"
                  />
                </div>

                {/* PERFORMANCE SUMMARY */}
                <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                        Performance
                      </p>

                      <h3 className="mt-1 text-xl font-bold">
                        Lead performance summary
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        A quick view of your current
                        sales pipeline.
                      </p>
                    </div>

                    <div className="rounded-xl bg-emerald-50 px-4 py-2">
                      <span className="text-xs font-semibold text-emerald-700">
                        Conversion Rate
                      </span>

                      <span className="ml-2 text-lg font-bold text-emerald-700">
                        {conversionRate}%
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                    {/* FUNNEL */}
                    <LeadFunnel
                      total={totalLeads}
                      newLeads={newLeads}
                      contacted={contactedLeads}
                      converted={convertedLeads}
                    />

                    {/* STATUS DISTRIBUTION */}
                    <StatusDistribution
                      total={totalLeads}
                      newLeads={newLeads}
                      contacted={contactedLeads}
                      converted={convertedLeads}
                    />
                  </div>
                </section>

                {/* MONTHLY CHART + PIPELINE */}
                <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
                  {/* MONTHLY LEADS */}
                  <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="mb-6">
                      <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                        Trend
                      </p>

                      <h3 className="mt-1 text-lg font-bold">
                        Monthly lead activity
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Leads received during the last
                        six months.
                      </p>
                    </div>

                    <MonthlyLeadChart
                      data={monthlyLeadData}
                      max={monthlyMax}
                    />
                  </section>

                  {/* PIPELINE SUMMARY */}
                  <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="mb-6">
                      <p className="text-xs font-bold uppercase tracking-widest text-violet-600">
                        Pipeline
                      </p>

                      <h3 className="mt-1 text-lg font-bold">
                        Sales pipeline
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Current lead progression.
                      </p>
                    </div>

                    <div className="space-y-6">
                      <ProgressMetric
                        label="New Leads"
                        value={newLeads}
                        total={totalLeads}
                        percentage={
                          totalLeads
                            ? Math.round(
                                (newLeads /
                                  totalLeads) *
                                  100
                              )
                            : 0
                        }
                        className="bg-blue-500"
                      />

                      <ProgressMetric
                        label="Contacted"
                        value={contactedLeads}
                        total={totalLeads}
                        percentage={
                          totalLeads
                            ? Math.round(
                                (contactedLeads /
                                  totalLeads) *
                                  100
                              )
                            : 0
                        }
                        className="bg-amber-500"
                      />

                      <ProgressMetric
                        label="Converted"
                        value={convertedLeads}
                        total={totalLeads}
                        percentage={
                          totalLeads
                            ? Math.round(
                                (convertedLeads /
                                  totalLeads) *
                                  100
                              )
                            : 0
                        }
                        className="bg-emerald-500"
                      />

                      <div className="border-t border-slate-100 pt-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-slate-700">
                              Pipeline coverage
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              Contacted + converted
                            </p>
                          </div>

                          <span className="text-xl font-bold text-slate-900">
                            {pipelineRate}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                {/* RECENT LEADS + FOLLOWUPS */}
                <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                  <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold">
                          Recent Leads
                        </h3>

                        <p className="text-sm text-slate-500">
                          Latest customer enquiries
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          navigateTo("leads")
                        }
                        className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                      >
                        View all →
                      </button>
                    </div>

                    <div className="space-y-3">
                      {leads
                        .slice(0, 6)
                        .map((lead) => (
                          <div
                            key={lead.id}
                            className="flex flex-col gap-3 rounded-2xl border border-slate-100 p-4 transition hover:border-emerald-200 hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-slate-900">
                                {lead.name}
                              </p>

                              <p className="mt-1 text-sm text-slate-500">
                                {lead.phone}
                                {lead.location
                                  ? ` • ${lead.location}`
                                  : ""}
                              </p>
                            </div>

                            <div className="flex items-center gap-3">
                              <span
                                className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses(
                                  lead.status
                                )}`}
                              >
                                {statusLabel(
                                  lead.status
                                )}
                              </span>

                              <button
                                onClick={() =>
                                  setSelectedLead(
                                    lead
                                  )
                                }
                                className="text-sm font-semibold text-slate-600 hover:text-emerald-600"
                              >
                                View
                              </button>
                            </div>
                          </div>
                        ))}

                      {leads.length === 0 && (
                        <EmptyState text="No leads yet." />
                      )}
                    </div>
                  </section>

                  <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="mb-5">
                      <h3 className="text-lg font-bold">
                        Follow-up Activity
                      </h3>

                      <p className="text-sm text-slate-500">
                        Scheduled customer follow-ups
                      </p>
                    </div>

                    <div className="space-y-3">
                      {upcomingFollowUps
                        .slice(0, 6)
                        .map((lead) => (
                          <button
                            key={lead.id}
                            onClick={() =>
                              setSelectedLead(
                                lead
                              )
                            }
                            className="w-full rounded-2xl border border-slate-100 p-4 text-left transition hover:border-emerald-200 hover:bg-slate-50"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-semibold">
                                  {lead.name}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                  {lead.follow_up_note ||
                                    "Follow-up scheduled"}
                                </p>
                              </div>

                              <span className="shrink-0 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                {formatDate(
                                  lead.next_follow_up
                                )}
                              </span>
                            </div>
                          </button>
                        ))}

                      {upcomingFollowUps.length ===
                        0 && (
                        <EmptyState text="No follow-ups scheduled." />
                      )}
                    </div>
                  </section>
                </div>
              </>
            )}

            {/* =========================================
                LEADS
            ========================================== */}

            {activeSection === "leads" && (
              <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 p-5 sm:p-6">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                      <h3 className="text-lg font-bold">
                        Customer Leads
                      </h3>

                      <p className="text-sm text-slate-500">
                        Search and manage all solar
                        enquiries.
                      </p>
                    </div>

                    <div className="w-full xl:max-w-md">
                      <input
                        value={searchTerm}
                        onChange={(event) =>
                          setSearchTerm(
                            event.target.value
                          )
                        }
                        placeholder="Search name, phone, email, location..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-50"
                      />
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <FilterButton
                      active={
                        statusFilter === "all"
                      }
                      label={`All ${totalLeads}`}
                      onClick={() =>
                        setStatusFilter("all")
                      }
                    />

                    <FilterButton
                      active={
                        statusFilter === "new"
                      }
                      label={`New ${newLeads}`}
                      onClick={() =>
                        setStatusFilter("new")
                      }
                    />

                    <FilterButton
                      active={
                        statusFilter === "contacted"
                      }
                      label={`Contacted ${contactedLeads}`}
                      onClick={() =>
                        setStatusFilter(
                          "contacted"
                        )
                      }
                    />

                    <FilterButton
                      active={
                        statusFilter === "converted"
                      }
                      label={`Converted ${convertedLeads}`}
                      onClick={() =>
                        setStatusFilter(
                          "converted"
                        )
                      }
                    />

                    <select
                      value={assignmentFilter}
                      onChange={(event) =>
                        setAssignmentFilter(event.target.value)
                      }
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                    >
                      <option value="all">All Staff</option>
                      <option value="unassigned">Unassigned ({unassignedLeads})</option>
                      {staff.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.name}
                        </option>
                      ))}
                    </select>

                    <span className="rounded-xl bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700">
                      Unassigned: {unassignedLeads}
                    </span>
                  </div>
                </div>

                <div className="hidden overflow-x-auto lg:block">
                  <table className="w-full min-w-[1100px]">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/70 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                        <th className="px-5 py-4">
                          Customer
                        </th>

                        <th className="px-5 py-4">
                          Contact
                        </th>

                        <th className="px-5 py-4">
                          Type
                        </th>

                        <th className="px-5 py-4">
                          Bill
                        </th>

                        <th className="px-5 py-4">
                          Location
                        </th>

                        <th className="px-5 py-4">
                          Assigned To
                        </th>

                        <th className="px-5 py-4">
                          Status
                        </th>

                        <th className="px-5 py-4">
                          Follow-up
                        </th>

                        <th className="px-5 py-4">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredLeads.map(
                        (lead) => (
                          <tr
                            key={lead.id}
                            className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                          >
                            <td className="px-5 py-4">
                              <button
                                onClick={() =>
                                  setSelectedLead(
                                    lead
                                  )
                                }
                                className="text-left"
                              >
                                <p className="font-semibold text-slate-900 hover:text-emerald-600">
                                  {lead.name}
                                </p>

                                <p className="mt-1 max-w-[200px] truncate text-xs text-slate-500">
                                  {lead.email ||
                                    "No email"}
                                </p>
                              </button>
                            </td>

                            <td className="px-5 py-4">
                              <a
                                href={`tel:${lead.phone}`}
                                className="font-medium text-slate-700 hover:text-emerald-600"
                              >
                                {lead.phone}
                              </a>
                            </td>

                            <td className="px-5 py-4 text-sm text-slate-600">
                              {lead.customer_type ||
                                "—"}
                            </td>

                            <td className="px-5 py-4 text-sm font-medium">
                              {formatCurrency(
                                lead.monthly_bill
                              )}
                            </td>

                            <td className="px-5 py-4 text-sm text-slate-600">
                              {lead.location ||
                                "—"}
                            </td>

                            <td className="px-5 py-4">
                              <select
                                value={lead.assigned_staff_id ?? ""}
                                disabled={updatingLeadId === lead.id}
                                onChange={(event) =>
                                  assignLead(
                                    lead.id,
                                    event.target.value ? Number(event.target.value) : null
                                  )
                                }
                                className="w-full min-w-[150px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 disabled:opacity-50"
                              >
                                <option value="">Unassigned</option>
                                {assignmentStaff.map((member) => (
                                  <option key={member.id} value={member.id}>
                                    {member.name}
                                  </option>
                                ))}
                              </select>
                            </td>

                            <td className="px-5 py-4">
                              <select
                                value={
                                  lead.status ||
                                  "new"
                                }
                                disabled={
                                  updatingLeadId ===
                                  lead.id
                                }
                                onChange={(event) =>
                                  updateLeadStatus(
                                    lead.id,
                                    event.target
                                      .value as LeadStatus
                                  )
                                }
                                className={`rounded-full border px-3 py-1.5 text-xs font-semibold outline-none ${statusClasses(
                                  lead.status
                                )}`}
                              >
                                <option value="new">
                                  New
                                </option>

                                <option value="contacted">
                                  Contacted
                                </option>

                                <option value="converted">
                                  Converted
                                </option>
                              </select>
                            </td>

                            <td className="px-5 py-4">
                              {lead.next_follow_up ? (
                                <div>
                                  <p className="text-sm font-semibold text-slate-700">
                                    {formatDate(
                                      lead.next_follow_up
                                    )}
                                  </p>

                                  <p className="mt-1 max-w-[180px] truncate text-xs text-slate-500">
                                    {lead.follow_up_note ||
                                      "No note"}
                                  </p>
                                </div>
                              ) : (
                                <span className="text-sm text-slate-400">
                                  None
                                </span>
                              )}
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setSelectedLead(lead)}
                                  className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                                >
                                  Manage
                                </button>

                                {lead.status === "converted" ? (
                                  <span className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                                    Customer
                                  </span>
                                ) : (
                                  <button
                                    disabled={convertingLeadId === lead.id}
                                    onClick={() => convertLeadToCustomer(lead)}
                                    className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    {convertingLeadId === lead.id ? "Converting..." : "Convert"}
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-3 p-4 lg:hidden">
                  {filteredLeads.map(
                    (lead) => (
                      <div
                        key={lead.id}
                        className="rounded-2xl border border-slate-200 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-bold">
                              {lead.name}
                            </p>

                            <a
                              href={`tel:${lead.phone}`}
                              className="mt-1 block text-sm text-emerald-600"
                            >
                              {lead.phone}
                            </a>
                          </div>

                          <span
                            className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClasses(
                              lead.status
                            )}`}
                          >
                            {statusLabel(
                              lead.status
                            )}
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-xs text-slate-400">
                              Type
                            </p>

                            <p className="font-medium">
                              {lead.customer_type ||
                                "—"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-400">
                              Monthly Bill
                            </p>

                            <p className="font-medium">
                              {formatCurrency(
                                lead.monthly_bill
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-400">
                              Location
                            </p>

                            <p className="font-medium">
                              {lead.location ||
                                "—"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-400">
                              Assigned To
                            </p>

                            <p className="font-medium">
                              {staff.find((member) => member.id === lead.assigned_staff_id)?.name || "Unassigned"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-400">
                              Follow-up
                            </p>

                            <p className="font-medium">
                              {formatDate(
                                lead.next_follow_up
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <a
                            href={`tel:${lead.phone}`}
                            className="flex-1 rounded-xl bg-emerald-50 px-3 py-2.5 text-center text-sm font-semibold text-emerald-700"
                          >
                            Call
                          </a>

                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="flex-1 rounded-xl bg-slate-900 px-3 py-2.5 text-sm font-semibold text-white"
                          >
                            Manage
                          </button>

                          {lead.status === "converted" ? (
                            <button
                              onClick={() => navigateTo("customers")}
                              className="flex-1 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-700"
                            >
                              Customer
                            </button>
                          ) : (
                            <button
                              disabled={convertingLeadId === lead.id}
                              onClick={() => convertLeadToCustomer(lead)}
                              className="flex-1 rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                            >
                              {convertingLeadId === lead.id ? "Converting..." : "Convert"}
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>

                {filteredLeads.length === 0 && (
                  <div className="p-10">
                    <EmptyState text="No leads match your search or filter." />
                  </div>
                )}
              </section>
            )}

            {/* =========================================
                CUSTOMERS
            ========================================== */}

            {activeSection === "customers" && (
              <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 p-5 sm:p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                      <h3 className="text-lg font-bold">Customers</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Customers created from converted solar leads.
                      </p>
                    </div>

                    <div className="w-full lg:max-w-md">
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Search customers
                      </label>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
                        <input
                          type="text"
                          value={customerSearchTerm}
                          onChange={(event) => setCustomerSearchTerm(event.target.value)}
                          placeholder="Search name, phone, email, type or location..."
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-10 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-50"
                        />
                        {customerSearchTerm && (
                          <button
                            type="button"
                            onClick={() => setCustomerSearchTerm("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                            aria-label="Clear customer search"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="rounded-full bg-slate-100 px-3 py-1.5 font-semibold text-slate-600">
                      {filteredAndSortedCustomers.length} of {customers.length} customers
                    </span>
                    <span>Click a column heading to sort. Click a customer row to view full details.</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1000px]">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/70 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                        <CustomerSortHeader label="Customer" icon={customerSortIcon("name")} onClick={() => handleCustomerSort("name")} />
                        <CustomerSortHeader label="Contact" icon={customerSortIcon("phone")} onClick={() => handleCustomerSort("phone")} />
                        <CustomerSortHeader label="Type" icon={customerSortIcon("customer_type")} onClick={() => handleCustomerSort("customer_type")} />
                        <CustomerSortHeader label="Location" icon={customerSortIcon("location")} onClick={() => handleCustomerSort("location")} />
                        <CustomerSortHeader label="Monthly Bill" icon={customerSortIcon("monthly_bill")} onClick={() => handleCustomerSort("monthly_bill")} />
                        <CustomerSortHeader label="Converted" icon={customerSortIcon("converted_at")} onClick={() => handleCustomerSort("converted_at")} />
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSortedCustomers.map((customer) => (
                        <tr
                          key={customer.id}
                          onClick={() => setSelectedCustomer(customer)}
                          className="cursor-pointer border-b border-slate-100 last:border-0 hover:bg-emerald-50/40"
                        >
                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                setSelectedCustomer(customer);
                              }}
                              className="text-left"
                            >
                              <p className="font-semibold text-slate-900 hover:text-emerald-700">
                                {customer.name}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                Customer #{customer.id}
                              </p>
                            </button>
                          </td>
                          <td className="px-5 py-4 text-sm">
                            <a href={`tel:${customer.phone}`} className="font-medium text-emerald-600 hover:text-emerald-700">{customer.phone}</a>
                            {customer.email && <p className="mt-1 text-xs text-slate-500">{customer.email}</p>}
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-600">{customer.customer_type || "—"}</td>
                          <td className="px-5 py-4 text-sm text-slate-600">{customer.location || "—"}</td>
                          <td className="px-5 py-4 text-sm font-medium">{formatCurrency(customer.monthly_bill)}</td>
                          <td className="px-5 py-4 text-sm text-slate-500">{formatDate(customer.converted_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredAndSortedCustomers.length === 0 && (
                  <div className="p-10">
                    <EmptyState
                      text={customers.length === 0
                        ? "No customers yet. Convert a lead to create the first customer."
                        : "No customers match your search."}
                    />
                  </div>
                )}
              </section>
            )}

            {/* =========================================
                CUSTOMER PROJECTS
            ========================================== */}

            {activeSection === "projects" && (
              <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 p-5 sm:p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                        Solar Projects
                      </p>
                      <h3 className="mt-1 text-lg font-bold">
                        Customer Projects
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Track solar installation projects for converted customers.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => openNewProjectModal()}
                      disabled={customers.length === 0}
                      className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      + New Project
                    </button>
                  </div>

                  <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto]">
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        ⌕
                      </span>
                      <input
                        type="text"
                        value={projectSearchTerm}
                        onChange={(event) =>
                          setProjectSearchTerm(event.target.value)
                        }
                        placeholder="Search project, customer, phone or status..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-10 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-50"
                      />
                      {projectSearchTerm && (
                        <button
                          type="button"
                          onClick={() => setProjectSearchTerm("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                          aria-label="Clear project search"
                        >
                          ×
                        </button>
                      )}
                    </div>

                    <select
                      value={projectStatusFilter}
                      onChange={(event) =>
                        setProjectStatusFilter(event.target.value)
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                    >
                      <option value="all">All statuses</option>
                      <option value="new">New</option>
                      <option value="in_progress">In Progress</option>
                      <option value="installation">Installation</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="rounded-full bg-slate-100 px-3 py-1.5 font-semibold text-slate-600">
                      {filteredAndSortedProjects.length} of {projects.length} projects
                    </span>
                    <span>
                      Click a column heading to sort.
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1100px]">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/70 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                        <ProjectSortHeader
                          label="Project"
                          icon={projectSortIcon("project_name")}
                          onClick={() => handleProjectSort("project_name")}
                        />
                        <th className="px-5 py-4">Customer</th>
                        <ProjectSortHeader
                          label="Status"
                          icon={projectSortIcon("project_status")}
                          onClick={() => handleProjectSort("project_status")}
                        />
                        <ProjectSortHeader
                          label="Capacity"
                          icon={projectSortIcon("system_capacity")}
                          onClick={() => handleProjectSort("system_capacity")}
                        />
                        <ProjectSortHeader
                          label="Payment"
                          icon={projectSortIcon("payment_status")}
                          onClick={() => handleProjectSort("payment_status")}
                        />
                        <ProjectSortHeader
                          label="Created"
                          icon={projectSortIcon("created_at")}
                          onClick={() => handleProjectSort("created_at")}
                        />
                        <th className="px-5 py-4 text-right">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredAndSortedProjects.map((project) => {
                        const customer = customers.find(
                          (item) => item.id === project.customer_id
                        );

                        return (
                          <tr
                            key={project.id}
                            className="border-b border-slate-100 last:border-0 hover:bg-emerald-50/40"
                          >
                            <td className="px-5 py-4">
                              <button
                                type="button"
                                onClick={() => openProjectDetails(project)}
                                className="text-left font-semibold text-slate-900 hover:text-emerald-700 hover:underline"
                              >
                                {project.project_name}
                              </button>
                              <p className="mt-1 text-xs text-slate-500">
                                Project #{project.id}
                              </p>
                            </td>

                            <td className="px-5 py-4">
                              {customer ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => setSelectedCustomer(customer)}
                                    className="text-left font-semibold text-slate-900 hover:text-emerald-700"
                                  >
                                    {customer.name}
                                  </button>
                                  <p className="mt-1 text-xs text-slate-500">
                                    {customer.phone}
                                  </p>
                                </>
                              ) : (
                                <span className="text-sm text-slate-400">
                                  Customer unavailable
                                </span>
                              )}
                            </td>

                            <td className="px-5 py-4">
                              <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${projectStatusClasses(project.project_status)}`}>
                                {projectStatusLabel(project.project_status)}
                              </span>
                            </td>

                            <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                              {project.system_capacity !== null
                                ? `${project.system_capacity} kW`
                                : "—"}
                            </td>

                            <td className="px-5 py-4">
                              <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${paymentStatusClasses(project.payment_status)}`}>
                                {paymentStatusLabel(project.payment_status)}
                              </span>
                            </td>

                            <td className="px-5 py-4 text-sm text-slate-500">
                              {formatProjectDate(project.created_at)}
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => openEditProjectModal(project)}
                                  className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteProject(project)}
                                  className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {filteredAndSortedProjects.length === 0 && (
                  <div className="p-10">
                    <EmptyState
                      text={
                        projects.length === 0
                          ? "No projects yet. Open a customer and create the first project."
                          : "No projects match your search or status filter."
                      }
                    />
                  </div>
                )}
              </section>
            )}

            {/* =========================================
                STAFF
            ========================================== */}

            {activeSection === "staff" && (
              <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-bold">
                        Staff Members
                      </h3>

                      <p className="text-sm text-slate-500">
                        Manage your solar CRM team.
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        setShowInviteModal(true)
                      }
                      className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                    >
                      + Invite Staff
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[850px]">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/70 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                        <th className="px-5 py-4">
                          Staff
                        </th>

                        <th className="px-5 py-4">
                          Contact
                        </th>

                        <th className="px-5 py-4">
                          Role
                        </th>

                        <th className="px-5 py-4">
                          Status
                        </th>

                        <th className="px-5 py-4">
                          Assigned Leads
                        </th>

                        <th className="px-5 py-4">
                          Joined
                        </th>

                        <th className="px-5 py-4">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {staff.map((member) => (
                        <tr
                          key={member.id}
                          className="border-b border-slate-100 last:border-0"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-cyan-100 font-bold text-emerald-700">
                                {member.name
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div>
                                <p className="font-semibold">
                                  {member.name}
                                </p>

                                <p className="text-xs text-slate-500">
                                  {member.email}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-600">
                            {member.phone}
                          </td>

                          <td className="px-5 py-4">
                            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                              {member.role}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                member.status ===
                                "active"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {member.status}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span className="rounded-xl bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700">
                              {leads.filter((lead) => lead.assigned_staff_id === member.id).length}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-500">
                            {formatDate(
                              member.created_at
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <button
                              disabled={
                                updatingStaffId ===
                                member.id
                              }
                              onClick={() =>
                                toggleStaffStatus(
                                  member
                                )
                              }
                              className={`rounded-xl px-3 py-2 text-xs font-semibold ${
                                member.status ===
                                "active"
                                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              }`}
                            >
                              {updatingStaffId ===
                              member.id
                                ? "Saving..."
                                : member.status ===
                                  "active"
                                ? "Deactivate"
                                : "Activate"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {staff.length === 0 && (
                  <div className="p-10">
                    <EmptyState text="No staff members found." />
                  </div>
                )}
              </section>
            )}

            {/* =========================================
                FOLLOWUPS
            ========================================== */}

            {activeSection === "followups" && (
              <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 p-5 sm:p-6">
                  <h3 className="text-lg font-bold">
                    Follow-up Activity
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Track scheduled customer follow-ups
                    and notes.
                  </p>
                </div>

                <div className="p-5 sm:p-6">
                  {upcomingFollowUps.length ===
                  0 ? (
                    <EmptyState text="No follow-ups scheduled yet." />
                  ) : (
                    <div className="space-y-3">
                      {upcomingFollowUps.map(
                        (lead) => (
                          <div
                            key={lead.id}
                            className="rounded-2xl border border-slate-200 p-4 transition hover:border-emerald-200 hover:bg-slate-50"
                          >
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                              <div className="flex items-start gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                  ◷
                                </div>

                                <div>
                                  <button
                                    onClick={() =>
                                      setSelectedLead(
                                        lead
                                      )
                                    }
                                    className="font-bold hover:text-emerald-600"
                                  >
                                    {lead.name}
                                  </button>

                                  <p className="mt-1 text-sm text-slate-500">
                                    {lead.phone}
                                  </p>

                                  <p className="mt-2 text-sm text-slate-600">
                                    {lead.follow_up_note ||
                                      "No follow-up note"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                                  {formatDate(
                                    lead.next_follow_up
                                  )}
                                </span>

                                <button
                                  onClick={() =>
                                    setSelectedLead(
                                      lead
                                    )
                                  }
                                  className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                                >
                                  Manage
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        </section>
      </div>

      {/* PROJECT DETAILS MODAL */}
      {selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          customer={
            customers.find((item) => item.id === selectedProject.customer_id) || null
          }
          payments={payments.filter((item) => item.project_id === selectedProject.id)}
          timelineEvents={timelineEvents.filter((item) => item.project_id === selectedProject.id)}
          onAddTimelineStage={() => openTimelineModal(selectedProject)}
          onAddPayment={() => openAddPaymentModal(selectedProject)}
          onDeletePayment={deleteProjectPayment}
          onEditPayment={openEditPaymentModal}
          onClose={() => setSelectedProject(null)}
          onEdit={() => {
            const project = selectedProject;
            setSelectedProject(null);
            window.setTimeout(() => openEditProjectModal(project), 0);
          }}
          onDelete={async () => {
            const project = selectedProject;
            const confirmed = window.confirm(
              `Delete project "${project.project_name}"? This action cannot be undone.`
            );
            if (!confirmed) return;

            setError("");
            setSuccess("");

            const { error: deleteError } = await supabase
              .from("customer_projects")
              .delete()
              .eq("id", project.id);

            if (deleteError) {
              setError(`Unable to delete project: ${deleteError.message}`);
              return;
            }

            setProjects((current) =>
              current.filter((item) => item.id !== project.id)
            );
            setSelectedProject(null);
            setSuccess("Customer project deleted successfully.");
            setTimeout(() => setSuccess(""), 3000);
          }}
        />
      )}

      {/* CUSTOMER DETAILS MODAL */}
      {selectedCustomer && (
        <CustomerDetailsModal
          customer={selectedCustomer}
          originalLead={
            leads.find((lead) => lead.id === selectedCustomer.lead_id) || null
          }
          assignedStaff={
            staff.find((member) => member.id === selectedCustomer.assigned_staff_id) || null
          }
          onClose={() => setSelectedCustomer(null)}
          onCreateProject={(customerId) => {
            setSelectedCustomer(null);
            window.setTimeout(() => openNewProjectModalForCustomer(customerId), 0);
          }}
        />
      )}

      {/* LEAD MODAL */}
      {selectedLead && (
        <LeadModal
          lead={selectedLead}
          updating={
            updatingLeadId === selectedLead.id
          }
          onClose={() =>
            setSelectedLead(null)
          }
          onStatusChange={(status) =>
            updateLeadStatus(
              selectedLead.id,
              status
            )
          }
          onFollowUpSave={(note, date) =>
            updateFollowUp(
              selectedLead.id,
              note,
              date
            )
          }
          assignmentStaff={assignmentStaff}
          converting={convertingLeadId === selectedLead.id}
          onConvert={() => convertLeadToCustomer(selectedLead)}
          onAssignmentChange={(staffId) =>
            assignLead(selectedLead.id, staffId)
          }
        />
      )}

      {/* TIMELINE UPDATE MODAL */}
      {showTimelineModal && timelineProjectId && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 p-5 sm:p-6">
              <div><p className="text-xs font-bold uppercase tracking-widest text-blue-600">Project Timeline</p><h3 className="mt-1 text-2xl font-bold text-slate-950">Update Project Stage</h3></div>
              <button type="button" onClick={() => setShowTimelineModal(false)} className="rounded-xl p-2 text-xl text-slate-400 hover:bg-slate-100">×</button>
            </div>
            <div className="space-y-5 p-5 sm:p-6">
              <div>
                <label className="mb-2 block text-sm font-semibold">Stage</label>
                <select value={timelineForm.stage} onChange={(e) => setTimelineForm((c) => ({ ...c, stage: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50">
                  {PROJECT_TIMELINE_STAGES.map((stage) => <option key={stage}>{stage}</option>)}
                </select>
              </div>
              <ProjectInput label="Stage Date" type="date" value={timelineForm.stage_date} onChange={(value) => setTimelineForm((c) => ({ ...c, stage_date: value }))} />
              <div><label className="mb-2 block text-sm font-semibold">Notes (Optional)</label><textarea value={timelineForm.notes} onChange={(e) => setTimelineForm((c) => ({ ...c, notes: e.target.value }))} rows={3} placeholder="Stage notes..." className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50" /></div>
              <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end"><button type="button" onClick={() => setShowTimelineModal(false)} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button><button type="button" onClick={saveTimelineStage} disabled={savingTimeline} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">{savingTimeline ? "Saving..." : "Save Stage"}</button></div>
            </div>
          </div>
        </div>
      )}

      {/* ADD PAYMENT MODAL */}
      {showPaymentModal && paymentProjectId && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 p-5 sm:p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                  Payments & Billing
                </p>
                <h3 className="mt-1 text-2xl font-bold text-slate-950">
                  {editingPaymentId ? "Edit Payment" : "Record Payment"}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {editingPaymentId ? "Update the existing payment record." : "Add a payment to this solar project."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="rounded-xl p-2 text-xl text-slate-400 hover:bg-slate-100"
              >
                ×
              </button>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <ProjectInput
                label="Payment Amount"
                type="number"
                value={paymentForm.amount}
                onChange={(value) =>
                  setPaymentForm((current) => ({ ...current, amount: value }))
                }
                placeholder="₹"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <ProjectInput
                  label="Payment Date"
                  type="date"
                  value={paymentForm.payment_date}
                  onChange={(value) =>
                    setPaymentForm((current) => ({ ...current, payment_date: value }))
                  }
                />

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Payment Method
                  </label>
                  <select
                    value={paymentForm.payment_method}
                    onChange={(event) =>
                      setPaymentForm((current) => ({
                        ...current,
                        payment_method: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                  >
                    <option>Bank Transfer</option>
                    <option>UPI</option>
                    <option>Cash</option>
                    <option>Cheque</option>
                    <option>Card</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <ProjectInput
                label="Payment Reference (Optional)"
                value={paymentForm.reference}
                onChange={(value) =>
                  setPaymentForm((current) => ({ ...current, reference: value }))
                }
                placeholder="Transaction ID / Cheque No."
              />

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Notes (Optional)
                </label>
                <textarea
                  value={paymentForm.notes}
                  onChange={(event) =>
                    setPaymentForm((current) => ({ ...current, notes: event.target.value }))
                  }
                  rows={3}
                  placeholder="Payment notes..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                />
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveProjectPayment}
                  disabled={savingPayment}
                  className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {savingPayment ? "Saving..." : editingPaymentId ? "Update Payment" : "Save Payment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW PROJECT MODAL */}
      {showProjectModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 p-5 sm:p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                  Customer Projects
                </p>
                <h3 className="mt-1 text-2xl font-bold text-slate-950">
                  {editProjectId ? "Edit Project" : "Create New Project"}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {editProjectId
                    ? "Update the solar installation project details."
                    : "Add a solar installation project to a customer."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowProjectModal(false)}
                className="rounded-xl p-2 text-xl text-slate-400 hover:bg-slate-100"
              >
                ×
              </button>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Customer
                </label>
                <select
                  value={projectCustomerId ?? ""}
                  onChange={(event) =>
                    setProjectCustomerId(
                      event.target.value ? Number(event.target.value) : null
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                >
                  <option value="">Select customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} — {customer.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <ProjectInput
                  label="Project Name"
                  value={projectForm.project_name}
                  onChange={(value) =>
                    setProjectForm((current) => ({
                      ...current,
                      project_name: value,
                    }))
                  }
                  placeholder="Example: 5kW Rooftop Solar"
                />

                <ProjectInput
                  label="System Capacity (kW)"
                  type="number"
                  value={projectForm.system_capacity}
                  onChange={(value) =>
                    setProjectForm((current) => ({
                      ...current,
                      system_capacity: value,
                    }))
                  }
                  placeholder="Example: 5"
                />

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Project Status
                  </label>
                  <select
                    value={projectForm.project_status}
                    onChange={(event) =>
                      setProjectForm((current) => ({
                        ...current,
                        project_status: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                  >
                    <option value="new">New</option>
                    <option value="in_progress">In Progress</option>
                    <option value="installation">Installation</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Payment Status
                  </label>
                  <select
                    value={projectForm.payment_status}
                    onChange={(event) =>
                      setProjectForm((current) => ({
                        ...current,
                        payment_status: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                  >
                    <option value="pending">Pending</option>
                    <option value="partial">Partial</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>

                <ProjectInput
                  label="Estimated Cost"
                  type="number"
                  value={projectForm.estimated_cost}
                  onChange={(value) =>
                    setProjectForm((current) => ({
                      ...current,
                      estimated_cost: value,
                    }))
                  }
                  placeholder="₹"
                />

                <ProjectInput
                  label="Final Cost"
                  type="number"
                  value={projectForm.final_cost}
                  onChange={(value) =>
                    setProjectForm((current) => ({
                      ...current,
                      final_cost: value,
                    }))
                  }
                  placeholder="₹"
                />

                <ProjectInput
                  label="Total Project Cost"
                  type="number"
                  value={projectForm.total_cost}
                  onChange={(value) =>
                    setProjectForm((current) => ({
                      ...current,
                      total_cost: value,
                    }))
                  }
                  placeholder="₹"
                />

                <ProjectInput
                  label="Installation Date"
                  type="date"
                  value={projectForm.installation_date}
                  onChange={(value) =>
                    setProjectForm((current) => ({
                      ...current,
                      installation_date: value,
                    }))
                  }
                />

                <ProjectInput
                  label="Completion Date"
                  type="date"
                  value={projectForm.completion_date}
                  onChange={(value) =>
                    setProjectForm((current) => ({
                      ...current,
                      completion_date: value,
                    }))
                  }
                />
              </div>

              <ProjectInput
                label="Installation Address"
                value={projectForm.installation_address}
                onChange={(value) =>
                  setProjectForm((current) => ({
                    ...current,
                    installation_address: value,
                  }))
                }
                placeholder="Full installation address"
              />

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Project Notes
                </label>
                <textarea
                  value={projectForm.notes}
                  onChange={(event) =>
                    setProjectForm((current) => ({
                      ...current,
                      notes: event.target.value,
                    }))
                  }
                  rows={4}
                  placeholder="Add project notes..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                />
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={editProjectId ? updateProject : createProject}
                  disabled={savingProject}
                  className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingProject
                    ? editProjectId
                      ? "Saving Changes..."
                      : "Creating Project..."
                    : editProjectId
                      ? "Save Changes"
                      : "Create Project"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INVITE STAFF MODAL */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                  Team Management
                </p>

                <h3 className="mt-1 text-xl font-bold">
                  Invite Staff Member
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  An invitation email will be sent to
                  the staff member.
                </p>
              </div>

              <button
                onClick={() =>
                  setShowInviteModal(false)
                }
                className="rounded-xl p-2 text-xl text-slate-400 hover:bg-slate-100"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <InputField
                label="Full Name"
                value={inviteName}
                onChange={setInviteName}
                placeholder="Enter staff name"
              />

              <InputField
                label="Phone Number"
                value={invitePhone}
                onChange={setInvitePhone}
                placeholder="Enter phone number"
              />

              <InputField
                label="Email Address"
                type="email"
                value={inviteEmail}
                onChange={setInviteEmail}
                placeholder="staff@example.com"
              />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() =>
                  setShowInviteModal(false)
                }
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
              >
                Cancel
              </button>

              <button
                onClick={inviteStaff}
                disabled={invitingStaff}
                className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {invitingStaff
                  ? "Sending..."
                  : "Send Invitation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* =====================================================
   PERFORMANCE COMPONENTS
===================================================== */

function LeadFunnel({
  total,
  newLeads,
  contacted,
  converted,
}: {
  total: number;
  newLeads: number;
  contacted: number;
  converted: number;
}) {
  const max = Math.max(total, 1);

  const items = [
    {
      label: "All Leads",
      value: total,
      width: 100,
      className: "bg-slate-900",
    },
    {
      label: "New",
      value: newLeads,
      width: Math.max(
        Math.round((newLeads / max) * 100),
        newLeads > 0 ? 8 : 0
      ),
      className: "bg-blue-500",
    },
    {
      label: "Contacted",
      value: contacted,
      width: Math.max(
        Math.round((contacted / max) * 100),
        contacted > 0 ? 8 : 0
      ),
      className: "bg-amber-500",
    },
    {
      label: "Converted",
      value: converted,
      width: Math.max(
        Math.round((converted / max) * 100),
        converted > 0 ? 8 : 0
      ),
      className: "bg-emerald-500",
    },
  ];

  return (
    <div className="rounded-2xl bg-slate-50 p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h4 className="font-bold">
            Lead Funnel
          </h4>

          <p className="text-xs text-slate-500">
            Current pipeline volume
          </p>
        </div>

        <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-slate-500 shadow-sm">
          {total} total
        </span>
      </div>

      <div className="space-y-5">
        {items.map((item) => (
          <div key={item.label}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">
                {item.label}
              </span>

              <span className="text-sm font-bold text-slate-900">
                {item.value}
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white">
              <div
                className={`h-full rounded-full transition-all duration-700 ${item.className}`}
                style={{
                  width: `${item.width}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusDistribution({
  total,
  newLeads,
  contacted,
  converted,
}: {
  total: number;
  newLeads: number;
  contacted: number;
  converted: number;
}) {
  const convertedPercent =
    total > 0
      ? Math.round((converted / total) * 100)
      : 0;

  const contactedPercent =
    total > 0
      ? Math.round((contacted / total) * 100)
      : 0;

  const newPercent =
    total > 0
      ? Math.round((newLeads / total) * 100)
      : 0;

  const gradient =
    total > 0
      ? `conic-gradient(
          #10b981 0% ${convertedPercent}%,
          #f59e0b ${convertedPercent}% ${
          convertedPercent + contactedPercent
        }%,
          #3b82f6 ${
            convertedPercent + contactedPercent
          }% 100%
        )`
      : "conic-gradient(#e2e8f0 0% 100%)";

  return (
    <div className="rounded-2xl border border-slate-100 p-5">
      <div className="mb-5">
        <h4 className="font-bold">
          Status Distribution
        </h4>

        <p className="text-xs text-slate-500">
          Lead composition
        </p>
      </div>

      <div className="flex items-center justify-center">
        <div
          className="relative flex h-44 w-44 items-center justify-center rounded-full"
          style={{
            background: gradient,
          }}
        >
          <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white shadow-inner">
            <span className="text-3xl font-bold text-slate-900">
              {total}
            </span>

            <span className="text-xs text-slate-400">
              leads
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <LegendRow
          label="New"
          value={newLeads}
          percentage={newPercent}
          dotClass="bg-blue-500"
        />

        <LegendRow
          label="Contacted"
          value={contacted}
          percentage={contactedPercent}
          dotClass="bg-amber-500"
        />

        <LegendRow
          label="Converted"
          value={converted}
          percentage={convertedPercent}
          dotClass="bg-emerald-500"
        />
      </div>
    </div>
  );
}

function LegendRow({
  label,
  value,
  percentage,
  dotClass,
}: {
  label: string;
  value: number;
  percentage: number;
  dotClass: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span
          className={`h-2.5 w-2.5 rounded-full ${dotClass}`}
        />

        <span className="text-sm text-slate-600">
          {label}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-slate-800">
          {value}
        </span>

        <span className="w-10 text-right text-xs text-slate-400">
          {percentage}%
        </span>
      </div>
    </div>
  );
}

function MonthlyLeadChart({
  data,
  max,
}: {
  data: {
    key: string;
    label: string;
    count: number;
    converted: number;
  }[];
  max: number;
}) {
  return (
    <div>
      <div className="flex h-64 items-end gap-3 sm:gap-5">
        {data.map((item) => {
          const height =
            item.count === 0
              ? 4
              : Math.max(
                  Math.round(
                    (item.count / max) * 100
                  ),
                  8
                );

          return (
            <div
              key={item.key}
              className="flex h-full flex-1 flex-col justify-end"
            >
              <div className="mb-2 text-center">
                <span className="text-xs font-bold text-slate-600">
                  {item.count}
                </span>
              </div>

              <div className="relative flex h-[190px] items-end justify-center">
                <div
                  className="w-full max-w-12 rounded-t-xl bg-gradient-to-t from-blue-600 to-cyan-400 shadow-sm transition-all duration-700"
                  style={{
                    height: `${height}%`,
                  }}
                  title={`${item.count} leads`}
                />

                {item.converted > 0 && (
                  <div
                    className="absolute bottom-0 w-full max-w-12 rounded-t-xl bg-emerald-500/80"
                    style={{
                      height: `${Math.max(
                        (item.converted /
                          max) *
                          100,
                        5
                      )}%`,
                    }}
                    title={`${item.converted} converted`}
                  />
                )}
              </div>

              <div className="mt-3 text-center">
                <span className="text-xs font-semibold text-slate-500">
                  {item.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-center gap-5 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
          Total leads
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          Converted
        </div>
      </div>
    </div>
  );
}

function ProgressMetric({
  label,
  value,
  total,
  percentage,
  className,
}: {
  label: string;
  value: number;
  total: number;
  percentage: number;
  className: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-700">
            {label}
          </p>

          <p className="text-xs text-slate-400">
            {value} of {total}
          </p>
        </div>

        <span className="text-sm font-bold text-slate-800">
          {percentage}%
        </span>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-700 ${className}`}
          style={{
            width: `${Math.min(
              percentage,
              100
            )}%`,
          }}
        />
      </div>
    </div>
  );
}

function ProjectSortHeader({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <th className="px-5 py-4">
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-2 hover:text-emerald-700"
      >
        {label}
        <span className="text-slate-400">{icon}</span>
      </button>
    </th>
  );
}

function ProjectInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
      />
    </div>
  );
}

function projectStatusLabel(status: string) {
  const labels: Record<string, string> = {
    new: "New",
    in_progress: "In Progress",
    installation: "Installation",
    completed: "Completed",
  };

  return labels[status] || status;
}

function projectStatusClasses(status: string) {
  const classes: Record<string, string> = {
    new: "border-blue-200 bg-blue-50 text-blue-700",
    in_progress: "border-amber-200 bg-amber-50 text-amber-700",
    installation: "border-violet-200 bg-violet-50 text-violet-700",
    completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  };

  return classes[status] || "border-slate-200 bg-slate-50 text-slate-700";
}

function paymentStatusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: "Pending",
    partial: "Partial",
    paid: "Paid",
  };

  return labels[status] || status;
}

function paymentStatusClasses(status: string) {
  const classes: Record<string, string> = {
    pending: "bg-red-50 text-red-700",
    partial: "bg-amber-50 text-amber-700",
    paid: "bg-emerald-50 text-emerald-700",
  };

  return classes[status] || "bg-slate-100 text-slate-700";
}

/* =====================================================
   GENERAL COMPONENTS
===================================================== */

function SidebarButton({
  active,
  label,
  icon,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: string;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <span className="flex items-center gap-3">
        <span className="text-base">
          {icon}
        </span>

        {label}
      </span>

      {count !== undefined && (
        <span
          className={`rounded-full px-2 py-0.5 text-xs ${
            active
              ? "bg-white text-emerald-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function MobileNavigation({
  activeSection,
  navigateTo,
}: {
  activeSection: Section;
  navigateTo: (section: Section) => void;
}) {
  return (
    <div className="space-y-1">
      {[
        ["overview", "Overview"],
        ["leads", "Leads"],
        ["customers", "Customers"],
        ["projects", "Projects"],
        ["staff", "Staff"],
        ["followups", "Follow-ups"],
      ].map(([value, label]) => (
        <button
          key={value}
          onClick={() =>
            navigateTo(value as Section)
          }
          className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold ${
            activeSection === value
              ? "bg-emerald-50 text-emerald-700"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function KpiCard({
  title,
  value,
  subtitle,
  icon,
  iconClass,
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: string;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function FilterButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
        active
          ? "bg-slate-950 text-white shadow-sm"
          : "border border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
      }`}
    >
      {label}
    </button>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-50"
      />
    </div>
  );
}

function CustomerSortHeader({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <th className="px-5 py-4">
      <button
        type="button"
        onClick={onClick}
        className="group inline-flex items-center gap-2 rounded-lg py-1 text-left transition hover:text-emerald-700"
      >
        <span>{label}</span>
        <span className="text-sm font-bold text-slate-400 transition group-hover:text-emerald-600">{icon}</span>
      </button>
    </th>
  );
}

function EmptyState({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
        ☀
      </div>

      <p className="mt-3 text-sm font-semibold text-slate-600">
        {text}
      </p>
    </div>
  );
}

/* =====================================================
   CUSTOMER DETAILS MODAL
===================================================== */

function formatProjectCurrency(value: number | null) {
  if (value === null || value === undefined) return "—";
  return `₹${value.toLocaleString("en-IN")}`;
}

function formatProjectDate(date: string | null) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function ProjectDetailsModal({
  project,
  customer,
  payments,
  timelineEvents,
  onAddTimelineStage,
  onAddPayment,
  onDeletePayment,
  onEditPayment,
  onClose,
  onEdit,
  onDelete,
}: {
  project: CustomerProject;
  customer: Customer | null;
  payments: ProjectPayment[];
  timelineEvents: ProjectTimelineEvent[];
  onAddTimelineStage: () => void;
  onAddPayment: () => void;
  onDeletePayment: (payment: ProjectPayment) => void | Promise<void>;
  onEditPayment: (payment: ProjectPayment) => void;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void | Promise<void>;
}) {
  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center">
        <div className="w-full max-w-4xl rounded-3xl bg-white shadow-2xl">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5 sm:p-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                Solar Project Details
              </p>
              <h3 className="mt-1 text-2xl font-bold text-slate-950">
                {project.project_name}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Project #{project.id}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-xl text-slate-400 hover:bg-slate-100"
              aria-label="Close project details"
            >
              ×
            </button>
          </div>

          <div className="space-y-6 p-5 sm:p-6">
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                Customer
              </p>
              {customer ? (
                <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <DetailItem label="Name" value={customer.name} />
                  <DetailItem label="Phone" value={customer.phone} />
                  <DetailItem label="Email" value={customer.email || "Not provided"} />
                  <DetailItem label="Customer Type" value={customer.customer_type || "Not specified"} />
                  <DetailItem label="Monthly Bill" value={formatProjectCurrency(customer.monthly_bill)} />
                  <DetailItem label="Location" value={customer.location || "Not specified"} />
                </div>
              ) : (
                <p className="mt-3 text-sm font-medium text-amber-700">
                  Customer record is unavailable.
                </p>
              )}
            </section>

            <section>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                Project Information
              </p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <DetailItem label="Project Name" value={project.project_name} />
                <DetailItem
                  label="System Capacity"
                  value={project.system_capacity !== null ? `${project.system_capacity} kW` : "Not specified"}
                />
                <DetailItem
                  label="Project Status"
                  value={projectStatusLabel(project.project_status)}
                />
                <DetailItem
                  label="Payment Status"
                  value={paymentStatusLabel(project.payment_status)}
                />
                <DetailItem label="Estimated Cost" value={formatProjectCurrency(project.estimated_cost)} />
                <DetailItem label="Final Cost" value={formatProjectCurrency(project.final_cost)} />
                <DetailItem label="Total Project Cost" value={formatProjectCurrency(project.total_cost ?? project.final_cost ?? project.estimated_cost)} />
                <DetailItem
                  label="Installation Date"
                  value={project.installation_date ? formatProjectDate(project.installation_date) : "Not scheduled"}
                />
                <DetailItem
                  label="Completion Date"
                  value={project.completion_date ? formatProjectDate(project.completion_date) : "Not completed"}
                />
                <DetailItem label="Created" value={formatProjectDate(project.created_at)} />
              </div>
            </section>

            <section>
              <DetailItem
                label="Installation Address"
                value={project.installation_address || "Not specified"}
              />
            </section>

            <section className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-700">Project Timeline</p>
                  <h4 className="mt-1 text-lg font-bold text-slate-900">Installation workflow</h4>
                </div>
                <button type="button" onClick={onAddTimelineStage} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">+ Update Stage</button>
              </div>

              <div className="mt-5 space-y-3">
                {PROJECT_TIMELINE_STAGES.map((stage, index) => {
                  const event = timelineEvents.find((item) => item.stage === stage);
                  const completed = Boolean(event);
                  return (
                    <div key={stage} className="flex items-start gap-3">
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${completed ? "bg-emerald-600 text-white" : "bg-white text-slate-400 border border-slate-200"}`}>
                        {completed ? "✓" : index + 1}
                      </div>
                      <div className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white p-3">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <p className={`font-semibold ${completed ? "text-slate-900" : "text-slate-400"}`}>{stage}</p>
                          {event && <span className="text-xs font-medium text-slate-500">{formatProjectDate(event.stage_date)}</span>}
                        </div>
                        {event?.notes && <p className="mt-1 text-sm text-slate-600">{event.notes}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                    Payments & Billing
                  </p>
                  <h4 className="mt-1 text-lg font-bold text-slate-900">
                    Project payment summary
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={onAddPayment}
                  className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  + Add Payment
                </button>
              </div>

              {(() => {
                const totalCost = project.total_cost ?? project.final_cost ?? project.estimated_cost;
                const amountPaid = payments.reduce(
                  (sum, payment) => sum + Number(payment.amount || 0),
                  0
                );
                const balance =
                  totalCost === null || totalCost === undefined
                    ? null
                    : Math.max(Number(totalCost) - amountPaid, 0);

                return (
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Total Cost
                      </p>
                      <p className="mt-1 text-xl font-bold text-slate-900">
                        {formatProjectCurrency(totalCost)}
                      </p>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Amount Paid
                      </p>
                      <p className="mt-1 text-xl font-bold text-emerald-700">
                        {formatProjectCurrency(amountPaid)}
                      </p>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Balance
                      </p>
                      <p className="mt-1 text-xl font-bold text-amber-700">
                        {formatProjectCurrency(balance)}
                      </p>
                    </div>
                  </div>
                );
              })()}

              <div className="mt-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h4 className="font-bold text-slate-900">Payment History</h4>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                    {payments.length} {payments.length === 1 ? "payment" : "payments"}
                  </span>
                </div>

                {payments.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-emerald-200 bg-white p-5 text-center text-sm font-medium text-slate-500">
                    No payments recorded yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="rounded-xl border border-slate-200 bg-white p-4"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-lg font-bold text-slate-900">
                              {formatProjectCurrency(payment.amount)}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              {formatProjectDate(payment.payment_date)} · {payment.payment_method}
                            </p>
                            {payment.reference && (
                              <p className="mt-1 text-xs text-slate-400">
                                Reference: {payment.reference}
                              </p>
                            )}
                            {payment.notes && (
                              <p className="mt-2 text-sm text-slate-600">
                                {payment.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => onEditPayment(payment)}
                              className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeletePayment(payment)}
                              className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Notes
              </p>
              <div className="mt-2 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                {project.notes || "No notes added for this project."}
              </div>
            </section>

            <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onEdit}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                ✏ Edit Project
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="rounded-xl bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 hover:bg-red-100"
              >
                🗑 Delete Project
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomerDetailsModal({
  customer,
  originalLead,
  assignedStaff,
  onClose,
  onCreateProject,
}: {
  customer: Customer;
  originalLead: Lead | null;
  assignedStaff: Staff | null;
  onClose: () => void;
  onCreateProject: (customerId: number) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center">
        <div className="w-full max-w-4xl rounded-3xl bg-white shadow-2xl">
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                  Customer Details
                </p>
                <h3 className="mt-1 text-2xl font-bold text-slate-950">
                  {customer.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Customer #{customer.id} · Converted {formatCustomerDate(customer.converted_at)}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-2 text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close customer details"
              >
                ×
              </button>
            </div>
          </div>

          <div className="max-h-[75vh] space-y-6 overflow-y-auto p-5 sm:p-6">
            {/* CUSTOMER RECORD */}
            <section>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                    Customer Record
                  </p>
                  <h4 className="mt-1 text-lg font-bold text-slate-900">
                    Contact & requirement details
                  </h4>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                  Converted
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <DetailItem label="Customer ID" value={`#${customer.id}`} />
                <DetailItem
                  label="Phone"
                  value={customer.phone}
                  link={`tel:${customer.phone}`}
                />
                <DetailItem
                  label="Email"
                  value={customer.email || "Not provided"}
                  link={customer.email ? `mailto:${customer.email}` : undefined}
                />
                <DetailItem
                  label="Customer Type"
                  value={customer.customer_type || "Not specified"}
                />
                <DetailItem
                  label="Monthly Bill"
                  value={
                    customer.monthly_bill !== null
                      ? `₹${customer.monthly_bill.toLocaleString("en-IN")}`
                      : "Not specified"
                  }
                />
                <DetailItem
                  label="Location"
                  value={customer.location || "Not provided"}
                />
                <DetailItem
                  label="Source"
                  value={customer.source || "Not specified"}
                />
                <DetailItem
                  label="Converted On"
                  value={formatCustomerDate(customer.converted_at)}
                />
                <DetailItem
                  label="Customer Record Created"
                  value={formatCustomerDate(customer.created_at)}
                />
              </div>

              {customer.message && (
                <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Customer Requirement / Message
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {customer.message}
                  </p>
                </div>
              )}
            </section>

            {/* ASSIGNED STAFF */}
            <section className="rounded-2xl border border-slate-200 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                Assignment
              </p>
              <h4 className="mt-1 text-lg font-bold text-slate-900">
                Assigned Staff
              </h4>

              {assignedStaff ? (
                <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{assignedStaff.name}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {assignedStaff.role} · {assignedStaff.status}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">{assignedStaff.phone}</p>
                    <p className="mt-1 text-sm text-slate-500">{assignedStaff.email}</p>
                  </div>
                  <a
                    href={`tel:${assignedStaff.phone}`}
                    className="rounded-xl bg-emerald-50 px-4 py-3 text-center text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
                  >
                    ☎ Call Staff
                  </a>
                </div>
              ) : (
                <div className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
                  No staff member is currently assigned to this customer.
                </div>
              )}
            </section>

            {/* ORIGINAL LEAD */}
            <section>
              <div className="mb-3">
                <p className="text-xs font-bold uppercase tracking-widest text-violet-600">
                  Original Lead
                </p>
                <h4 className="mt-1 text-lg font-bold text-slate-900">
                  Lead information used for conversion
                </h4>
              </div>

              {originalLead ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <DetailItem label="Lead ID" value={originalLead.id} />
                  <DetailItem
                    label="Lead Created"
                    value={formatCustomerDate(originalLead.created_at)}
                  />
                  <DetailItem
                    label="Lead Status"
                    value={
                      originalLead.status
                        ? originalLead.status.charAt(0).toUpperCase() + originalLead.status.slice(1)
                        : "Not specified"
                    }
                  />
                  <DetailItem
                    label="Original Source"
                    value={originalLead.source || "Not specified"}
                  />
                  <DetailItem
                    label="Next Follow-up"
                    value={formatCustomerDate(originalLead.next_follow_up)}
                  />
                  <DetailItem
                    label="Follow-up Note"
                    value={originalLead.follow_up_note || "No follow-up note"}
                  />
                </div>
              ) : (
                <div className="rounded-2xl bg-amber-50 p-4 text-sm font-medium text-amber-700">
                  The original lead record could not be loaded from the current lead list. The customer record itself is still available.
                </div>
              )}
            </section>

            <div className="border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={() => onCreateProject(customer.id)}
                className="w-full rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-slate-800"
              >
                + Create Solar Project
              </button>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
              <a
                href={`tel:${customer.phone}`}
                className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-700"
              >
                ☎ Call Customer
              </a>
              {customer.email && (
                <a
                  href={`mailto:${customer.email}`}
                  className="flex-1 rounded-xl bg-blue-50 px-4 py-3 text-center text-sm font-semibold text-blue-700 hover:bg-blue-100"
                >
                  ✉ Email Customer
                </a>
              )}
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatCustomerDate(date: string | null) {
  if (!date) return "Not available";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* =====================================================
   LEAD MODAL
===================================================== */

function LeadModal({
  lead,
  updating,
  onClose,
  onStatusChange,
  onFollowUpSave,
  assignmentStaff,
  converting,
  onConvert,
  onAssignmentChange,
}: {
  lead: Lead;
  updating: boolean;
  onClose: () => void;
  onStatusChange: (
    status: LeadStatus
  ) => void;
  onFollowUpSave: (
    note: string,
    date: string
  ) => void;
  assignmentStaff: { id: number; name: string }[];
  converting: boolean;
  onConvert: () => void;
  onAssignmentChange: (staffId: number | null) => void;
}) {
  const [note, setNote] = useState(
    lead.follow_up_note || ""
  );

  const [date, setDate] = useState(
    lead.next_follow_up || ""
  );

  const [status, setStatus] = useState<LeadStatus>(
    lead.status || "new"
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center">
        <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl">
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                  Customer Lead
                </p>

                <h3 className="mt-1 text-2xl font-bold">
                  {lead.name}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Created{" "}
                  {new Date(
                    lead.created_at
                  ).toLocaleDateString("en-IN")}
                </p>
              </div>

              <button
                onClick={onClose}
                className="rounded-xl p-2 text-xl text-slate-400 hover:bg-slate-100"
              >
                ×
              </button>
            </div>
          </div>

          <div className="space-y-6 p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <DetailItem
                label="Phone"
                value={lead.phone}
                link={`tel:${lead.phone}`}
              />

              <DetailItem
                label="Email"
                value={lead.email || "Not provided"}
                link={
                  lead.email
                    ? `mailto:${lead.email}`
                    : undefined
                }
              />

              <DetailItem
                label="Customer Type"
                value={
                  lead.customer_type ||
                  "Not specified"
                }
              />

              <DetailItem
                label="Monthly Bill"
                value={
                  lead.monthly_bill !== null
                    ? `₹${lead.monthly_bill.toLocaleString(
                        "en-IN"
                      )}`
                    : "Not specified"
                }
              />

              <DetailItem
                label="Location"
                value={
                  lead.location ||
                  "Not provided"
                }
              />

              <DetailItem
                label="Lead Source"
                value={
                  lead.source ||
                  "Website"
                }
              />
            </div>

            {lead.message && (
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Customer Message
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {lead.message}
                </p>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Assigned Staff
              </label>

              <select
                value={lead.assigned_staff_id ?? ""}
                disabled={updating}
                onChange={(event) =>
                  onAssignmentChange(
                    event.target.value ? Number(event.target.value) : null
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 disabled:opacity-50"
              >
                <option value="">Unassigned</option>
                {assignmentStaff.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Lead Status
              </label>

              <select
                value={status}
                disabled={updating}
                onChange={(event) => {
                  const value =
                    event.target
                      .value as LeadStatus;

                  setStatus(value);
                  onStatusChange(value);
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
              >
                <option value="new">
                  New
                </option>

                <option value="contacted">
                  Contacted
                </option>

                <option value="converted">
                  Converted
                </option>
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Next Follow-up
                </label>

                <input
                  type="date"
                  value={date}
                  onChange={(event) =>
                    setDate(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Follow-up Note
                </label>

                <input
                  type="text"
                  value={note}
                  onChange={(event) =>
                    setNote(event.target.value)
                  }
                  placeholder="Example: Call tomorrow"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={`tel:${lead.phone}`}
                className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-700"
              >
                ☎ Call Customer
              </a>

              {lead.email && (
                <a
                  href={`mailto:${lead.email}`}
                  className="flex-1 rounded-xl bg-blue-50 px-4 py-3 text-center text-sm font-semibold text-blue-700 hover:bg-blue-100"
                >
                  ✉ Email
                </a>
              )}
            </div>

            {lead.status !== "converted" && (
              <button
                disabled={updating || converting}
                onClick={onConvert}
                className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {converting ? "Converting to Customer..." : "Convert Lead to Customer"}
              </button>
            )}

            {lead.status === "converted" && (
              <div className="rounded-xl bg-emerald-50 px-4 py-3 text-center text-sm font-semibold text-emerald-700">
                ✓ This lead has been converted to a customer
              </div>
            )}

            <div className="flex gap-3 border-t border-slate-100 pt-5">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
              >
                Close
              </button>

              <button
                disabled={updating}
                onClick={() =>
                  onFollowUpSave(note, date)
                }
                className="flex-1 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
              >
                {updating
                  ? "Saving..."
                  : "Save Follow-up"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  label,
  value,
  link,
}: {
  label: string;
  value: string;
  link?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      {link ? (
        <a
          href={link}
          className="mt-1 block break-words text-sm font-semibold text-emerald-600 hover:text-emerald-700"
        >
          {value}
        </a>
      ) : (
        <p className="mt-1 break-words text-sm font-semibold text-slate-700">
          {value}
        </p>
      )}
    </div>
  );
}
