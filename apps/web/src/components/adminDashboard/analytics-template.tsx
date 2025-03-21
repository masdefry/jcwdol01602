'use client';
import React from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  DobData,
  GenderData,
  LocationData,
  SalaryTrendsData,
  ApplicantInterestsData,
  JobStatsData,
  UserCountsData,
} from '@/types/analytics';

interface AnalyticsTemplateProps {
  dobs: DobData[];
  genders: GenderData[];
  locations: LocationData[];
  salaryTrends: SalaryTrendsData[];
  applicantInterests: ApplicantInterestsData[];
  jobStats: JobStatsData[];
  userCounts: UserCountsData[];
}

const AnalyticsTemplate: React.FC<AnalyticsTemplateProps> = ({
  dobs,
  genders,
  locations,
  salaryTrends,
  applicantInterests,
  jobStats,
  userCounts,
}) => {
  const genderChartData = {
    labels: ['Male', 'Female', 'Unknown'],
    datasets: [
      {
        data: [
          genders.filter((d) => d.gender === 'male').length,
          genders.filter((d) => d.gender === 'female').length,
          genders.filter((d) => !d.gender).length,
        ],
        backgroundColor: [
          'rgba(179, 157, 219, 0.5)',
          'rgba(255, 235, 59, 0.5)',
          'rgba(224, 224, 224, 0.5)',
        ],
        hoverBackgroundColor: [
          'rgba(179, 157, 219, 0.7)',
          'rgba(255, 235, 59, 0.7)',
          'rgba(224, 224, 224, 0.7)',
        ],
      },
    ],
  };

  const salaryTrendsChartData = {
    labels: [] as string[],
    datasets: [
      {
        label: 'Average Expected Salary',
        data: [] as number[],
        backgroundColor: 'rgba(179, 157, 219, 0.2)',
        borderColor: 'rgba(179, 157, 219, 1)',
        borderWidth: 1,
      },
    ],
  };

  const aggregatedSalaryTrends = salaryTrends.reduce((acc, trend) => {
    if (!acc[trend.jobTitle]) {
      acc[trend.jobTitle] = {
        totalSalary: 0,
        count: 0,
      };
    }
    acc[trend.jobTitle].totalSalary += trend.expectedSalary || 0;
    acc[trend.jobTitle].count++;
    return acc;
  }, {} as { [jobTitle: string]: { totalSalary: number; count: number } });

  salaryTrendsChartData.labels = Object.keys(aggregatedSalaryTrends);
  salaryTrendsChartData.datasets[0].data = Object.values(aggregatedSalaryTrends).map(
    (item) => item.totalSalary / item.count
  );

  const applicantInterestsChartData = {
    labels: applicantInterests.map((interest) => interest.jobCategory),
    datasets: [
      {
        data: applicantInterests.map((interest) => interest.applicantCount),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
          'rgba(179, 157, 219, 0.5)',
          'rgba(224, 224, 224, 0.5)',
        ].slice(0, applicantInterests.length),
        hoverBackgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(179, 157, 219, 0.7)',
          'rgba(224, 224, 224, 0.7)',
        ].slice(0, applicantInterests.length),
      },
    ],
  };

  const jobStatsChartData = {
    labels: jobStats.map((job) => job.jobTitle),
    datasets: [
      {
        label: 'Applicant Count',
        data: jobStats.map((job) => job.applicantCount),
        backgroundColor: 'rgba(255, 235, 59, 0.2)',
        borderColor: 'rgba(255, 235, 59, 1)',
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
        borderColor: 'rgb(179, 157, 219)',
        tension: 0.1,
      },
    ],
  };

  const ageChartData = {
    labels: ['18-24', '25-34', '35-44', '45+'],
    datasets: [
      {
        label: "Applicants' age",
        data: [
          dobs.filter((d) => {
            const age = new Date().getFullYear() - new Date(d.dob).getFullYear();
            return age >= 18 && age <= 24;
          }).length,
          dobs.filter((d) => {
            const age = new Date().getFullYear() - new Date(d.dob).getFullYear();
            return age >= 25 && age <= 34;
          }).length,
          dobs.filter((d) => {
            const age = new Date().getFullYear() - new Date(d.dob).getFullYear();
            return age >= 35 && age <= 44;
          }).length,
          dobs.filter((d) => {
            const age = new Date().getFullYear() - new Date(d.dob).getFullYear();
            return age >= 45;
          }).length,
        ],
        backgroundColor: 'rgba(179, 157, 219, 0.2)',
        borderColor: 'rgba(179, 157, 219, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-4 text-gray-700">
      <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Gender Demographics</h2>
          <div style={{ maxWidth: '270px', margin: '0 auto' }}>
            <Pie data={genderChartData} />
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Age Demographics</h2>
          <Bar data={ageChartData} />
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Salary Trends</h2>
          <Bar data={salaryTrendsChartData} />
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Job Post Statistics</h2><Bar data={jobStatsChartData} />
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

export default AnalyticsTemplate;
