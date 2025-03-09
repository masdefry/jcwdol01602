'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import {
  DemographicsData,
  SalaryTrendsData,
  ApplicantInterestsData,
  JobStatsData,
  UserCountsData,
} from '@/types/analytics';

Chart.register(...registerables);

const AnalyticsDashboard: React.FC = () => {
  const [demographics, setDemographics] = useState<DemographicsData[]>([]);
  const [salaryTrends, setSalaryTrends] = useState<SalaryTrendsData[]>([]);
  const [applicantInterests, setApplicantInterests] = useState<ApplicantInterestsData[]>([]);
  const [jobStats, setJobStats] = useState<JobStatsData[]>([]);
  const [userCounts, setUserCounts] = useState<UserCountsData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const demographicsRes = await axios.get<DemographicsData[]>('/api/analytics/demographics', { headers });
        setDemographics(demographicsRes.data);

        const salaryTrendsRes = await axios.get<SalaryTrendsData[]>('/api/analytics/salary-trends', { headers });
        setSalaryTrends(salaryTrendsRes.data);

        const applicantInterestsRes = await axios.get<ApplicantInterestsData[]>('/api/analytics/applicant-interests', { headers });
        setApplicantInterests(applicantInterestsRes.data);

        const jobStatsRes = await axios.get<JobStatsData[]>('/api/analytics/job-stats', { headers });
        setJobStats(jobStatsRes.data);

        const userCountsRes = await axios.get<UserCountsData[]>('/api/analytics/new-users', { headers });
        setUserCounts(userCountsRes.data);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally{
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  const demographicsChartData = {
    labels: ['Male', 'Female', 'Unknown'],
    datasets: [
      {
        data: [
          demographics.filter((d) => d.gender === 'MALE').length,
          demographics.filter((d) => d.gender === 'FEMALE').length,
          demographics.filter((d) => !d.gender).length,
        ],
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
      },
    ],
  };

  const salaryTrendsChartData = {
    labels: salaryTrends.map((trend) => trend.jobTitle),
    datasets: [
      {
        label: 'Expected Salary',
        data: salaryTrends.map((trend) => trend.expectedSalary),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const applicantInterestsChartData = {
    labels: applicantInterests.map((interest) => interest.jobCategory),
    datasets: [
      {
        data: applicantInterests.map((interest) => interest.applicantCount),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#2ecc71',
          '#9b59b6',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#2ecc71',
          '#9b59b6',
        ],
      },
    ],
  };

  const jobStatsChartData = {
    labels: jobStats.map((job) => job.jobTitle),
    datasets: [
      {
        label: 'Applicant Count',
        data: jobStats.map((job) => job.applicantCount),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const userCountsChartData = {
    labels: userCounts.map((user) => user.month),
    datasets: [{
      label: 'New Users',
      data: userCounts.map((user) => user.userCount),
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">User Demographics</h2>
        <Pie data={demographicsChartData} />
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Salary Trends</h2>
        <Bar data={salaryTrendsChartData} />
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Applicant Interests</h2>
        <Pie data={applicantInterestsChartData} />
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Job Post Statistics</h2>
        <Bar data={jobStatsChartData} />
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">New Users Per Month</h2>
        <Line data={userCountsChartData} />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
