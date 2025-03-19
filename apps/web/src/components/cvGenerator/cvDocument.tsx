import { styles } from '@/app/(homepage)/testingPage/cvTest/style';
import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import useUserSubsData from '@/hooks/userSubsData';
import useAuthStore from '@/stores/authStores';

const CVDocument = () => {
  const { account } = useAuthStore();
  const { subsData } = useUserSubsData();
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, styles.textBold]}>{account?.name}</Text>
            <Text>Invice #INV-2024-001</Text>
          </View>
          <View style={styles.spaceY}>
            <Text style={styles.textBold}>Company Name</Text>
            <Text>123 Busineness Park</Text>
            <Text>City, State 12345</Text>
          </View>
        </View>
        <View style={styles.spaceY}>
          <Text style={[styles.billTo, styles.textBold]}>Bill To:</Text>
          <Text>Client Name</Text>
          <Text>Client Address</Text>
          <Text>City, State ZIP</Text>
        </View>

        {/* Render The Table */}
      </Page>
    </Document>
  );
};

export default CVDocument;
