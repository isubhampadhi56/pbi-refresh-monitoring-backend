import axios from "axios";

async function getAzureADToken():Promise<string> {
    const url = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;
    const reqpPrams = new URLSearchParams({
        client_id: String(process.env.AD_CLIENT_ID),
        scope: String(process.env.AD_SCOPE),
        client_secret: String(process.env.AD_CLIENT_SECRET),
        grant_type: 'client_credentials'
    });

    try {
        const {data,status} = await axios.post(url, reqpPrams.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const token = data.access_token;
        console.log(status);
        return 'Bearer ' + token;
    } catch (error) {
        console.error('error obtaining token');
        throw(error);
    }
}

export {
    getAzureADToken
}