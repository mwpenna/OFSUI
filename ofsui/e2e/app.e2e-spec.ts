import { OfsuiPage } from './app.po';

describe('ofsui App', () => {
  let page: OfsuiPage;

  beforeEach(() => {
    page = new OfsuiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
