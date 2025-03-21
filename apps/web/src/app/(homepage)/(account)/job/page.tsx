'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const JobDetail = () => {
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');
  const companyId = searchParams.get('companyId');

  useEffect(() => {
    console.log('Job ID:', jobId);
    console.log('Company ID:', companyId);
  }, [jobId, companyId]);
  return (
    <div>
      <h1>Job Detail Page</h1>
      <p>Job ID: {jobId}</p>
      <p>Company ID: {companyId}</p>
    </div>
  );
};

export default JobDetail;
