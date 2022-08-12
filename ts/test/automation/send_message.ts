import { _electron, Page } from '@playwright/test';
import { messageSent } from './message';
import { clickOnTestIdWithText, typeIntoInput } from './utils';

export const sendNewMessage = async (window: Page, bchatid: string, message: string) => {
  await clickOnTestIdWithText(window, 'new-conversation-button');
  // Enter bchat ID of USER B
  await typeIntoInput(window, 'new-bchat-conversation', bchatid);
  // click next
  await clickOnTestIdWithText(window, 'next-new-conversation-button', 'Next');
  await messageSent(window, message);
};
