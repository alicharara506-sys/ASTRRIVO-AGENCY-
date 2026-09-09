import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { deliveryState } from '../lib/contact-contract.ts';

test('uncertain, missing, false or merely truthy delivery responses never confirm receipt', () => {
  for (const value of [null, undefined, {}, { ok: true }, { delivered: false }, { delivered: 'true' }, { accepted: 1 }, '<html>OK</html>']) assert.equal(deliveryState(value), null);
});
test('queued receipt and completed delivery remain distinct', () => {
  assert.equal(deliveryState({ accepted: true }), 'accepted');
  assert.equal(deliveryState({ delivered: true }), 'delivered');
  assert.equal(deliveryState({ accepted: true, delivered: true }), 'delivered');
});
test('the published service model covers all 26 brief requirements with four business answers', () => {
  const { disciplines } = JSON.parse(fs.readFileSync(new URL('../content/services.json', import.meta.url), 'utf8'));
  const expected = {
    Brand: ['Strategy', 'Naming', 'Identity', 'Packaging'],
    Digital: ['Content', 'Social', 'Campaigns', 'Motion'],
    Technology: ['Websites', 'Commerce', 'UI/UX', 'Web Apps', 'APIs', '3D Web'],
    AI: ['AI Agents', 'Automation', 'Knowledge Systems', 'Voice AI', 'Vision AI'],
    Analytics: ['KPIs', 'Dashboards', 'Funnels', 'Forecasts', 'Reports', 'Insights', 'Growth'],
  };
  assert.deepEqual(disciplines.map(d => d.name), Object.keys(expected));
  const slugs = new Set();
  for (const discipline of disciplines) {
    assert.deepEqual(discipline.services.map(s => s.name), expected[discipline.name]);
    for (const service of discipline.services) {
      assert.ok(!slugs.has(service.slug), `Duplicate slug: ${service.slug}`);
      slugs.add(service.slug);
      for (const field of ['description', 'problem', 'outcomes']) assert.ok(service[field].length > 25, `${service.name} missing ${field}`);
      assert.ok(service.deliverables.length >= 3);
      assert.ok(service.deliverables.every(item => item.length > 8));
    }
  }
  assert.equal(slugs.size, 26);
});
