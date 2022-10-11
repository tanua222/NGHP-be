import express from 'express';
import {
  mapExchangeGetReqToRequestParam
} from '../middleware/haa/haa-req-mapper';
import ExchangeAddService from '../services/exchange/exchange-add.service';
import ExchangeGetService from '../services/exchange/exchange-get.service';
import ExchangeUpdateService from '../services/exchange/exchange-update.service';


import { executeGet, executePostTask } from '../utils/execute';

const router: express.Router = express.Router();

// todo add normal js docs
/** 
  wget --no-check-certificate --quiet \
  --method GET \
  --timeout=0 \
  --header '' \
   'http://localhost:3006/ivsHierarchy/v1/exchange?offset=0&sort=abbreviation&filter=14&limit=10'
**/
router.get('/', executeGet(ExchangeGetService, mapExchangeGetReqToRequestParam));
/**
  wget --no-check-certificate --quiet \
  --method POST \
  --timeout=0 \
  --header 'Content-Type: application/json' \
  --body-data '{
    "abbreviation": "test-55",
    "bookNumber": "06",
    "createdTs": "2016-11-01T12:52:48.475Z",
    "createdUserId": "DATA_SETUP",
    "fullName": "ZEBALLOS",
    "lastUpdatedTs": "2016-11-01T12:52:48.515Z",
    "lastUpdatedUserId": "DATA_SETUP",
    "secondAbbreviation": null,
    "sectionNumber": "20",
    "npa": [
        {
            "npa": "238"
        },
        {
            "npa": "778"
        }
    ]
}' \
   'http://localhost:3006/ivsHierarchy/v1/exchange'
 */
router.post('/', executePostTask(ExchangeAddService));

router.post('/update', executePostTask(ExchangeUpdateService));

export default router;
