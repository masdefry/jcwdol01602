"use client";

import React, { useState, useEffect } from "react";
import {
  fetchApplicantsByCompany,
  createSchedule,
} from "@/services/interview.service";
import useAuthStore from "@/stores/authStores";
import TableDashboard from "@/components/table/table";
import { Heading } from "@/components/heading";
import toast from "react-hot-toast";
import ModalCreate from "@/components/table/modalCreate";
import * as Yup from "yup";
import ButtonCustom from "@/components/button/btn";

interface InterviewSchedule {
  id: string;
  applicantId: string;
  startTime: Date;
  endTime: Date;
  location: string | null;
  notes: string | null;
}

interface ApplicantSchedule {
  id: string;
  applicantId: string;
  jobId: string;
  InterviewSchedule: InterviewSchedule[] | undefined | null;
  subsData: {
    accounts: {
      name: string;
      email: string;
      avatar?: string;
    };
  };
  job: {
    title: string;
  };
}

interface IApplicantData {
  name: string;
  email: string;
  jobTitle: string;
  schedule: string;
  action: JSX.Element;
  id: string;
}

function InterviewScheduleFrontend() {
  const [applicantSchedules, setApplicantSchedules] = useState<
    ApplicantSchedule[] | undefined
  >(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(null);

  const compaccount = useAuthStore((state) => state.account);

  useEffect(() => {
    if (compaccount?.id) {
      loadApplicants(compaccount.id);
    } else {
      setLoading(false);
    }
  }, [compaccount?.id]);

  const loadApplicants = async (companyId: string) => {
    setLoading(true);
    try {
      const applicants = await fetchApplicantsByCompany(companyId);
      setApplicantSchedules(applicants);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch applicants.";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (applicantId: string) => {
    setSelectedApplicantId(applicantId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedApplicantId(null);
  };

  const tableData: IApplicantData[] = applicantSchedules
    ? applicantSchedules.map((applicantSchedule) => ({
        id: applicantSchedule.id,
        name: applicantSchedule.subsData.accounts.name,
        email: applicantSchedule.subsData.accounts.email,
        jobTitle: applicantSchedule.job.title, // Use job.title
        schedule:
          applicantSchedule.InterviewSchedule &&
          applicantSchedule.InterviewSchedule.length > 0
            ? new Date(applicantSchedule.InterviewSchedule[0].startTime).toLocaleString()
            : "Not Scheduled",
        action: (
          <ButtonCustom
            onClick={() => handleOpenModal(applicantSchedule.id)}

            btnName="Create Schedule"
          />
        ),
      }))
    : [];

  const initialValues = {
    startTime: "",
    endTime: "",
    location: "",
    notes: "",
  };

  const validationSchema = Yup.object().shape({
    startTime: Yup.date().required("Start time is required"),
    endTime: Yup.date()
      .required("End time is required")
      .min(Yup.ref("startTime"), "End time must be after start time"),
    location: Yup.string(),
    notes: Yup.string(),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    if (!selectedApplicantId) {
      toast.error("Applicant ID is missing.");
      return;
    }

    try {
      await createSchedule(
        selectedApplicantId,
        new Date(values.startTime),
        new Date(values.endTime),
        values.location,
        values.notes
      );
      toast.success("Schedule created successfully.");
      loadApplicants(compaccount?.id as string);
      handleCloseModal();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create schedule.");
    }
  };
  const fields = [
    { name: "startTime", label: "Start Time", type: "datetime-local" },
    { name: "endTime", label: "End Time", type: "datetime-local" },
    { name: "location", label: "Location", type: "text" },
    { name: "notes", label: "Notes", type: "textarea" },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <Heading title="Interview Schedules" description="Manage all interview schedules" />
      </div>
      {loading ? (
        <p>Loading Schedules...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <TableDashboard
          columns={["No", "Name", "Email", "Job Title", "Schedule", "Action"]}
          datas={tableData}
          itemsPerPage={5}
        />
      )}

      <ModalCreate
        title="Create Interview Schedule"
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        disabled={false}
        fields={fields}
      />
    </div>
  );
}

export default InterviewScheduleFrontend;
