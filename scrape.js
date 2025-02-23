const axios = require('axios');

const url = 'http://localhost:3036/api/dom-simple?url=https://www.wongnai.com/_api/businesses.json?_v=6.126&locale=th&regions=9681&page.size=100&forseo=true';

const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1'
];

const headers = {
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept': 'application/json, text/plain, */*',
  'demiourgos-token': '_tA1tSofDQRChahvLxNNtAvGJMHR4Hbkkja1_YZsnJKquNMuyRyUZiEjY73dqiVbAiC2.ezmWi8SZlhia7NgbudAENk.uUOsG0IBGCxHsuzspSHO9GrIQ_oB6YLLGlXMIt==',
  'Sec-GPC': '1',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-origin',
  'Priority': 'u=4'
};

function getRandomUserAgent() {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchData() {
  headers['User-Agent'] = getRandomUserAgent();
  try {
    const response = await axios.get(url, { headers });
    const data = response.data;
    if (data._error && data._error.code === 403403) {
      console.error('Automated request detected. Please try again later.');
    } else {
      // Process the data as needed
      console.log('Results:', data.results);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function main() {
  for (let i = 0; i < 5; i++) { // Adjust the number of requests as needed
    await fetchData();
    await delay(5000); // Delay of 5 seconds between requests
  }
}

main();
