import { PreSelectionTestIdMaker } from '@/lib/adminId';
import prisma from '@/prisma';

interface QuestionInput {
  question: string;
  imageUrl?: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  answer: string;
}

export const createPreSelectionTest = async (jobId: string) => {
  try {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      throw new Error('Job not found');
    }

    // Check if a test already exists for the job
    const existingTest = await prisma.preSelectionTest.findUnique({
      where: { jobId: jobId },
    });

    if (existingTest) {
      throw new Error('Pre-selection test already exists for this job');
    }
    const testId = await PreSelectionTestIdMaker(jobId);

    const test = await prisma.preSelectionTest.create({
      data: {
        id: testId,
        jobId,
      },
    });
    return test;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error('Unexpected error - createPreSelectionTest: ' + error);
  }
};

export const createPreSelectionQuestions = async (
  testId: string,
  questions: QuestionInput[]
) => {
  try {
    const test = await prisma.preSelectionTest.findUnique({ where: { id: testId } });
    if (!test) {
      throw new Error('Test not found');
    }

    if (questions.length !== 25) {
      throw new Error('Test must contain exactly 25 questions');
    }

    const createdQuestions = await prisma.preSelectionQuestion.createMany({
      data: questions.map((question) => ({
        testId,
        ...question,
      })),
    });

    return createdQuestions;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error('Unexpected error - createPreSelectionQuestions: ' + error);
  }
};

export const editPreSelectionQuestion = async (
  questionId: string,
  questionData: QuestionInput
) => {
  try {
    const existingQuestion = await prisma.preSelectionQuestion.findUnique({
      where: { id: questionId },
    });

    if (!existingQuestion) {
      throw new Error('Question not found');
    }

    const updatedQuestion = await prisma.preSelectionQuestion.update({
      where: { id: questionId },
      data: {
        ...questionData,
      },
    });

    return updatedQuestion;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error('Unexpected error - editPreSelectionQuestion: ' + error);
  }
};

export const deletePreSelectionTest = async (testId: string) => {
  try {
    const test = await prisma.preSelectionTest.delete({
      where: { id: testId },
      include: { questions: true },
    });
    return test;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error('Unexpected error - deletePreSelectionTest: ' + error);
  }
};

export const updatePreSelectionTest = async (
  testId: string,
  isActive: boolean
) => {
  try {
    const test = await prisma.preSelectionTest.findUnique({ where: { id: testId } });
    if (!test) {
      throw new Error('Test not found');
    }
    const updatedTest = await prisma.preSelectionTest.update({
      where: { id: testId },
      data: { isActive },
      include: { questions: true },
    });
    return updatedTest;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error('Unexpected error - updatePreSelectionTest: ' + error);
  }
};

export const getPreSelectionTestByJobId = async (jobId: string) => {
  try {
    const test = await prisma.preSelectionTest.findUnique({
      where: { jobId: jobId },
      include: { questions: true },
    });
    if (!test) throw new Error("Test doesn't exist for this job");
    return test;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error('Unexpected error - getPreSelectionTestByJobId: ' + error);
  }
};

export const getPreSelectionTestById = async (testId: string) => {
  try {
    const test = await prisma.preSelectionTest.findUnique({
      where: { id: testId },
      include: { questions: true },
    });
    if (!test) throw new Error("Test doesn't exist");
    return test;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error('Unexpected error - getPreSelectionTestById: ' + error);
  }
};

export const getAllPreSelectionTestsByCompany = async (accountId: string) => {
  try {
    const companies = await prisma.company.findMany({
      where: {
        accountId: accountId,
      },
      include: {
        jobs: {
          include: {
            PreSelectionTest: true,
          },
        },
      },
    });

    const preSelectionTests = companies.flatMap((company) =>
      company.jobs.flatMap((job) =>
        job.PreSelectionTest
          ? {
              ...job.PreSelectionTest,
              jobTitle: job.title,
            }
          : []
      )
    );

    return preSelectionTests;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error('Unexpected error - getAllPreSelectionTestsByCompany: ' + error);
  }
};

export const submitPreSelectionTestResult = async (
  applicantId: string,
  testId: string,
  answers: Array<{ questionId: string; selectedOption: string }>
) => {
  try {
    const questions = await prisma.preSelectionQuestion.findMany({
      where: { testId },
    });
    if (!questions || questions.length === 0) {
      throw new Error('No questions available for this test');
    }

    const answerMap = questions.reduce((acc, q) => {
      acc[q.id] = q.answer;
      return acc;
    }, {} as Record<string, string>);

    let score = 0;
    const detailedAnswers = answers.map((ans) => {
      const isCorrect = answerMap[ans.questionId] === ans.selectedOption;
      if (isCorrect) score++;
      return {
        questionId: ans.questionId,
        selectedOption: ans.selectedOption,
        isCorrect,
      };
    });

    const testResult = await prisma.preSelectionTestResult.create({
      data: {
        applicant: { connect: { id: applicantId } },
        test: { connect: { id: testId } },
        score,
        total: questions.length,
        answers: { create: detailedAnswers },
      },
      include: { answers: true },
    });
    return testResult;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error('Unexpected error - submitPreSelectionTestResult: ' + error);
  }
};

export const getPreSelectionTestResultsByTestId = async (testId: string) => {
  try {
    const results = await prisma.preSelectionTestResult.findMany({
      where: { testId: testId },
    });
    return results;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error('Unexpected error - getPreSelectionTestResultsByTestId: ' + error);
  }
};
