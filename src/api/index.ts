import { getAreaCouncils } from "./getAreaCouncils";
import { getProvinces } from "./getProvinces";
import { getClusters } from "./getClusters";
import { getDatasets, getDatasetData } from "./getDatasets";
import {
  downloadTabularDataset,
  downloadVectorDatasetFromCache,
} from "./downloadDataset";

export default {
  getProvinces,
  getAreaCouncils,
  getClusters,
  getDatasets,
  getDatasetData,
  downloadTabularDataset,
  downloadVectorDatasetFromCache,
};
