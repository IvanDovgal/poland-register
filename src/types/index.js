// @flow

import type { $Request, $Response } from 'express';
import type { Logger } from 'bunyan';
import type { MathService } from '../service/math';

export interface ContainsLogger {
  logger: Logger
}

export interface Services extends ContainsLogger {
  mathService: MathService,
}


export interface TrackedRequest extends $Request {
  id: string,
  services: Services
}

export interface TrackedResponse extends $Response {
  services?: Services
}
