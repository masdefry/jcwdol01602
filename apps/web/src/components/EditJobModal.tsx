import { useState } from "react";
import axios from "axios";
import { Job } from "@/types/job";

interface EditJobModalProps {
  job: Job;
  onClose: () => void;
  onUpdate: () => void;
}

const EditJobModal: React.FC<EditJobModalProps> = ({ job, onClose, onUpdate }) => {
  const [formData, setFormData] = useState(job);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/jobs/${job.id}`, formData);
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Failed to update job:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Edit Job</h2>
        <form onSubmit={handleSubmit}>
          <input className="border p-2 w-full mb-2" name="title" value={formData.title} onChange={handleChange} />
          <input className="border p-2 w-full mb-2" name="category" value={formData.category} onChange={handleChange} />
          <input className="border p-2 w-full mb-2" name="location" value={formData.location} onChange={handleChange} />
          <textarea className="border p-2 w-full mb-2" name="description" value={formData.description} onChange={handleChange} />
          <button className="bg-blue-500 text-white px-4 py-2 rounded w-full" type="submit">Update</button>
          <button className="ml-2 bg-gray-500 text-white px-4 py-2 rounded w-full" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default EditJobModal;
