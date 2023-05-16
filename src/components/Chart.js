import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";
import { useState, useEffect } from "react";

const appId = "data-uoxfe";
const dataApiBaseUrl = "https://us-east-1.aws.data.mongodb-api.com/app/data-uoxfe/endpoint/data/v1";

const sdk = new ChartsEmbedSDK({
  baseUrl: "https://charts.mongodb.com/charts-brainbrew-hqwvh", // Optional: ~REPLACE~ with the Base URL from your Embed Chart dialog
});

const chart = sdk.createChart({
  chartId: "2a0e1ad9-07ab-4f96-8308-116f29707214", // Optional: ~REPLACE~ with the Chart ID from your Embed Chart dialog
  height: "700px"
});

// var globalPayload;
// const clickHandler2 = (payload) => {
//   console.log(payload);
//   console.log(payload.data.geopoint.value);
//   globalPayload = payload;
//   handleSubmit();
// }

// async function handleSubmit() {
//   const data = {
//     "collection": "hints",
//     "database": "lordofthering",
//     "dataSource": "demo-cluster",
//     "projection": {
//         "_id": 1
//     }
// };

//   const response = await fetch('https://data.mongodb-api.com/app/data-tuuih/endpoint/data/v1/action/findOne', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Access-Control-Allow-Origin': '*', // Required for CORS support to work: www.other.com
//       'api-key': 'jqcVwiYouJE1bowtmP4J08w0jZMoaN4iwVaouZphXLib0a22rq9w9HOrJ1ZE8Huw'
//     },
//     redirect: 'follow',
//     body: JSON.stringify(data),
//   });

//   const result = await response.json();
//   console.log(result);
// }


export default function Chart() {
  const [payload, setPayload] = useState({});
  const [accessToken, setAccessToken] = useState(null);

  let token = null;

  useEffect(() => {
    const render = async () => {
      await chart.render(document.getElementById("chart"));
      await chart.addEventListener("click", async (payload) => {
        setPayload(payload);
        fetchFromDataApi();
      });
    };
    render().catch((e) => window.alert(e.message));

    const authenticate = async () => {
      const authUrl = `https://realm.mongodb.com/api/client/v2.0/app/${appId}/auth/providers/anon-user/login`

      // Authenticate with the server
      // Anonymous authentication must be enabled in app services
      const tokens = await fetch(authUrl).then(res => res.json());
      setAccessToken(tokens.access_token);
      token = tokens.access_token;
      }
    authenticate();
  }, []);

  const fetchFromDataApi = async () => {
    // Make a call to the Data API
    const url = `${dataApiBaseUrl}/action/findOne`;
    const data = {
      dataSource: "Cluster0",
      database: "lotr",
      collection: "lotr",
      filter: {}
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data)
    }).then(res => res.json());

    console.log(response);
  };

  return (
    <>
      <div id="chart"></div>
      <div id="info">
        <ul>
          <li>Access Token: {accessToken}</li>
          <li>Role: {payload?.target?.role}</li>
          <li>Type: {payload?.target?.type}</li>
          <li>Fill: {payload?.target?.fill}</li>
          <li>x.label: {payload?.data?.x?.label}</li>
          {/* <li>x.value: {payload?.data?.x?.value}</li> */}
          <li>y.label: {payload?.data?.y?.label}</li>
          {/* <li>y.value: {payload?.data?.y?.value}</li> */}
          <li>color.label: {payload?.data?.color?.label}</li>
          <li>color.value: {payload?.data?.color?.value}</li>
        </ul>

        <div id="payload">
          <pre>{JSON.stringify(payload, null, 2)}</pre>
        </div>
      </div>


    </>
  )
}