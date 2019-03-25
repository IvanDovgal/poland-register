// @flow

import { createLogger } from 'bunyan';
import { Client } from 'pg';
import { SMTPServer } from 'smtp-server';
import createApp from './app';
import createPostgresLogStreamAsync from './misc/postgresLogStream';
import AccountService from './service/account/AccountService';
import MailService from './service/mail/MailService';

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


(async () => {
  const p1 = mailService.receive('root599@45.79.213.78');
  const p2 = accountService.register({
    password: 'C@rbon1278',
    firstName: 'Georg',
    lastName: 'Hatz',
    userName: 'root599@45.79.213.78',
    contactNumber: '99355992',
  });
  console.log(await Promise.all([p1, p2]));
})();
