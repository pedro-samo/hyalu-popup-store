import axios from "axios";

export const oneTrust = async (email: string) => {
  try {
    const body = JSON.stringify({
      identifier: email,
      requestInformation:
        "eyJhbGciOiJSUzUxMiJ9.eyJvdEp3dFZlcnNpb24iOjEsInByb2Nlc3NJZCI6IjVlMWJhNTFiLWU3NzEtNGE1NC1iOTFiLWJlMWZjOGNhZDQ4MSIsInByb2Nlc3NWZXJzaW9uIjoxLCJpYXQiOiIyMDI1LTA2LTI1VDE5OjExOjI1LjM0MyIsIm1vYyI6IldFQl9GT1JNIiwicG9saWN5X3VyaSI6bnVsbCwic3ViIjoiRW1haWwiLCJpc3MiOm51bGwsInRlbmFudElkIjoiYjhlYzAxMWMtOGJmNS00ZWM2LTk4ZGYtOTkwZDM3MzUwZjc4IiwiZGVzY3JpcHRpb24iOiJDYW1wYWlnbiB8IEJSIHwgUFBEIHwgS8OpcmFzdGFzZSAoY2xvdWQubWFpbC5rZXJhc3Rhc2UuY29tLmJyKSIsImNvbnNlbnRUeXBlIjoiQ09ORElUSU9OQUxUUklHR0VSIiwiYWxsb3dOb3RHaXZlbkNvbnNlbnRzIjp0cnVlLCJkb3VibGVPcHRJbiI6ZmFsc2UsInB1cnBvc2VzIjpbeyJpZCI6ImVmNDQ0OGY5LWQ2MjAtNDE0Mi04MDhjLWJiMzQ3OTg3Y2U5MyIsInZlcnNpb24iOjEsInBhcmVudElkIjpudWxsLCJ0b3BpY3MiOltdLCJjdXN0b21QcmVmZXJlbmNlcyI6W10sImVuYWJsZUdlb2xvY2F0aW9uIjpmYWxzZSwiaW1wbGljaXRDb25zZW50TGlmZVNwYW4iOjB9LHsiaWQiOiI2YjFkMzgxYy1hYWJlLTQ5N2UtOTMxZC00MGU0ZGMyNTlkNTQiLCJ2ZXJzaW9uIjoxLCJwYXJlbnRJZCI6bnVsbCwidG9waWNzIjpbXSwiY3VzdG9tUHJlZmVyZW5jZXMiOltdLCJlbmFibGVHZW9sb2NhdGlvbiI6ZmFsc2UsImltcGxpY2l0Q29uc2VudExpZmVTcGFuIjowfSx7ImlkIjoiNzk0ZGZkNTMtMTk4My00YzA3LTk3NDMtZDNmYmU0NDE5YTM5IiwidmVyc2lvbiI6MSwicGFyZW50SWQiOm51bGwsInRvcGljcyI6W10sImN1c3RvbVByZWZlcmVuY2VzIjpbXSwiZW5hYmxlR2VvbG9jYXRpb24iOmZhbHNlLCJpbXBsaWNpdENvbnNlbnRMaWZlU3BhbiI6MH0seyJpZCI6IjYyNzZjMDQzLWIxOTYtNGFjZi04M2E2LWEwNmNmMDE2ZTFhMSIsInZlcnNpb24iOjEsInBhcmVudElkIjpudWxsLCJ0b3BpY3MiOltdLCJjdXN0b21QcmVmZXJlbmNlcyI6W10sImVuYWJsZUdlb2xvY2F0aW9uIjpmYWxzZSwiaW1wbGljaXRDb25zZW50TGlmZVNwYW4iOjB9XSwibm90aWNlcyI6W10sImRzRGF0YUVsZW1lbnRzIjpbXSwiYXV0aGVudGljYXRpb25SZXF1aXJlZCI6ZmFsc2UsInJlY29uZmlybUFjdGl2ZVB1cnBvc2UiOmZhbHNlLCJvdmVycmlkZUFjdGl2ZVB1cnBvc2UiOnRydWUsImR5bmFtaWNDb2xsZWN0aW9uUG9pbnQiOmZhbHNlLCJhZGRpdGlvbmFsSWRlbnRpZmllcnMiOltdLCJtdWx0aXBsZUlkZW50aWZpZXJUeXBlcyI6ZmFsc2UsImVuYWJsZVBhcmVudFByaW1hcnlJZGVudGlmaWVycyI6ZmFsc2UsInBhcmVudFByaW1hcnlJZGVudGlmaWVyc1R5cGUiOm51bGwsImFkZGl0aW9uYWxQYXJlbnRJZGVudGlmaWVyVHlwZXMiOltdLCJlbmFibGVHZW9sb2NhdGlvbiI6ZmFsc2UsImRhdGFFbGVtZW50VHlwZU1hcCI6e319.M9sLagDBzPR_6Zju-Xq9rxpU7Ji4cExzp1sekH6XU_FF4zlrG0bdrrIX8nIN7cF-5SkIqNLSVxi3uXUMlJt8hW9_VbaZySprA20eCG-ilrYHBUylOd-3rfmApkEVhQRaUGc8jU6kx_6WIkE-6wm0iViWwEISMsTaue1WIJU30QXTJNONwoxM63HARDl_9wJTjKlPLN2L-yEAuBtbElT823uUhM3lbAqzS0NfJmGvrp1BommlYnxx3u6lNqPKmrUb7Z92eNbgz_IEqasURjhhZziS90TVPZoeaFchTa4cczEkNwq7GKPrhNUVG8DHW6okviWQV8lzW3yVFyQYH7AU9zyyuuE-jKHYbYK_0oWOcDZyjCzPUW4lLpMjap-1GBfOoW0iDaNXIc8gV6xY4hNPk7S33aBCubPaNW_jw7r0SX5kNkD80hpfoPx-YPFuAsyN0_BXJdOzJq-h5SEGCqZhjxDR6MDaS-B4JH8-oR8_tvkkZErTLjQkTI-o7qTE9F7cahHv-vMp8Zn6uWv__r_r82cxoafrI8SDSHap8dygJ-DXyCd97bIKehxqxCLDSD2bSYugFP9vye4Kn7tigFbj6hDn3x77WcozYJGdPh0soYQcXGYHocYubRacD6pawBs5V9Ni-J60s1MdE3WgfXBj1YXnAmwnBItWJbLpbXJYI44",
      purposes: [
        {
          Id: "ef4448f9-d620-4142-808c-bb347987ce93"
        },
        {
          Id: "6b1d381c-aabe-497e-931d-40e4dc259d54"
        },
        {
          Id: "794dfd53-1983-4c07-9743-d3fbe4419a39"
        },
        {
          Id: "6276c043-b196-4acf-83a6-a06cf016e1a1"
        }
      ]
    });

    const config = {
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    };

    await axios.post("https://privacyportal-eu.onetrust.com/request/v1/consentreceipts", body, config);
  } catch (error) {
    console.log(error);
  }
};
