import helmet from 'helmet';
import cors from 'cors';
import * as bodyParser from 'body-parser';

import express from 'express';
import compression from 'compression';
import morgan from 'morgan';


import Routes from '../infra/http/routes/routes';

import {
  BODY_PARSER_LIMIT,
  MORGAN_FORMAT,
} from '../shared/constants/app.constants';

export class Application {
  public express!: express.Application;
  //public expressOasGenerator = require('express-oas-generator');
  public swaggerUi = require('swagger-ui-express');
  public swaggerFile = require('../../swagger_output.json')


  public constructor() {
    this.initialize();
  }

  protected initialize(): void {
    this.express = express();
    
    
   // this.expressOasGenerator.init(this.express, {});
    this.express.use(cors());
    this.express.use(helmet());
    this.express.use(compression());
    this.express.use(bodyParser.json({ limit: BODY_PARSER_LIMIT }));
    this.express.use(
      bodyParser.urlencoded({ limit: BODY_PARSER_LIMIT, extended: true })
    );
    this.express.use(morgan(MORGAN_FORMAT));
    this.express.use(Routes);
    this.express.use('/doc', this.swaggerUi.serve, this.swaggerUi.setup(this.swaggerFile))
    //this.connectDatabase();
  }
}

export default new Application().express;
