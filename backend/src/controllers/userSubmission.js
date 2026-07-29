// import Problem from "../models/problem.js"
// import Submission from "../models/submission.js"
// import User from "../models/user.js"

// import { getLanguageById,submitBatch,submitToken } from "../utils/problemUtility.js"

// const submitCode=async(req,res)=>{
//     try{
//    const userId=req.result._id;
//    const problemId=req.params.id;
//    let {code,language}=req.body;
//    if(!userId || !code || !problemId|| !language)
//     return res.status(400).send("Some Field missing");
//   if(language==='cpp')
//     language='c++'
// console.log(language);
// const problem=await Problem.findById(problemId);
// const submittedResult=await Submission.create({
//     userId,
//     problemId,
//     code,
//     language,
//     status:'pending',
//     testCasesTotal:problem.hiddenTestCases.length
// })
// const languageId=getLanguageById(language);
// const subission=problem.hiddenTestCases.map((testcase)=>({
//     source_code:code,
//     language_id:languageId,
//     stdin:testcase.input,
//     expected_output:testcase.output
// }));

// const submitResult=await submitBatch(subission);
// const resultToken=submitResult.map((value)=>value.token);
// const testResult=await submitToken(resultToken)

// let testCasesPassed=0;
// let runtime=0;
// let memory=0;
// let status='accepted'
// let errorMessage=null;

//  for (const test of testResult){
//     if(test.status_id==3){
//         testCasesPassed++;
//         runtime=runtime+parseFloat(test.time)
//         memory=Math.max(memory,test.memory)
//     }else{
//         if(test.status_id==4){
//             status='error'
//             errorMessage=test.stderr
//         }
//         else{
//             status='wrong'
//             errorMessage=test.stderr
//         }
//     }
//  }

//  // Store the result in Database in Submission 
//  submittedResult.status=status;
//  submittedResult.testCasesPassed=testCasesPassed;
//  submittedResult.errorMessage=errorMessage;
//  submittedResult.runtime=runtime;
//  submittedResult.memory=memory
//  await submittedResult.save();

//  const accepted=(status=='accepted') 
//  res.status(201).json({
//     accepted,
//     totalTestCases:submittedResult.testCasesTotal,
//     passedTestCases:testCasesPassed,
//     runtime,
//     memory
//  });
//     }catch(error){
//   res.status(500).send("Internal Server Error"+err);
//     }
// }

// const runcode=async(req,res)=>{
//     try{
//         const userId=req.result._id;
//         const problemId=req.params.id;
//         let {code,language}=req.body;
//         if(!userId || !code || !problemId || !language){
//             return res.status(400).send("Some field missing");
//         }

//         const problem=await Problem.findById(problemId);
//         if(language=='cpp')
//             language='c++'
//      const languageId=getLanguageById(language);
//      const subission=problem.visibleTestCases.map((testcase)=>({
//         source_code:code,
//         language_id:languageId,
//         stdin:testcase.input,
//         expected_output:testcase.output
//      }));

//      const submitResult=await submitBatch(subission);
//      const resultToken=submitResult.map((value)=>value.token);
//      const testResult=await submitToken(resultToken)
//      let testCasesPassed=0;
//      let runtime=0;
//      let memory=0;
//      let status=true;
//      let errorMessage=null;
//      for(const test of testResult){
//         if(test.status_id==3){
//             testCasesPassed++;
//             runtime=runtime+parseFloat(test.time)
//             memory=Math.max(memory,test.memory);

//         }else{
//             if(test.status_id==4){
//                 testCasesPassed++;
//                 runtime=runtime+parseFloat(test.time)
//                 memory=Math.max(memory,test.memory)
//             }else{
//                 status=false;
//                 errorMessage=test.stderr;
//             }
//         }
//      }
//      res.status(201).json({
//         success:status,
//         testCase:testResult,
//         runtime,
//         memory
//      });
//     }catch(error){
//         res.status(500).send("Internal Server Error"+ err);


//     }
// }

// export  {submitCode,runcode}
import Problem from "../models/problem.js";
import Submission from "../models/submission.js";
import User from "../models/user.js";
import { getLanguageById, submitBatch, submitToken } from "../utils/problemUtility.js";
import { handleStreakAndSolved } from "./userProblem.js";

/**
 * Final Submission: Executes all hidden test cases and updates user gamification.
 */
const submitCode = async (req, res) => {
  try {
    const userId = req.result._id; //
    const problemId = req.params.id;
    let { code, language } = req.body;

    if (!userId || !code || !problemId || !language) {
      return res.status(400).send("Missing required fields for submission");
    }

    if (language === 'cpp') language = 'c++';

    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).send("Problem context not found");

    // Initialize submission record
    const submittedResult = await Submission.create({
      userId,
      problemId,
      code,
      language,
      status: 'pending',
      testCasesTotal: problem.hiddenTestCases.length
    });

    const languageId = getLanguageById(language);
    const submissions = problem.hiddenTestCases.map((testcase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output
    }));

    // Execute Judge0 Batch
    const submitResult = await submitBatch(submissions);
    const resultToken = submitResult.map((value) => value.token);
    const testResult = await submitToken(resultToken);

    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = 'accepted';
    let errorMessage = null;

    for (const test of testResult) {
      if (test.status_id === 3) {
        testCasesPassed++;
        runtime += parseFloat(test.time || 0);
        memory = Math.max(memory, test.memory || 0);
      } else {
        // If any test case fails, the overall status is no longer accepted
        status = (test.status_id === 4) ? 'error' : 'wrong';
        errorMessage = test.stderr || test.compile_output || "Logic Error";
        // Optional: break; // Remove break if you want to count all passed cases even after a failure
      }
    }

    // Update Submission Record in DB
    submittedResult.status = status;
    submittedResult.testCasesPassed = testCasesPassed;
    submittedResult.errorMessage = errorMessage;
    submittedResult.runtime = runtime;
    submittedResult.memory = memory;
    await submittedResult.save();

    const accepted = (status === 'accepted');

    /* ================= UPDATING GAMIFICATION ================= */
    if (accepted) {
      // Updates Himanshu's streak, XP, and global rank
      await handleStreakAndSolved(userId, problemId);
    }
    /* ========================================================= */

    res.status(201).json({
      accepted,
      totalTestCases: submittedResult.testCasesTotal,
      passedTestCases: testCasesPassed,
      testCase: testResult,
      runtime,
      memory
    });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

/**
 * Code Run: Executes visible test cases only (No database update).
 */
const runcode = async (req, res) => {
    try {
        const userId = req.result._id; //
        const problemId = req.params.id;
        let { code, language } = req.body;

        if (!userId || !code || !problemId || !language) {
            return res.status(400).send("Some field missing");
        }

        const problem = await Problem.findById(problemId);
        if (language === 'cpp') language = 'c++';

        const languageId = getLanguageById(language);
        const submissions = problem.visibleTestCases.map((testcase) => ({
            source_code: code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));

        const submitResult = await submitBatch(submissions);
        const resultToken = submitResult.map((value) => value.token);
        const testResult = await submitToken(resultToken);

        let runtime = 0;
        let memory = 0;
        let success = true;

        for (const test of testResult) {
            if (test.status_id === 3 || test.status_id === 4) {
                runtime += parseFloat(test.time || 0);
                memory = Math.max(memory, test.memory || 0);
            } else {
                success = false;
            }
        }

        res.status(201).json({
            success,
            testCase: testResult,
            runtime,
            memory
        });
    } catch (error) {
        res.status(500).send("Internal Server Error: " + error.message);
    }
};

export { submitCode, runcode };