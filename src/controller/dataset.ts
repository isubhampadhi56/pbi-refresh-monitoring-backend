import { triggerRefresh,getRefreshSchedule,getDatasetName } from "../pkg/pbiapi";
import { Request,Response } from "express";
import { accessToken,dbClient } from "../config/config"

async function pbiTriggerRefresh(req: Request, res: Response){
    const datasetId = req.body.datasetId;
    try{
        const datasetDetail = await dbClient.datasetDetail.findFirst({ 
            where: {datasetId: datasetId}
        });
        const responseCode = await triggerRefresh(datasetDetail?.workspaceId,datasetDetail?.datasetId,accessToken.pbi);
        if(responseCode === 202){
            res.json({
                "message": "refresh triggered successfully"
            });
        }
    }catch(error:any){
        res.status(500).json({message: error.response ? error.response.data.Message : 'No response data'});
    }
}

async function pbiRefreshSchedule(req: Request, res: Response){
    const datasetId = String(req.query.datasetId);
    console.log(datasetId);
    try{
        const data = await getRefreshSchedule(datasetId,accessToken.pbi);
        res.json(data);
    }catch(err){
        res.json({"message": "something went wrong"})
    }
}

async function addDataset(req: Request,res: Response){
    const datasetUrl = new URL(req.body.datasetURL);
    const groupId = req.body.groupId;
    console.log(groupId);
    console.log(datasetUrl);
    const pathSegments = datasetUrl.pathname.split('/');
    if(pathSegments.length < 4){
        res.status(404).json({message: "invalid url"});
        return;
    }
    const workspaceId = pathSegments[2];
    const datasetId = pathSegments[4]; 
    let datasetName = ""
    try{
        const userInfo = await dbClient.user.findMany({
            where: { id: req.body.userId,
                groups:{
                    has:groupId
                }
            }
        })
        if(!userInfo){
            res.status(403).json({message: "Group with ID ${groupId} not found"});
        }
    }catch(error){
        res.status(500).json({message: "internal server error"});
        return;
    }
    try{
        datasetName = await getDatasetName(workspaceId,datasetId,accessToken.pbi);
    }catch(err){
        res.status(404).json({message: "unable to retrieve dataset"})
        return
    }
    try{
        await dbClient.$transaction(async (dbClient) =>{
            await dbClient.datasetDetail.create({
                data: {
                  datasetId: datasetId,
                  datasetName: datasetName,
                  workspaceId: workspaceId,
                  refreshFrequency: "Daily",
                },
            });
            await dbClient.group.update({
                where: { id: groupId },
                data: {
                  datasets: {
                    push: datasetId,
                  },
                  updatedOn: new Date,
                },
            });
        })
    
        res.json({message: "dataset created successfully"});
    }catch(err){
        console.log(err);
        res.status(500).json({message: "internal server error"});
    }
}

async function deleteDataset(req: Request, res: Response){
    const groupId = req.body.groupId;
    const datasetId = req.body.datasetId;
    try {
        const group = await dbClient.group.findUnique({
          where: { id: groupId },
          select: { datasets: true },
        });

        if (!group) {
          res.json({message:`Group with ID ${groupId} not found`});
          return
        }

        if (!group.datasets.includes(datasetId)) {
          res.json({message: `Dataset ID ${datasetId} does not belong to Group with ID ${groupId}`});
          return
        }
    
        const updatedDatasets = group.datasets.filter(ds => ds !== datasetId);
    
        await dbClient.$transaction(async (dbClient) =>{
            await dbClient.datasetDetail.delete({
                where:{
                    datasetId: datasetId,
                }
            });
            await dbClient.group.update({
                where: { id: groupId },
                data: {
                  datasets: updatedDatasets,
                  updatedOn: new Date(),
                },
            });
        });
        res.json({message: 'dataset deleted successfully'})
    } catch (error) {
        console.log(error)
        res.status(400).json({message: "error deleting dataset"})
    }
}

export{
    pbiRefreshSchedule,
    pbiTriggerRefresh,
    addDataset,
    deleteDataset
}
