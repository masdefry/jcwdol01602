import React from 'react';
import Modal from './applicantModal';
import { Applicant } from '@/types/applicantDetail';
import { format } from 'date-fns';
import { rupiahFormat } from '@/lib/stringFormat';

interface ApplicantDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicant: Applicant;
}

const ApplicantDetailModal: React.FC<ApplicantDetailModalProps> = ({
  isOpen,
  onClose,
  applicant,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-4">
        <div className="flex flex-col md:flex-row">
          {applicant.cvPath && (
            <div className="md:w-1/2 md:pr-4 mb-4 md:mb-0">
              <iframe src={applicant.cvPath} width="100%" height="500px"></iframe>
            </div>
          )}
          <div className="md:w-1/2">
            <table className="w-full table-auto">
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="font-semibold pr-4 py-2 text-left">Name:</td>
                  <td className="py-2 text-left">{applicant.subsData.accounts.name}</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-4 py-2 text-left">Email:</td>
                  <td className="py-2 text-left">{applicant.subsData.accounts.email}</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-4 py-2 text-left">Gender:</td>
                  <td className="py-2 text-left">{applicant.subsData.userProfile?.gender}</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-4 py-2 text-left">Birthdate:</td>
                  <td className="py-2 text-left">
                    {applicant.subsData.userProfile?.dob
                      ? format(new Date(applicant.subsData.userProfile.dob), 'yyyy-MM-dd')
                      : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold pr-4 py-2 text-left">Place of Birth:</td>
                  <td className="py-2 text-left">{applicant.subsData.userProfile?.pob}</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-4 py-2 text-left">Phone:</td>
                  <td className="py-2 text-left">{applicant.subsData.userProfile?.phoneNumber}</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-4 py-2 text-left">Education:</td>
                  <td className="py-2 text-left">{applicant.subsData.userEdu[0]?.level || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-4 py-2 text-left">University:</td>
                  <td className="py-2 text-left">{applicant.subsData.userEdu[0]?.school || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-4 py-2 text-left">Discipline:</td>
                  <td className="py-2 text-left">{applicant.subsData.userEdu[0]?.discipline || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-4 py-2 text-left">Expected Salary:</td>
                  <td className="py-2 text-left">{rupiahFormat(applicant.expectedSalary)}</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-4 py-2 text-left">Status:</td>
                  <td className="py-2 text-left">{applicant.status}</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-4 py-2 text-left">Preselection Test Result:</td>
                  <td className="py-2 text-left">
                    {applicant.PreSelectionTestResult && applicant.PreSelectionTestResult.length > 0
                      ? applicant.PreSelectionTestResult.score
                      : 'N/A'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ApplicantDetailModal;
