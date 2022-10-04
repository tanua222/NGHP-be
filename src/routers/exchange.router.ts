import express from 'express';
import {
  mapExchangeGetReqToRequestParam
} from '../middleware/haa/haa-req-mapper';
import ExchangeService from '../services/exchange.service';
import { executeGet } from '../utils/execute';

const router: express.Router = express.Router();

// todo add normal js docs
/** 
  wget --no-check-certificate --quiet \
  --method GET \
  --timeout=0 \
  --header '' \
   'http://localhost:3006/ivsHierarchy/v1/exchange?offset=0&sort=abbrev&filter=14&limit=10'
**/
router.get('/', executeGet(ExchangeService, mapExchangeGetReqToRequestParam));

export default router;
