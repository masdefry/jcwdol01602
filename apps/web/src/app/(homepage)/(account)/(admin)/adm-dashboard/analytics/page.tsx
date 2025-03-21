'use client';
import React, { useState, useEffect } from 'react';
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
import { fetchAnalyticsData } from '@/services/analytics.service';
import AnalyticsTemplate from '@/components/adminDashboard/analytics-template';

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

        const {
          dobs: fetchedDobs,
          genders: fetchedGenders,
          locations: fetchedLocations,
          salaryTrends: fetchedSalaryTrends,
          applicantInterests: fetchedApplicantInterests,
          jobStats: fetchedJobStats,
          userCounts: fetchedUserCounts,
        } = await fetchAnalyticsData(account.id);

        setDobs(fetchedDobs);
        setGenders(fetchedGenders);
        setLocations(fetchedLocations);
        setSalaryTrends(fetchedSalaryTrends);
        setApplicantInterests(fetchedApplicantInterests);
        setJobStats(fetchedJobStats);
        setUserCounts(fetchedUserCounts);
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Failed to fetch analytics data.';
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [account]);

  if (loading) {
    return <div className="p-4 text-gray-700">Loading...</div>;
  }

  return (
    <AnalyticsTemplate
      dobs={dobs}
      genders={genders}
      locations={locations}
      salaryTrends={salaryTrends}
      applicantInterests={applicantInterests}
      jobStats={jobStats}
      userCounts={userCounts}
    />
  );
};

export default AnalyticsDashboard;
