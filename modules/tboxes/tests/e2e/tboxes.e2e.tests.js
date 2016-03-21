'use strict';

describe('Tboxes E2E Tests:', function () {
  describe('Test tboxes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/tboxes');
      expect(element.all(by.repeater('tbox in tboxes')).count()).toEqual(0);
    });
  });
});
