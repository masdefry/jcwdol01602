'use client';
import { useParams } from 'next/navigation';
import React from 'react';

const JobDetailPage = () => {
  const { jobId } = useParams();
  return <div>JobDetailPage for id : {jobId}</div>;
};

export default JobDetailPage;
