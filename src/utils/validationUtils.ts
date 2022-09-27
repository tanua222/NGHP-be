import { OpenApiValidatorOpts } from 'express-openapi-validator/dist/openapi.validator';
import { AppConfig } from './app-config';
const config = <AppConfig>require('config');
const oasValidation = config.oasValidation;

const orderSpec = require('../api-specs/HierarchyInfo.json');
const validateRequests = oasValidation.validateRequest
  ? { allowUnknownQueryParameters: true }
  : oasValidation.validateRequest;

export const orderValidatorOpts: OpenApiValidatorOpts = {
  apiSpec: orderSpec,
  validateRequests: validateRequests,
  validateResponses: oasValidation.validateResponse,
};
