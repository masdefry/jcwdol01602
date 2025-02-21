// import Link from 'next/link';
// import { useState } from 'react';
// import api from '@/utils/api';
// import { Applicant } from '@/types/applicant';

// interface Props {
//   applicant: Applicant;
// }

// const ApplicantItem: React.FC<Props> = ({ applicant }) => {
//   const [status, setStatus] = useState(applicant.status);

//   const updateStatus = async (newStatus: string) => {
//     try {
//       await api.patch(`/applicants/${applicant.id}/status`, { status: newStatus });
//       setStatus(newStatus);
//       alert('Status updated successfully!');
//     } catch (error) {
//       console.error('Error updating status:', error);
//     }
//   };

//   return (
//     <div className="border p-4 rounded-lg flex items-center justify-between">
//       <div className="flex items-center gap-4">
//         <img src={applicant.user.avatar || '/default-avatar.png'} alt="Avatar" className="w-12 h-12 rounded-full" />
//         <div>
//           <p className="font-semibold">{applicant.user.name}</p>
//           <p className="text-sm text-gray-500">{applicant.user.Profile.education}</p>
//         </div>
//       </div>
//       <div className="flex items-center gap-4">
//         <span className="text-green-600 font-bold">Rp {applicant.expectedSalary}</span>
//         <Link href={`/applicants/details/${applicant.id}`} className="text-blue-600">
//           View Details
//         </Link>
//         <select
//           className="border p-2 rounded"
//           value={status}
//           onChange={(e) => updateStatus(e.target.value)}
//         >
//           <option value="pending">Pending</option>
//           <option value="interview">Interview</option>
//           <option value="accepted">Accepted</option>
//           <option value="rejected">Rejected</option>
//         </select>
//       </div>
//     </div>
//   );
// };

// export default ApplicantItem;
