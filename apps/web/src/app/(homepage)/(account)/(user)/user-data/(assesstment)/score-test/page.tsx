'use client';
import { Heading } from '@/components/heading';
import TableDashboard from '@/components/table/table';
import useUserSubsData from '@/hooks/userSubsData';
import React, { useEffect } from 'react';

const ScoreTest = () => {
  const { subsData } = useUserSubsData();
  let skillScores: any[] = [];

  if (subsData) {
    skillScores = subsData.userSkill.flatMap((userSkill) =>
      userSkill.skillScore.map((score) => ({
        id: score.id,
        Skill: userSkill.skill.name,
        Score: score.score,
      })),
    );
  }

  return (
    <div className="p-4">
      <Heading
        title="Your assessment result"
        description="List of your skill asseesment"
      />
      {!subsData ? (
        <p>Loading Data</p>
      ) : skillScores.length === 0 ? (
        <p className="p-4 bg-red-200 text-red-500 border-l-2 border-red-600 rounded-lg">
          No skill assessments found.
        </p>
      ) : (
        <TableDashboard
          columns={['No', 'Skill', 'Score']}
          datas={skillScores}
          itemsPerPage={5}
        />
      )}
    </div>
  );
};

export default ScoreTest;
