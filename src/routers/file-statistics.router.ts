import express from 'express';
import {
  mapFileStatisticsGetReqToRequestParam
} from '../middleware/haa/haa-req-mapper';
import FileStatisticsGetService from '../services/file-statistics/file-statistics-get.service';
import { executeGet } from '../utils/execute';

const router: express.Router = express.Router();

// todo: add a normal js docs
// !!! if want to get a result your have to go to mapper and changes or remove WHERE conditions
/**
wget --no-check-certificate --quiet \
  --method GET \
  --timeout=0 \
  --header '' \
   'http://localhost:3006/ivsHierarchy/v1/homepage?offset=0&telusInd=N&webTZ=PST&limit=20'
 */
router.get('/', executeGet(FileStatisticsGetService, mapFileStatisticsGetReqToRequestParam));

export default router;
