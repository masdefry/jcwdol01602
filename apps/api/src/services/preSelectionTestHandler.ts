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
    // Validate jobId exists
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      throw new Error('Job not found');
    }

    const test = await prisma.preSelectionTest.create({
      data: {
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
    // Validate testId exists
    const test = await prisma.preSelectionTest.findUnique({where: {id: testId}})
    if(!test){
        throw new Error("Test not found");
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

/**
 * Delete a pre-selection test by ID.
 */
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

/**
 * Update an existing pre-selection test.
 * If new questions are provided, they will replace all existing ones.
 */
export const updatePreSelectionTest = async (
  testId: string,
  isActive: boolean
) => {
  try {
    const test = await prisma.preSelectionTest.findUnique({where: {id: testId}})
    if(!test){
        throw new Error("Test not found");
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

/**
 * Get a pre-selection test by jobId.
 */
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

/**
 * Get a pre-selection test by ID.
 */
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

/**
 * Get all pre-selection tests by company (accountId).
 */
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

    // Flatten the results to get a list of all PreSelectionTests
    const preSelectionTests = companies.flatMap(company =>
      company.jobs.flatMap(job => job.PreSelectionTest)
    );

    return preSelectionTests;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error('Unexpected error - getAllPreSelectionTestsByCompany: ' + error);
  }
};
/**
 * Submit the test result for an applicant.
 * This function calculates the score based on the correct answers.
 */
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
    // Build a map of questionId to correct answer.
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

/**
 * Retrieve all test results for a given test ID.
 */
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
