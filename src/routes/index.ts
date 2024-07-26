import { Router } from "express";
import {datasetRouter} from './v1/dataset';
import {projectRouter } from './v1/groups';
import { userRouter } from "./v1/user";
const app =  Router();

app.use("/api/v1/dataset", datasetRouter);
app.use("/api/v1/project", projectRouter);
app.use("/api/v1/user", userRouter);

export {
    app as mainRouter
}