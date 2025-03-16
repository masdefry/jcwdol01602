import axiosInstance from '@/lib/axios';
import {
    DobData,
    GenderData,
    LocationData,
    SalaryTrendsData,
    ApplicantInterestsData,
    JobStatsData,
    UserCountsData,
} from '@/types/analytics';

export const fetchAnalyticsData = async (accountId: string) => {
    const dobsRes = await axiosInstance.get<DobData[]>('/api/analytics/dob');
    const gendersRes = await axiosInstance.get<GenderData[]>('/api/analytics/gender');
    const locationsRes = await axiosInstance.get<LocationData[]>('/api/analytics/location');
    const salaryTrendsRes = await axiosInstance.get<SalaryTrendsData[]>('/api/analytics/salary');
    const applicantInterestsRes = await axiosInstance.get<ApplicantInterestsData[]>('/api/analytics/interests');
    const jobStatsRes = await axiosInstance.get<JobStatsData[]>('/api/analytics/jobpost');
    const userCountsRes = await axiosInstance.get<UserCountsData[]>('/api/analytics/newuser');

    return {
        dobs: dobsRes.data,
        genders: gendersRes.data,
        locations: locationsRes.data,
        salaryTrends: salaryTrendsRes.data,
        applicantInterests: applicantInterestsRes.data,
        jobStats: jobStatsRes.data,
        userCounts: userCountsRes.data,
    };
};
