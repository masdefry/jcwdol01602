'use client';
import React, { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import {
  DemographicsData,
  SalaryTrendsData,
  ApplicantInterestsData,
  JobStatsData,
  UserCountsData,
} from '@/types/analytics';
import useAuthStore from '@/stores/authStores';
import toast from 'react-hot-toast';

Chart.register(...registerables);

const AnalyticsDashboard: React.FC = () => {
  const [demographics, setDemographics] = useState<DemographicsData[]>([]);
  const [salaryTrends, setSalaryTrends] = useState<SalaryTrendsData[]>([]);
  const [applicantInterests, setApplicantInterests] = useState<ApplicantInterestsData[]>([]);
  const [jobStats, setJobStats] = useState<JobStatsData[]>([]);
  const [userCounts, setUserCounts] = useState<UserCountsData[]>([]);
  const [loading, setLoading] = useState(true);
  const account = useAuthStore((state) => state.account);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!account || !account.id) {
          setLoading(false);
          toast.error('User not authenticated.');
          return;
        }

        const demographicsRes = await axiosInstance.get<DemographicsData[]>('/api/analytics/demographics');
        setDemographics(demographicsRes.data);

        const salaryTrendsRes = await axiosInstance.get<SalaryTrendsData[]>('/api/analytics/salary');
        setSalaryTrends(salaryTrendsRes.data);

        const applicantInterestsRes = await axiosInstance.get<ApplicantInterestsData[]>('/api/analytics/interests');
        setApplicantInterests(applicantInterestsRes.data);

        const jobStatsRes = await axiosInstance.get<JobStatsData[]>('/api/analytics/jobpost');
        setJobStats(jobStatsRes.data);

        const userCountsRes = await axiosInstance.get<UserCountsData[]>('/api/analytics/newuser');
        setUserCounts(userCountsRes.data);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        const errorMessage = error.response?.data?.message || 'Failed to fetch analytics data.';
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [account]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  const genderChartData = {
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

//  const locationChartData = {
//   labels: [...new Set(demographics.map((d) => d.location).filter(location => location))],
//   datasets: [
//     {
//       data: [...new Set(demographics.map((d) => d.location).filter(location => location))].map((location) =>
//         demographics.filter((d) => d.location === location).length
//       ),
//       backgroundColor: [
//         '#FF6384',
//         '#36A2EB',
//         '#FFCE56',
//         '#2ecc71',
//         '#9b59b6',
//         '#e67e22',
//         '#34495e',
//       ],
//       hoverBackgroundColor: [
//         '#FF6384',
//         '#36A2EB',
//         '#FFCE56',
//         '#2ecc71',
//         '#9b59b6',
//         '#e67e22',
//         '#34495e',
//       ],
//     },
//   ],
// };

// const ageChartData = {
//   labels: ['18-24', '25-34', '35-44', '45+'],
//   datasets: [
//     {
//       data: [
//         demographics.filter((d) => d.age != null && d.age >= 18 && d.age <= 24).length,
//         demographics.filter((d) => d.age != null && d.age >= 25 && d.age <= 34).length,
//         demographics.filter((d) => d.age != null && d.age >= 35 && d.age <= 44).length,
//         demographics.filter((d) => d.age != null && d.age >= 45).length,
//       ],
//       backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#2ecc71'],
//       hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#2ecc71'],
//     },
//   ],
// };

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
    datasets: [
      {
        label: 'New Users',
        data: userCounts.map((user) => user.userCount),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Gender Demographics</h2>
          <Pie data={genderChartData} />
        </div>

        {/* <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Location Demographics</h2>
          <Pie data={locationChartData} />
        </div> */}

        {/* <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Age Demographics</h2>
          <Pie data={ageChartData} />
        </div> */}

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Salary Trends</h2>
          <Bar data={salaryTrendsChartData} />
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Job Post Statistics</h2>
          <Bar data={jobStatsChartData} />
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Applicant Interests</h2>
          <div style={{ maxWidth: '270px', margin: '0 auto' }}>
          <Pie data={applicantInterestsChartData} />
          </div>
        </div>


        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">New Users Per Month</h2>
          <Line data={userCountsChartData} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
