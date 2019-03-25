// @flow

import { createLogger } from 'bunyan';
import { Client } from 'pg';
import { SMTPServer } from 'smtp-server';
import createApp from './app';
import createPostgresLogStreamAsync from './misc/postgresLogStream';
import AccountService from './service/account/AccountService';
import MailService from './service/mail/MailService';
import cheerio from 'cheerio';
import request from 'request-promise-native';

/*
const PORT = process.env.PORT || 3000;

const startServer = async ({ port }) => {
  const client = new Client();
  await client.connect();
  const logger = createLogger({
    name: 'app',
    streams: [
      {
        stream: process.stdout,
      },
      {
        stream: await createPostgresLogStreamAsync({ client }),
      },
    ],
  });
  const app = createApp({
    logger,
    accessLogger: logger.child({
      streams: [
        {
          level: 'info',
          path: 'access.log',
        },
      ],
    }),
    errorLogger: logger.child({
      streams: [
        {
          level: 'error',
          path: 'error.log',
        },
      ],
    }),
  });

  app.listen(port, () => {
    logger.info({
      port,
    }, `App started on port ${port}`);
  });
};

startServer({ port: PORT }).then(() => {});
*/
const mailService = new MailService();
const smtpServer = new SMTPServer({
  name: '45.79.213.78',
  authOptional: true,
  onData: mailService.onDataHandler.bind(mailService),
});
smtpServer.listen(25);
const accountService = new AccountService({ mailService });

const activate = async  (email) => {
  const { html } = await mailService.receive(email);
  const activateUrl = cheerio.load(html)('a').first().attr('href');
  await request(activateUrl);
}

const register = async (options) => {
  const p1 = activate(options.userName);
  const p2 = accountService.register(options);
  await Promise.all([p1, p2]);
}
(async () => {
  await register({
    password: 'C@rbon1278',
    firstName: 'Georg',
    lastName: 'Hatz',
    userName: 'testuser999@45.79.213.78',
    contactNumber: '99342992',
  });
})();
