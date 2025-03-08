import { useEffect } from 'react';
import { useApplicantStore } from '@/stores/applicantStore';
import ApplicantItem from './ApplicantItem';
import FilterBar from '../FilterBar';

interface Props {
  jobId: string;
}

const ApplicantList: React.FC<Props> = ({ jobId }) => {
  const { applicants, fetchApplicants } = useApplicantStore();

  useEffect(() => {
    fetchApplicants(jobId);
  }, [jobId]);

  return (
    <div className="p-4">
      <FilterBar jobId={jobId} />
      <div className="mt-4 grid gap-4">
        {applicants.map((applicant) => (
          <ApplicantItem key={applicant.id} applicant={applicant} />
        ))}
      </div>
    </div>
  );
};

export default ApplicantList;
