import { simpleParser } from 'mailparser';

async function extractBody(stream) {
  const { textAsHtml, text, html } = await simpleParser(stream);
  return { textAsHtml, text, html };
}

export default class MailService {
  map = new Map();

  onDataHandler(stream, session, callback) {
    (async () => {
      await Promise.all(session.envelope.rcptTo.map(async ({ address }) => {
        const resolve = this.map.get(address);
        if (resolve) {
          this.map.delete(address);
          resolve(await extractBody(stream));
        }
      }));
      callback();
    })(stream, session, callback);
  }


  receive(address) {
    return new Promise(((resolve) => {
      this.map.set(address, resolve);
    }));
  }
}
