import { EventBitTestHarnessPage } from './app.po';

describe('event-bit-test-harness App', function() {
  let page: EventBitTestHarnessPage;

  beforeEach(() => {
    page = new EventBitTestHarnessPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
