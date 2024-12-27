const fetch = require("node-fetch-commonjs")

function getHandle(linkedinProfileUrl) {
  const url = getLinkedinProfileUrl(linkedinProfileUrl);
  return url?.split("/in/")?.[1];
}
  
function getLinkedinProfileUrl(navigationUrl) {
  return navigationUrl?.split("?")?.[0];
}


async function searchPeople(search, page) {
  try {
    const start = page * 10;
    const res = await fetch(
      `https://www.linkedin.com/voyager/api/graphql?variables=(start:${start},origin:CLUSTER_EXPANSION,query:(keywords:${encodeURI(search)},flagshipSearchIntent:SEARCH_SRP,queryParameters:List((key:resultType,value:List(PEOPLE))),includeFiltersInResponse:false))&&queryId=voyagerSearchDashClusters.68ba48494612dddec4542fd2fef14aa1`, {
      "headers": {
        "accept": "application/vnd.linkedin.normalized+json+2.1",
        "accept-language": "en-GB,en;q=0.9",
        "cache-control": "no-cache",
        "csrf-token": "ajax:6004472579371110538",
        "pragma": "no-cache",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sec-gpc": "1",
        "x-li-lang": "en_US",
        "x-li-page-instance": "urn:li:page:d_flagship3_search_srp_people_load_more;wlD8MFWWQVKXmBs6reqeQw==",
        "x-li-track": "{\"clientVersion\":\"1.13.7958\",\"mpVersion\":\"1.13.7958\",\"osName\":\"web\",\"timezoneOffset\":1,\"timezone\":\"Africa/Lagos\",\"deviceFormFactor\":\"DESKTOP\",\"mpName\":\"voyager-web\",\"displayDensity\":2,\"displayWidth\":2410,\"displayHeight\":1404}",
        "x-restli-protocol-version": "2.0.0",
        "cookie": "AMCVS_14215E3D5995C57C0A495C55%40AdobeOrg=1; li_sugr=faa7e9a6-e9a9-4f55-b9c8-cb513cd1c142; bcookie=\"v=2&6cae1bc7-8155-4d14-8199-3a303f935a08\"; bscookie=\"v=1&20220914195629e2bb7a2d-9af6-4216-8227-57067360796eAQH9LsGRgZFncFffGVFZP92hNI96Sd50\"; lil-lang=en_US; s_cc=true; at_check=true; PLAY_LANG=en; visit=v=1&M; s_sq=%5B%5BB%5D%5D; s_ppv=developer.linkedin.com%2Fproduct-catalog%2C15%2C15%2C742%2C1%2C6; s_plt=31.47; s_pltp=developer.linkedin.com%2Fproduct-catalog; li_gc=MTswOzE2OTQ5MDMyMjQ7MjswMjGPYH14vwzwsWi43dpJ7pbURqbMHrUOmrawCC8l00xzpw==; timezone=Africa/Lagos; li_theme=light; li_theme_set=app; SID=270d888d-8de4-406a-aa76-f5bb4c9a5292; VID=V_2023_09_16_22_3268; li_rm=AQEZtK3s0DrrpAAAAYq-vIKDCNNgBEmQcpVjPp0dN2a25OpB_Dj8Y711FvLDToOnY4cca9D9dkZjAq1jFVJGYpVtJkJlaUHwE4ylWZ26_7VcH-5z5TeoLegc3UQpUrGtNhku6EOMsGjsy8s2w4b51j-CES3Pk63s7wehweQzdFRzTwJDc6AO464gOxALinhndqK1RQGm4NYlyvakcCNnY_Y3KAaK4j6mJCzcrkopJ8blWUQuvqcJq8wv32wZLudYUSFuwg4lUm2vEW5kofS056dXL_3xP3t3EU9a4CizhePNDEMe7B1YQKDxiXGw2uaEplsSMfUOxdWFZbyRNqg; PLAY_SESSION=eyJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7ImFjY291bnQuY2xvc2UucHJlY29uZGl0aW9uLnNlc3Npb24ua2V5IjoiYWNjb3VudC5jbG9zZS5wcmVjb25kaXRpb24udmFsdWUucGFzc2VkdXJuOmxpOm1lbWJlcjoxMDYwMzg3MDE1Iiwic2Vzc2lvbl9pZCI6ImQ4MjMwYjVhLTg2NTItNDkzZC1hNTk3LTJhY2I5NWRkYzNjZHwxNjk1MDcxMTEwIiwiYWxsb3dsaXN0Ijoie30iLCJyZWNlbnRseS1zZWFyY2hlZCI6IiIsInJlZmVycmFsLXVybCI6Imh0dHBzOi8vd3d3Lmdvb2dsZS5jb20vIiwiYWlkIjoiIiwiUk5ULWlkIjoifDAiLCJyZWNlbnRseS12aWV3ZWQiOiI1NjMzMDl8NTI2MDQ4IiwiQ1BULWlkIjoif1x1MDAxNsOCRExZw5ddwqtnKMOBw4LCu8OKw5oiLCJhY2NvdW50LmNsb3NlLnN1Y2Nlc3Mua2V5IjoiYWNjb3VudC5jbG9zZS5zdWNjZXNzIiwiZmxvd1RyYWNraW5nSWQiOiJBN2RvUW15Z1F4ZTAyQWNBWFJPS05nPT0iLCJleHBlcmllbmNlIjoiZW50aXR5IiwiaXNfbmF0aXZlIjoiZmFsc2UiLCJ0cmsiOiIifSwibmJmIjoxNjk1OTAwMzM1LCJpYXQiOjE2OTU5MDAzMzV9.BOJdsle4qVAIkb3KkHusOEn6W6K4PzI0QlQ_HcCV6p4; _guid=a397ee66-d36c-4b4f-85cf-44a1cf6b9735; setly.id=cookie_value; AnalyticsSyncHistory=AQJwjq4RUiiy6AAAAYxFqQaND7Rj73bgTJ9XTtNsJZXAZBjB7tzjsUEQ_JJNCrHHEh62f3jLmSGSQQ8ILK0rRQ; sdsc=1%3A1SZM1shxDNbLt36wZwCgPgvN58iw%3D; lang=v=2&lang=en-us; JSESSIONID=\"ajax:6004472579371110538\"; fid=AQGgkih2Zq02IAAAAYxP8c0mRTkJIRDQD0sBxJSC5J3AScpeSStCL_BUJ9RnvWEw8oSKXGImwgnrSw; fcookie=AQFbctaWBYfJ9gAAAYxP8iaWoKK8roNr6p0562QRU0BaIw7oNqatbFaWwGzBAjxwIGnSHIvlZMOaEIvytXKvuHGuQ3ekIP3bYkc_U1zSokIV4oCKIKWJ3cv1iqVAvM6QAoCY-iPzgJ5veojkPYjpR5i_gl2HgCrO37nM9RibYskePYPPB6dXBym7Ce8HllwQR7uYoljFOGsR8iS5W-ILOOS7DzG0HMknsHEszDFmThv0XTVu1k5I4kmSNXZKjOzc4dlOHgebByVVGZ8oakiQGgKm+0YYMcSk/oggKlG57wweA7Q8NZ2WdARrcaB+GOUeZEDXiKqfWXNWfYdOy02VpnDpbkeQ==; li_at=AQEDASH6CbQAwPxtAAABjE_yOxMAAAGMc_6_E00AE8gsqARszDKZxBejkQdjNqXpgzu_5PRNM2JmDs_sV7EmsOd1KYpn6naQ6_Sfyf8yD495W5dVGu-Ibz3pSxGheI3fyLdw5RBMiNHFEa4g5n0NiGzj; liap=true; lms_ads=AQFrhbzo9ef1hAAAAYxQI3v6TDQa-kJaff6Mz66lDN_qnN0EDmuRmeEex6OJw5LdIcgisiu4iyi-Ca1u9JNdTpqm6a7ggkIA; lms_analytics=AQFrhbzo9ef1hAAAAYxQI3v6TDQa-kJaff6Mz66lDN_qnN0EDmuRmeEex6OJw5LdIcgisiu4iyi-Ca1u9JNdTpqm6a7ggkIA; lidc=\"b=VB12:s=V:r=V:a=V:p=V:g=4686:u=818:x=1:i=1702226413:t=1702305884:v=2:sig=AQH5aYOBOUREmEJ91XySZo6HXPDpte4G\"; li_theme_set=app",
        "Referer": "https://www.linkedin.com/search/results/people/?keywords=software%20engineer&origin=CLUSTER_EXPANSION&sid=p4%3B",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": null,
      "method": "GET"

    });
    const result = await res.json();
    const peoplesProfiles = result?.included?.filter(
      (s) => s?.template === "UNIVERSAL"
    );
    const jsonify = peoplesProfiles.map((p) => {
      return {
        name: p?.title?.text,
        handle: getHandle(p?.navigationUrl),
        jobTitle: p?.primarySubtitle?.text,
        summary: p?.summary?.text,
        location: p?.secondarySubtitle?.text,
        image:
          p?.image?.attributes?.[0]?.detailData?.nonEntityProfilePicture
            ?.vectorImage?.artifacts?.[0]?.fileIdentifyingUrlPathSegment,
        url: getLinkedinProfileUrl(p?.navigationUrl),
      };
    });
    return jsonify;
  } catch (error) {
    console.log(error);
  }
}




module.exports = searchPeople
