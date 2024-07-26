import { Request,Response } from "express";
import {getAzureADToken} from "../pkg/ad"
import {getRefreshDetail} from "../pkg/pbiapi"
// import { datasets, Dataset } from "../model/db"
import { accessToken, dbClient } from "../config/config"

async function getRefreshStatus(req: Request, res: Response){
    const groupId = String(req.query.groupId);
    let groupDetail:any
    try{
        groupDetail = await dbClient.group.findFirst({
            where: {
                id: groupId
            }
        });
        if(!groupDetail){
            res.status(404).json({message: "unable to find group"})
            return
        }
    }catch(error){
        res.status(404).json({message: "unable to find group"})
        return
    }
    const datasetIds = groupDetail.datasets || [];
    let datasets = []
    try{
        datasets = await dbClient.datasetDetail.findMany({
            where: {
              datasetId: {
                in: datasetIds
              }
            }
        });
    }catch(error){
        res.status(404).json({message: "unable to find datasets"});
        return
    }
    let refreshTimes:any
    try{
        const refreshPromises = datasets.map(dataset => {
            return getRefreshDetail(dataset,accessToken);
        })
        refreshTimes = await Promise.all(refreshPromises);
    }catch(error:any){
        res.status(500).json({message: error.response ? error.response.data.Message : 'No response data'});
        return;
    }
    const result = datasets.map((dataset,index) => {
        const startTime:any = new Date(refreshTimes[index].value[0].startTime);
        const endTime:any  = new Date(refreshTimes[index].value[0].endTime);
        const durationMs:any = endTime - startTime;
        const durationSeconds = durationMs / 1000;
        const durationMinutes = durationSeconds / 60;
        const durationHours = durationMinutes/60;
        let refreshStatus = refreshTimes[index].value[0].status;
        if(refreshStatus === "Unknown"){
            refreshStatus = "In Progress"
        }
        dataset.refreshStatus = refreshStatus;
        dataset.lastRefresh = refreshTimes[index].value[0].endTime;
        dataset.refreshStartTime = refreshTimes[index].value[0].startTime;
        dataset.lastRefreshDuration = durationMinutes.toString();
        return {
            id: dataset.id,
            dataset_name: dataset.datasetName,
            dataset_id: dataset.datasetId,
            dataset_url: `https://app.powerbi.com/groups/${dataset.workspaceId}/settings/datasets/${dataset.datasetId}`,
            refresh_status: dataset.refreshStatus,
            refresh_start_time: dataset.refreshStartTime,
            last_refresh: dataset.lastRefresh,
            refresh_frequency: dataset.refreshFrequency,
            last_refresh_duaration: dataset.lastRefreshDuration,
        };
    });
    res.json(result);
}

async function createGroup(req: Request, res: Response){

    try{
        await dbClient.$transaction(async (dbClient) => {
            const groupDetail = await dbClient.group.create({
                data:{
                    name: req.body.name,
                    description: req.body.description,
                    imageUrl: req.body.imageUrl,
                    tenantId: req.body.tenantId,
                    clientId: req.body.clientId,
                    clientSecret: req.body.clientSecret,
                    createdBy: req.body.createdBy,
                    createdOn: new Date(),
                    updatedOn: new Date,
                    datasets: []
                }
            })
            await dbClient.user.update({
                where: {
                    id: String(req.body.userId),
                },
                data: {
                    groups: {
                        push: groupDetail.id
                    },
                    updatedAt: new Date(),   
                }
            })
        })
        
        res.json({message: "group created successfully"})
    }catch(error) {
        console.log(error)
        res.status(500).json({message: "internal server error"});
    }
}

async function deleteGroup(req: Request, res: Response){
    const groupId = req.params.groupId
    try{
        await dbClient.group.delete({
            where: { id: groupId },
          });
        res.json({
            message: 'group deleted successfully'
        });
    }catch(err){
        res.status(500).json({message: "internal server error"});
    }
}
async function removeDatasetFromGroup(req: Request, res: Response){

} 
export{
    getRefreshStatus,
    createGroup,
    deleteGroup
}