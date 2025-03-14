'use client';
import React, { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import {
    DobData,
    GenderData,
    LocationData,
    SalaryTrendsData,
    ApplicantInterestsData,
    JobStatsData,
    UserCountsData,
} from '@/types/analytics';
import useAuthStore from '@/stores/authStores';
import toast from 'react-hot-toast';

Chart.register(...registerables);

const AnalyticsDashboard: React.FC = () => {
    const [dobs, setDobs] = useState<DobData[]>([]);
    const [genders, setGenders] = useState<GenderData[]>([]);
    const [locations, setLocations] = useState<LocationData[]>([]);
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

                const dobsRes = await axiosInstance.get<DobData[]>('/api/analytics/dob');
                setDobs(dobsRes.data);

                const gendersRes = await axiosInstance.get<GenderData[]>('/api/analytics/gender');
                setGenders(gendersRes.data);

                const locationsRes = await axiosInstance.get<LocationData[]>('/api/analytics/location');
                setLocations(locationsRes.data);

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
        labels: ['Male', 'Female'],
        datasets: [
            {
                data: [
                    genders.filter((d) => d.gender === 'male').length,
                    genders.filter((d) => d.gender === 'female').length,
                    genders.filter((d) => !d.gender).length,
                ],
                backgroundColor: ['rgba(54, 162, 235, 0.5)', 'rgba(255, 99, 132, 0.5)', 'rgba(255, 206, 86, 0.5)'],
                hoverBackgroundColor: ['rgba(54, 162, 235, 0.7)', 'rgba(255, 99, 132, 0.7)', 'rgba(255, 206, 86, 0.7)'],
            },
        ],
    };

    const salaryTrendsChartData = {
        labels: [] as string[],
        datasets: [
            {
                label: 'Average Expected Salary',
                data: [] as number[],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
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
                    'rgba(54, 162, 235, 0.5)', 'rgba(255, 99, 132, 0.5)', 'rgba(255, 206, 86, 0.5)'
                ],
                hoverBackgroundColor: [
                    'rgba(54, 162, 235, 0.7)', 'rgba(255, 99, 132, 0.7)', 'rgba(255, 206, 86, 0.7)'
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

    // const locationChartData = {
    //     labels: [...new Set(locations.map((d) => d.location).filter(location => location))],
    //     datasets: [
    //         {
    //             data: [...new Set(locations.map((d) => d.location).filter(location => location))].map((location) =>
    //                 locations.filter((d) => d.location === location).length
    //             ),
    //             backgroundColor: [
    //                 '#FF6384',
    //                 '#36A2EB',
    //                 '#FFCE56',
    //                 '#2ecc71',
    //                 '#9b59b6',
    //                 '#e67e22',
    //                 '#34495e',
    //             ],
    //             hoverBackgroundColor: [
    //                 '#FF6384',
    //                 '#36A2EB',
    //                 '#FFCE56',
    //                 '#2ecc71',
    //                 '#9b59b6',
    //                 '#e67e22',
    //                 '#34495e',
    //             ],
    //         },
    //     ],
    // };

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
                    dobs.filter((d) => {const age = new Date().getFullYear() - new Date(d.dob).getFullYear();
                      return age >= 35 && age <= 44;
                  }).length,
                  dobs.filter((d) => {
                      const age = new Date().getFullYear() - new Date(d.dob).getFullYear();
                      return age >= 45;
                  }).length,
              ],
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
          },
      ],
  };

  return (
      <div className="p-4">
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

              {/* <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-2">Location Demographics</h2>
                  <Pie data={locationChartData} />
              </div> */}


          </div>
      </div>
  );
};

export default AnalyticsDashboard;
