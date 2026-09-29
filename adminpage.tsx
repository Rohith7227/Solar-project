"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type LeadStatus = "new" | "contacted" | "converted";

type Lead = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  customer_type: string | null;
  monthly_bill: number | null;
  location: string | null;
  message: string | null;
  source: string | null;
  status: LeadStatus | null;
  created_at: string;
};

export default function AdminDashboard() {
    const router = useRouter();
    
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const [statusFilter, setStatusFilter] = useState<
  "all" | LeadStatus
>("all");

  useEffect(() => {
    async function fetchLeads() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setLeads(data || []);
      setLoading(false);
    }

    fetchLeads();
  }, []);
  async function handleLogout() {
  const supabase = createClient();

  await supabase.auth.signOut();

  router.push("/admin/login");
  router.refresh();
}
  // Change lead status and save it to Supabase
  async function updateLeadStatus(
    leadId: number,
    newStatus: LeadStatus
  ) {
    setUpdatingId(leadId);
    setError("");

    const supabase = createClient();

    const { error } = await supabase
      .from("leads")
      .update({ status: newStatus })
      .eq("id", leadId);

    if (error) {
      setError(`Unable to update status: ${error.message}`);
      setUpdatingId(null);
      return;
    }

    // Update the lead on the screen immediately
    setLeads((currentLeads) =>
      currentLeads.map((lead) =>
        lead.id === leadId
          ? { ...lead, status: newStatus }
          : lead
      )
    );

    setUpdatingId(null);
  }

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

  const filteredLeads =
  statusFilter === "all"
    ? leads
    : leads.filter(
        (lead) => lead.status === statusFilter
      );

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  <div>
    <h1 className="text-3xl font-bold text-gray-900">
      Solar Admin Dashboard
    </h1>

    <p className="mt-2 text-gray-600">
      Manage your solar enquiries and customers.
    </p>
  </div>

  <button
    onClick={handleLogout}
    className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
  >
    Logout
  </button>
</div>
        {/* Dashboard Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          {/* Total Leads */}
          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-500">
              Total Leads
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              {totalLeads}
            </h2>
          </div>

          {/* New Leads */}
          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-500">
              New Leads
            </p>

            <h2 className="mt-2 text-3xl font-bold text-blue-600">
              {newLeads}
            </h2>
          </div>

          {/* Contacted */}
          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-500">
              Contacted
            </p>

            <h2 className="mt-2 text-3xl font-bold text-yellow-600">
              {contactedLeads}
            </h2>
          </div>

          {/* Converted */}
          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-500">
              Converted
            </p>

            <h2 className="mt-2 text-3xl font-bold text-green-600">
              {convertedLeads}
            </h2>
          </div>

        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-8 rounded-xl bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

{/* Status Filters */}
<div className="mt-8 rounded-xl bg-white p-4 shadow">
  <div className="flex flex-wrap gap-3">

    <button
      onClick={() => setStatusFilter("all")}
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
        statusFilter === "all"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      All Leads ({totalLeads})
    </button>

    <button
      onClick={() => setStatusFilter("new")}
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
        statusFilter === "new"
          ? "bg-blue-600 text-white"
          : "bg-blue-50 text-blue-700 hover:bg-blue-100"
      }`}
    >
      New ({newLeads})
    </button>

    <button
      onClick={() => setStatusFilter("contacted")}
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
        statusFilter === "contacted"
          ? "bg-yellow-500 text-white"
          : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
      }`}
    >
      Contacted ({contactedLeads})
    </button>

    <button
      onClick={() => setStatusFilter("converted")}
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
        statusFilter === "converted"
          ? "bg-green-600 text-white"
          : "bg-green-50 text-green-700 hover:bg-green-100"
      }`}
    >
      Converted ({convertedLeads})
    </button>

  </div>
</div>
        {/* Leads Table */}
        <div className="mt-8 overflow-hidden rounded-xl bg-white shadow">

          <div className="border-b p-6">
            <h2 className="text-xl font-bold text-gray-900">
              Recent Solar Enquiries
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Customer enquiries submitted through your website.
            </p>
          </div>

          {loading ? (
            <div className="p-6 text-gray-500">
              Loading enquiries...
            </div>
          ) : filteredleads.length === 0 ? (
            <div className="p-6 text-gray-500">
              No enquiries found.
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="min-w-full text-left text-sm">

                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 font-semibold">
                      Name
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Phone
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Customer Type
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Monthly Bill
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Location
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Status
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">

                  {filteredleads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-gray-50"
                    >
<td className="px-6 py-4">
  <button
    onClick={() => setSelectedLead(lead)}
    className="font-semibold text-blue-600 hover:text-blue-800 hover:underline"
  >
    {lead.name}
  </button>
</td>

                      <td className="px-6 py-4">
                        {lead.phone}
                      </td>

                      <td className="px-6 py-4">
                        {lead.customer_type || "-"}
                      </td>

                      <td className="px-6 py-4">
                        {lead.monthly_bill
                          ? `₹${lead.monthly_bill}`
                          : "-"}
                      </td>

                      <td className="px-6 py-4">
                        {lead.location || "-"}
                      </td>

                      {/* Editable Status */}
                      <td className="px-6 py-4">
                        <select
                          value={lead.status || "new"}
                          disabled={updatingId === lead.id}
                          onChange={(event) =>
                            updateLeadStatus(
                              lead.id,
                              event.target.value as LeadStatus
                            )
                          }
                          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:opacity-50"
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

                        {updatingId === lead.id && (
                          <span className="ml-2 text-xs text-gray-500">
                            Saving...
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-gray-500">
                        {new Date(
                          lead.created_at
                        ).toLocaleDateString()}
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>

      {/* Customer Details Popup */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Popup Header */}
            <div className="flex items-center justify-between border-b p-6">

              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Customer Details
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Complete solar enquiry information
                </p>
              </div>

              <button
                onClick={() => setSelectedLead(null)}
                className="rounded-lg px-3 py-2 text-2xl text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              >
                ×
              </button>

            </div>

            {/* Customer Information */}
            <div className="grid gap-5 p-6 sm:grid-cols-2">

              <div>
                <p className="text-sm text-gray-500">
                  Customer Name
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {selectedLead.name}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Phone
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {selectedLead.phone}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Email
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {selectedLead.email || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Customer Type
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {selectedLead.customer_type || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Monthly Electricity Bill
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {selectedLead.monthly_bill
                    ? `₹${selectedLead.monthly_bill}`
                    : "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Location
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {selectedLead.location || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Status
                </p>

                <p className="mt-1 font-semibold capitalize text-gray-900">
                  {selectedLead.status || "new"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Enquiry Date
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {new Date(
                    selectedLead.created_at
                  ).toLocaleString()}
                </p>
              </div>

              {/* Message */}
              <div className="sm:col-span-2">
                <p className="text-sm text-gray-500">
                  Customer Message
                </p>

                <div className="mt-2 rounded-lg bg-gray-50 p-4 text-gray-800">
                  {selectedLead.message || "No message provided."}
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="flex flex-wrap justify-end gap-3 border-t bg-gray-50 p-6">

              <a
                href={`tel:${selectedLead.phone}`}
                className="rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
              >
                Call Customer
              </a>

              {selectedLead.email && (
                <a
                  href={`mailto:${selectedLead.email}`}
                  className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Email
                </a>
              )}

              <button
                onClick={() => setSelectedLead(null)}
                className="rounded-lg border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}
