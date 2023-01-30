const request = require('supertest')
const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
import testData from '../../test-data.json';
import { v4 as uuidv4 } from 'uuid';

Given('POST request has been sent to parkingSlot', async function (this: any): Promise<void> {
    const post_response = await request(testData.baseUrl).post(`${testData.apiVersion}/parkingSlot`).send({
        "parkingSlotName": uuidv4()
    });
    this.post_response_body = post_response._body
});

Given('PUT request has been sent to previously created parkingSlot', async function (this: any): Promise<void> {
    this.put_request_body = {
        "parkingSlotName": `updated_${uuidv4()}`
    };

    await request(testData.baseUrl).put(`${testData.apiVersion}/parkingSlot/${this.post_response_body.parkingSlot.parkingSlotId}`).send(this.put_request_body);
    this.put_request_body.parkingSlotId = this.post_response_body.parkingSlot.parkingSlotId
});

Given('DELETE the previously created parkingSlot', async function (this: any): Promise<void> {
    const delete_response = await request(testData.baseUrl).delete(`${testData.apiVersion}/parkingSlot/${this.post_response_body.parkingSlot.parkingSlotId}`)
    assert.ok([200, 204].includes(delete_response.statusCode));
    this.delete_response_body = delete_response._body;
});

When('GET request has been sent to parkingSlots', async function (this: any): Promise<void> {
    const get_response = await request(testData.baseUrl).get(`${testData.apiVersion}/parkingSlots`);
    this.get_response_body = get_response._body

    assert.strictEqual(get_response.statusCode, 200);
});

Then('GET response contains the {string} parking slot id, name', async function (this: any, method: string): Promise<void> {
    let data: { parkingSlotId: Number, parkingSlotName: String }

    method == "POSTED" ? data = this.post_response_body.parkingSlot : data = this.put_request_body

    assert.ok(this.get_response_body.parkingSlots.some(function (obj: { parkingSlotId: number, parkingSlotName: string }) {
        return obj.parkingSlotId === data.parkingSlotId && obj.parkingSlotName === data.parkingSlotName;
    }));
});

Then('GET response does NOT contains the previously created parkingSlot', async function (this: any): Promise<void> {
    let data = this.post_response_body.parkingSlot

    assert.ok(!this.get_response_body.parkingSlots.some(function (obj: { parkingSlotId: number, parkingSlotName: string }) {
        return obj.parkingSlotId === data.parkingSlotId && obj.parkingSlotName === data.parkingSlotName;
    }));
});

Then('Each parkingSlot contains id and name', async function (this: any): Promise<void> {
    for (let item of this.get_response_body.parkingSlots) {
        assert.notEqual("", item.parkingSlotId)
        assert.notEqual("", item.parkingSlotName)
        assert.notEqual(null, item.parkingSlotId)
        assert.notEqual(null, item.parkingSlotName)
    }
});