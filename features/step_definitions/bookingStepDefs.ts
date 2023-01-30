const request = require('supertest')
const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
import { checkDiff } from '../utility'
import testData from '../../test-data.json';
import { v4 as uuidv4 } from 'uuid';

Given('POST request has been sent: {string}, {int} hour length', async function (this: any, day: String, hourLength: Number): Promise<void> {
  this.t1 = new Date();
  this.t2 = new Date();
  this.userId = uuidv4();

  switch (day) {
    case "yesterday": {
      this.t1.setDate(this.t1.getDate() - 1);
      this.t2.setDate(this.t2.getDate() - 1);
      break;
    }
    case "next year": {
      this.t1.setDate(this.t1.getDate() + 365);
      this.t2.setDate(this.t2.getDate() + 365);
      break;
    }
    case "current date + 5000": {
      this.t1.setDate(this.t1.getDate() + 365 * 5000);
      this.t2.setDate(this.t2.getDate() + 365 * 5000);
      break;
    }
    case "empty": {
      this.t1 = "";
      this.t2 = "";
      break;
    }
  }

  switch (hourLength) {
    case -1: {
      this.t1.setHours(this.t1.getHours() + 3);
      this.t2.setHours(this.t2.getHours() + 2);
      break;
    }
    case 1: {
      this.t1.setHours(this.t1.getHours() + 2);
      this.t2.setHours(this.t2.getHours() + 3);
      break;
    }
    case 10: {
      this.t1.setHours(this.t1.getHours() + 2);
      this.t2.setHours(this.t2.getHours() + 12);
      break;
    }
    case 0: {
      this.t1 = "";
      this.t2 = "";
      break;
    }
  }

  const payload = {
    "userId": this.userId,
    "startDate": this.t1.toISOString(),
    "endDate": this.t2.toISOString()
  }

  const post_response = await request(testData.baseUrl).post(`${testData.apiVersion}/booking`).send(payload);
  this.post_response_body = post_response._body

  //assert.strictEqual(response.statusCode, 200);
});

Given('POST request has been sent with previous date', async function (this: any): Promise<void> {
  const payload = {
    "userId": this.userId,
    "startDate": this.t1.toISOString(),
    "endDate": this.t2.toISOString()
  }

  const post_response = await request(testData.baseUrl).post(`${testData.apiVersion}/booking`).send(payload);
  this.post_response_body = post_response._body

  //assert.strictEqual(response.statusCode, 200);
});

Given('Incorrect POST request has been sent: {string} input', async function (this: any, cond: String): Promise<void> {
  let payload = {}
  this.t1 = new Date();
  this.t2 = new Date();
  this.userId = uuidv4();

  switch (cond) {
    case "empty date": {
      payload = {
        "userId": this.userId,
        "startDate": "",
        "endDate": ""
      }
      break;
    }
    case "empty userId": {
      payload = {
        "userId": "",
        "startDate": this.t1.setHours(this.t1.getHours() + 2),
        "endDate": this.t2.setHours(this.t2.getHours() + 3)
      }
      break;
    }
  }

  const post_response = await request(testData.baseUrl).post(`${testData.apiVersion}/booking`).send(payload);
  this.post_response_body = post_response._body

  //assert.strictEqual(response.statusCode, 200);
});

When('DELETE request has been sent: previously used booking id', async function (this: any): Promise<void> {
  const delete_response = await request(testData.baseUrl).delete(`${testData.apiVersion}/booking/${this.post_response_body.bookingId}`);
  assert.ok([200, 204].includes(delete_response.statusCode));
  this.delete_response_body = delete_response._body
});

When('DELETE request has been sent with {}', async function (this: any, cond: String | Number): Promise<void> {
  const delete_response = await request(testData.baseUrl).delete(`${testData.apiVersion}/booking/${cond}`);
  assert.ok([400, 404].includes(delete_response.statusCode));
  this.delete_response_body = delete_response._body
});

Then('POST request should return 3 error code and {string}', async function (this: any, errMsg: String): Promise<void> {
  assert.equal(this.post_response_body.code, 3);
  assert.equal(this.post_response_body.message, errMsg);
});

When('GET request has been sent with the previously used userId', async function (this: any): Promise<void> {
  const get_response = await request(testData.baseUrl).get(`${testData.apiVersion}/booking?userId=${this.userId}`);
  this.get_response_body = get_response._body

  assert.strictEqual(get_response.statusCode, 200);
});

When('GET request has been sent with the previously used bookingId', async function (this: any): Promise<void> {
  const get_response = await request(testData.baseUrl).get(`${testData.apiVersion}/booking?userId=${this.userId}`);
  this.get_response_body = get_response._body

  assert.strictEqual(get_response.statusCode, 200);
});

Then('GET response contains expected types', async function (this: any): Promise<void> {
  const res_body = this.get_response_body

  assert.ok(res_body instanceof Object, `get_response_body content should be an Object`)
  assert.ok(res_body.bookingsByUser instanceof Array, `bookingsByUser content should be an Array`)

  res_body.bookingsByUser.forEach((obj: { bookingId: Number, parkingSlotName: String, startDate: String, endDate: String }) => {
    assert.ok(typeof obj.bookingId === "number", `bookingId content should be a Number`)
    assert.ok(typeof obj.parkingSlotName === "string", `parkingSlotName content should be a String`)
    assert.ok(typeof obj.startDate === "string", `startDate content should be a String`)
    assert.ok(typeof obj.endDate === "string", `endDate content should be a String`)
  });
});

Then('GET response contains {int} booking', async function (this: any, booking_length: Number): Promise<void> {
  assert.equal(booking_length, this.get_response_body.bookingsByUser.length)
});

Then('GET response booking\'s should have different ids', async function (this: any): Promise<void> {
  const arr: Array<String> = []

  for (let item of this.get_response_body.bookingsByUser) {
    arr.push(item.parkingSlotName);
  }

  assert.ok(!checkDiff(arr))
});

Then(`GET response\'s booking contains id between {int}-{int}`, async function (this: any, bottom: Number, top: Number): Promise<void> {
  const res_body = this.get_response_body

  res_body.bookingsByUser.forEach((obj: { bookingId: Number }) => {
    assert.ok(obj.bookingId > bottom, true, `bookingId content should be greater than ${bottom}`)
    assert.ok(obj.bookingId < top, true, `bookingId content should be lwr than ${top}`)
  });
});

Then(`GET response\'s booking startDate and endDate are the previously added ones`, async function (this: any): Promise<void> {
  const res_body = this.get_response_body

  res_body.bookingsByUser.forEach((obj: { startDate: String, endDate: String }) => {
    assert.equal(obj.startDate, this.t1.toISOString(), `startDate should be the previously posted one`)
    assert.equal(obj.endDate, this.t2.toISOString(), `endDate should be the previously posted one`)
  });
});