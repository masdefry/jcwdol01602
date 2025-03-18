'use client';
import ButtonCustom from '@/components/button/btn';
import { styles } from '@/components/cv/cvGenStyle';
import useUserSubsData from '@/hooks/userSubsData';
import axiosInstance from '@/lib/axios';
import { ISubsData } from '@/lib/interface';
import { capitalizeFirstLetter } from '@/lib/stringFormat';
import useAuthStore, { IAccount } from '@/stores/authStores';
import {
  Page,
  Text,
  View,
  Document,
  PDFViewer,
  PDFDownloadLink,
  pdf,
} from '@react-pdf/renderer';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const CVGenerator = () => {
  const { account } = useAuthStore();
  const { subsData } = useUserSubsData();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const CVDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.profile}>
          <Text style={[styles.title, styles.textBold]}>{account?.name}</Text>
          <Text>
            {account?.email} | {subsData?.userProfile.address}
          </Text>
          {!subsData?.userProfile.phoneNumber ? (
            ''
          ) : (
            <Text>{subsData.userProfile.phoneNumber}</Text>
          )}
        </View>
        <View>
          <Text style={[styles.title, styles.textBold]}>Work Experience</Text>
          {subsData?.worker &&
            subsData.worker.map((work, idx) => (
              <View key={idx} style={styles.card}>
                <Text style={styles.textBold}>{work.companyName}</Text>
                <View style={styles.cardTitle}>
                  <Text>{work.position}</Text>
                  <View style={styles.cardFlexRow}>
                    <Text>
                      {new Date(work.startDate).toLocaleDateString()}{' '}
                    </Text>
                    <Text>- </Text>
                    {!work.endDate ? (
                      <Text>Now</Text>
                    ) : (
                      <Text>{new Date(work.endDate).toLocaleDateString()}</Text>
                    )}
                  </View>
                </View>
                <Text>{work.description}</Text>
              </View>
            ))}
          <Text style={[styles.title, styles.textBold]}>Education</Text>
          {subsData?.userEdu &&
            subsData.userEdu.map((edu, idx) => (
              <View key={idx} style={styles.card}>
                <Text style={styles.textBold}>{edu.school}</Text>
                <View style={styles.cardTitle}>
                  <View style={styles.cardFlexRow}>
                    <Text>{capitalizeFirstLetter(edu.level)} of </Text>
                    <Text>{edu.discipline}</Text>
                  </View>
                  <View style={styles.cardFlexRow}>
                    <Text>{new Date(edu.startDate).toLocaleDateString()} </Text>
                    <Text>- </Text>
                    {!edu.endDate ? (
                      <Text>Now</Text>
                    ) : (
                      <Text>{new Date(edu.endDate).toLocaleDateString()}</Text>
                    )}
                  </View>
                </View>
                <Text>{edu.description}</Text>
              </View>
            ))}
          <Text style={[styles.title, styles.textBold]}>Skills</Text>
          {subsData?.userSkill &&
            subsData.userSkill.map((data, idx) => (
              <View key={idx}>
                <Text>- {data.skill.name}</Text>
              </View>
            ))}
        </View>
      </Page>
    </Document>
  );

  const handleUploadCV = async () => {
    setLoading(true);
    const doc = <CVDocument />;

    try {
      const blob = await pdf(doc).toBlob();
      const formData = new FormData();
      formData.append('file', blob, 'CV.pdf');
      const { data } = await axiosInstance.post('/api/cv/upload', formData);
      toast.success(data.message);
      setTimeout(() => router.push('/user-data/cv'), 1500);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Something went wrong!';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2">
      <div className="mb-2 bg-gradient-to-br from bg-fuchsia-500 to-purple-500 p-2 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-white">CV Generator</h1>
      </div>
      {account && (
        <div className="w-full mx-auto">
          <div className="w-full h-[500px]">
            <PDFViewer width="100%" height="100%">
              <CVDocument />
            </PDFViewer>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center my-2">
        <PDFDownloadLink document={<CVDocument />} fileName="CV.pdf">
          <button className="bg-blue-400 rounded-lg p-2">Download</button>
        </PDFDownloadLink>
        <div>
          <ButtonCustom
            btnName="Upload CV"
            onClick={handleUploadCV}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default CVGenerator;
