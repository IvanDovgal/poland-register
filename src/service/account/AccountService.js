// @flow

import request from 'request-promise-native';
import db from 'request-debug';
import cheerio from 'cheerio';
import fs from 'fs';
import { WritableStreamBuffer } from 'stream-buffers';

db(request);

const transform = body => cheerio.load(body);

const apiKey = '8e48b02124dc73dae2cb401e21bede9d';

const defer = timeout => new Promise(resolve => setTimeout(resolve, timeout));

export default class AccountService {
  async register({
    password,
    firstName,
    lastName,
    userName,
    contactNumber,
  }: {
    password: string,
    firstName: string,
    lastName: string,
    userName: string,
    contactNumber: string }) {
    const jar = request.jar();
    const page = await request.get({
      url: 'https://online.vfsglobal.com/GlobalAppointment/Account/RegisterUser',
      jar,
      transform,
    });
    const captchaId = page('input[name="CaptchaDeText"]').val();
    const requestVerificationToken = page('input[name="__RequestVerificationToken"]').val();
    const reCaptchaURL = page('#reCaptchaURL').val();
    const reCaptchaPublicKey = page('#reCaptchaPublicKey').val();
    const reCaptchaPrivateKey = page('#reCaptchaPrivateKey').val();
    const IsGoogleCaptchaEnabled = page('#IsGoogleCaptchaEnabled').val();
    const image = await request.get({
      jar,
      url: `https://online.vfsglobal.com/GlobalAppointment/DefaultCaptcha/Generate?t=${captchaId}`,
      encoding: null,
      headers: {
        Referer: 'https://online.vfsglobal.com/GlobalAppointment/Account/RegisteredLogin',
        Accept: 'image/webp,image/apng,image/*,*/*;q=0.8',
      },
    });
    const formData = {
      body: image.toString('base64'),
      method: 'base64',
      key: apiKey,
      regsense: 1,
      json: 1,
    };
    const captchaParseResponse = await request.post({ url: 'http://2captcha.com/in.php', formData, json: true });
    if (captchaParseResponse.status === 1) {
      let captchaResultResponse;
      let tryCount = 0;
      do {
        if (tryCount === 5) throw new Error('Could not recognize captcha');
        await defer(tryCount === 0 ? 20000 : 2000);
        captchaResultResponse = await request.get({
          url: 'http://2captcha.com/res.php',
          formData,
          json: true,
          qs: {
            id: captchaParseResponse.request, key: apiKey, json: 1, action: 'get',
          },
        });
        tryCount++;
      } while (captchaResultResponse.status !== 1);
      const captchaText = captchaResultResponse.request;
      let registerResult;
      try {
        await defer(40000);
        registerResult = await request.post({
          url: 'https://online.vfsglobal.com/GlobalAppointment/Account/RegisterUser',
          jar,
          form: {
            __RequestVerificationToken: requestVerificationToken,
            IsGoogleCaptchaEnabled,
            reCaptchaURL,
            reCaptchaPublicKey,
            reCaptchaPrivateKey,
            FirstName: firstName,
            LastName: lastName,
            UserName: userName,
            ContactNo: contactNumber,
            Password: password,
            ConfirmPassword: password,
            CaptchaDeText: captchaId,
            CaptchaInputText: captchaText,
          },
          transform,
        });
      } catch (e) {
        return true;
      }
      if (registerResult.html().indexOf('Invalid reCAPTCHA') > 0) {
        throw new Error('captcha error');
      }
      if (registerResult('.validation-summary-errors').length) {
        throw new Error('unknown error');
      }
    }
    return true;
  }
}
