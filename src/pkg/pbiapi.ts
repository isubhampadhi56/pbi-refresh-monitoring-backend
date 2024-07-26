import axios from "axios";
async function getRefreshDetail(datasetDetail:any,accessToken:any){
    try{
        const {data,status} =  await axios.get(`https://api.powerbi.com/v1.0/myorg/groups/${datasetDetail.workspaceId}/datasets/${datasetDetail.datasetId}/refreshes?$top=1`,{
            headers: {'Authorization': accessToken},
        })
        console.log(status);
        return data;
    }catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error response data:', error.response ? error.response.data : 'No response data');
        } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
}

async function triggerRefresh(datasetId:string,accessToken:any){
    try{
        const{ status } =  await axios.post(`https://api.powerbi.com/v1.0/myorg/datasets/${datasetId}/refreshes`,null,{
            headers: {'Authorization': accessToken},
        })
        return status;
    }catch(error){
        if (axios.isAxiosError(error)) {
            console.error('Error response data:', error.response ? error.response.data : 'No response data');
        } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
}

async function getRefreshSchedule(datasetId:string,accessToken:any){
    try{
        const {data} =  await axios.get(`https://api.powerbi.com/v1.0/myorg/datasets/${datasetId}/refreshSchedule`,{
            headers: {'Authorization': accessToken},
        })
        return data;
    }catch(error){
        if (axios.isAxiosError(error)) {
            console.error('Error response data:', error.response ? error.response.data : 'No response data');
        } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
}

async function getDatasetName(workspaceId:string,datasetId:string,accessToken:any) {
    const url = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/datasets/${datasetId}`;
    try{
        const response = await axios.get(url, {
            headers: {
              'Authorization': accessToken
            }
        });
        return response.data.name;
    }catch(error) {
        if (axios.isAxiosError(error)) {
            console.error('Error response data:', error.response ? error.response.data : 'No response data');
        } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
  }
export{
    getRefreshDetail,
    triggerRefresh,
    getRefreshSchedule,
    getDatasetName
}

