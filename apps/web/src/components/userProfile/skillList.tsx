import axiosInstance from '@/lib/axios';
import { IChooseSkill, ISkill, ISubsData } from '@/lib/interface';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AddBtn, TrashBtn } from '../button/moreBtn';
import { Field, Form, Formik, FormikProps } from 'formik';
import { chooseSkillSchema } from '@/lib/skillSchemas';

interface ISkillList {
  subsData: ISubsData;
}
const UserSkillList = ({ subsData }: ISkillList) => {
  const [skills, setSkills] = useState<ISkill[]>([]);
  const [userSkills, setUserSkills] = useState(subsData?.userSkill || []);
  const router = useRouter();
  let notifMessage = '';
  useEffect(() => {
    if (subsData?.userSkill) {
      setUserSkills(subsData.userSkill);
    }
  }, [subsData]);

  const onSubmit = async (values: any) => {
    try {
      // console.log('Value : ' + JSON.stringify(values));
      const { data } = await axiosInstance.post(
        '/api/skill//user-skill/add',
        values,
      );
      toast.success(data.message);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Something went wrong!';
      toast.error(errorMessage);
    }
  };

  const showValidationErrors = (errors: Record<string, string>) => {
    Object.values(errors).forEach((error) => {
      toast.error(error);
    });
  };

  useEffect(() => {
    const getSkillList = async () => {
      try {
        const { data } = await axiosInstance.get('/api/skill/all-skill');
        setSkills(data.skills);
        console.log(data.skills);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || 'Something went wrong!';
        toast.error(errorMessage);
      }
    };
    getSkillList();
  }, []);

  const handleDeleteUserSkill = async (userSkillId: string) => {
    try {
      const { data } = await axiosInstance.delete(
        `/api/skill/user-skill/delete/${userSkillId}`,
      );
      toast.success(data.message);
      setTimeout(
        () =>
          setUserSkills((prevUserSkills) =>
            prevUserSkills.filter((userSkill) => userSkill.id !== userSkillId),
          ),
        1500,
      );
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Something went wrong!';
      toast.error(errorMessage);
    }
  };

  const handleTakeAssessment = (userSkillId: string, skillId: string) => {
    if (!subsData?.subsCtg?.name) {
      toast.error('Error, no subscription data exist');
      return;
    }
    const { name } = subsData.subsCtg;
    const totalSkillScores = subsData.userSkill.reduce(
      (count, userSkill) => count + userSkill.skillScore.length,
      0,
    );
    if (name === 'free') {
      notifMessage = 'Please upgrade you subscription plan!';
      toast.error(notifMessage, { duration: 3000 });
    } else if (name === 'standard' && totalSkillScores >= 2) {
      notifMessage =
        'You have reach your assesstment limit, please upgrade your subscription plan';
      toast.error(notifMessage, { duration: 3000 });
    } else if (
      name === 'professional' ||
      (name === 'standard' && totalSkillScores < 2)
    ) {
      router.push(`/user-data/take-test/${skillId}/${userSkillId}`);
    }
  };
  return (
    <div className="my-4 flex flex-col gap-2">
      <div className="p-2 bg-gradient-to-r from-fuchsia-500 to-purple-500 rounded-lg">
        <h1 className="text-white font-semibold text-xl">Skills</h1>
        <Formik
          initialValues={{
            skillName: '',
          }}
          validationSchema={chooseSkillSchema}
          onSubmit={(values) => onSubmit(values)}
        >
          {(props: FormikProps<IChooseSkill>) => {
            const { validateForm, handleSubmit, isSubmitting } = props;
            return (
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  validateForm().then((errors) => {
                    if (Object.keys(errors).length > 0) {
                      showValidationErrors(errors);
                    } else {
                      handleSubmit();
                    }
                  });
                }}
                className="flex flex-row gap-4 justify-between items-end"
              >
                <div className="my-1 w-full">
                  <label>Add new skill :</label>
                  <Field name="skillName" as="select" className="formik-input">
                    <option value="" className="text-gray-500">
                      Select Skill
                    </option>
                    {skills.map((skill) => (
                      <option value={skill.name} key={skill.id}>
                        {skill.name.charAt(0).toUpperCase() +
                          skill.name.slice(1)}
                      </option>
                    ))}
                  </Field>
                </div>

                <div className="flex items-center justify-end my-2">
                  <AddBtn
                    title="Skill"
                    runFunction={() => {}}
                    style="bg-yellow-200 text-black hover:bg-yellow-400"
                    disabled={isSubmitting}
                  />
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
      {userSkills.length > 0 ? (
        userSkills.map((userSkill) => (
          <div
            className="p-2 bg-white border-2 rounded-lg border-purple-500 flex flex-col gap-1"
            key={userSkill.id}
          >
            <div className="flex flex-row w-full justify-between items-center">
              <div className="flex gap-0">
                <h1 className="font-semibold">
                  <span className="font-bold text-lg">-</span>{' '}
                  {userSkill.skill.name}
                </h1>
              </div>
              <div className="flex flex-row items-center gap-2">
                <AddBtn
                  title="Take assessment"
                  runFunction={() =>
                    handleTakeAssessment(userSkill.id, userSkill.skillId)
                  }
                />
                <TrashBtn
                  runFunction={() => handleDeleteUserSkill(userSkill.id)}
                />
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="p-2 bg-white border-2 rounded-lg border-purple-500 flex flex-col gap-1">
          No Data
        </div>
      )}
    </div>
  );
};

export default UserSkillList;
