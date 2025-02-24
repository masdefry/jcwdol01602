import { useEffect, useState } from 'react';
import { getApplicantDetails } from '@/services/applicant.service';
import { useRouter } from 'next/router';
import { Applicant } from '@/types/applicant';

const ApplicantDetails = () => {
  const router = useRouter();
  const { applicantId } = router.query;
  const [applicant, setApplicant] = useState<Applicant | null>(null);

  useEffect(() => {
    if (applicantId) {
      getApplicantDetails(applicantId as string).then(setApplicant);
    }
  }, [applicantId]);

  if (!applicant) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">{applicant.user.name}</h1>
      <p>{applicant.user.Profile.education}</p>
      <p>Expected Salary: Rp {applicant.expectedSalary}</p>
    </div>
  );
};

export default ApplicantDetails;
