import axios from 'axios'


const getLanguageById = (lang)=>{

    const language = {
        "c++":54,
        "java":62,
        "javascript":63
    }


    return language[lang.toLowerCase()];
}


const encodeBase64 = (str) => {
  if (str === null || str === undefined) return '';
  return Buffer.from(String(str)).toString('base64');
};

const decodeBase64 = (str) => {
  if (!str) return str;
  try {
    return Buffer.from(str, 'base64').toString('utf-8');
  } catch (e) {
    console.error("Error decoding base64:", e);
    return str;
  }
};

const submitBatch = async (submissions)=>{

  const encodedSubmissions = submissions.map(sub => ({
    ...sub,
    source_code: encodeBase64(sub.source_code),
    stdin: encodeBase64(sub.stdin),
    expected_output: encodeBase64(sub.expected_output)
  }));

  const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
      base64_encoded: 'true'
    },
    headers: {
      'x-rapidapi-key': process.env.JUDGE0_KEY,
      'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
      'Content-Type': 'application/json'
    },
    data: {
      submissions: encodedSubmissions
    }
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  return await fetchData();
}

const waiting = (timer) => new Promise((resolve) => setTimeout(resolve, timer));

// ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]

const submitToken = async(resultToken)=>{

  const options = {
    method: 'GET',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
      tokens: resultToken.join(","),
      base64_encoded: 'true',
      fields: '*'
    },
    headers: {
      'x-rapidapi-key': process.env.JUDGE0_KEY,
      'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
    }
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      const data = response.data;
      if (data && Array.isArray(data.submissions)) {
        data.submissions = data.submissions.map(sub => ({
          ...sub,
          stdout: decodeBase64(sub.stdout),
          stderr: decodeBase64(sub.stderr),
          compile_output: decodeBase64(sub.compile_output),
          message: decodeBase64(sub.message),
          stdin: decodeBase64(sub.stdin),
          expected_output: decodeBase64(sub.expected_output)
        }));
      }
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  while(true){
    const result = await fetchData();
    const IsResultObtained = result.submissions.every((r)=>r.status_id>2);

    if(IsResultObtained)
      return result.submissions;

    await waiting(1000);
  }
}

export {getLanguageById,submitBatch,submitToken};








// 


