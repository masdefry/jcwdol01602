import React, { useState } from 'react';
import JobList from '../../../../../components/JobList';
import JobForm from '../../../../../components/JobForm';

const AdminDashboard: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (id: string) => {
    setSelectedJob(id);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setSelectedJob(null);
    setShowForm(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Job Management Dashboard</h1>
      <button onClick={() => setShowForm(true)} className="mb-4 px-4 py-2 bg-green-500 text-white rounded">
        + Add Job
      </button>
      {showForm && <JobForm jobData={selectedJob} onSuccess={handleSuccess} />}
      <JobList onEdit={handleEdit} />
    </div>
  );
};

export default AdminDashboard;
