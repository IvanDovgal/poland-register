// @flow

import type { Client } from 'pg';
import type { BunyanRecord, Writable } from 'bunyan';

const createLogTableStatement = ({ tableName }) => `
  CREATE TABLE IF NOT EXISTS ${tableName} (
    id SERIAL,
    log JSONB
  );
`;

const createInsertStatement = ({ tableName }) => `INSERT INTO ${tableName}(log) VALUES ($1)`;

class PostgresLogStream {
  client: Client;

  statement: string;

  constructor({ tableName, client }) {
    this.client = client;
    this.statement = createInsertStatement({ tableName });
  }

  write(data: BunyanRecord) {
    this.client.query(this.statement, [data]);
  }
}

export type PostgresLogStreamOptions = {
  tableName?: string,
  autoCreate?: boolean,
  client: Client,
}

export default async ({
  tableName = 'log',
  autoCreate = true,
  client,
}: PostgresLogStreamOptions): Promise<Writable> => {
  if (autoCreate) await client.query(createLogTableStatement({ tableName }));
  return new PostgresLogStream({ tableName, client });
};
