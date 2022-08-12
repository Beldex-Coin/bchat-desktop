import { _electron, Page } from '@playwright/test';
import _ from 'lodash';
import { clickOnMatchingText, clickOnTestIdWithText, typeIntoInput } from '../utils';
import { openAppAndWait } from './open';
const multisAvailable = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export type UserLoggedInType = {
  userName: string;
  bchatid: string;
  recoveryPhrase: string;
};

export const newUser = async (window: Page, userName: string): Promise<UserLoggedInType> => {
  // Create User
  // await clickOnMatchingText(window, 'Create Bchat ID');
  await clickOnMatchingText(window, 'Create Account');

  // Wait for animation for finish creating ID
  await window.waitForTimeout(1500);
  //Save bchat ID to a variable
  const bchatid = await window.inputValue('[data-testid=bchat-id-signup]');
  await clickOnMatchingText(window, 'Continue');
  // Input username = testuser
  await typeIntoInput(window, 'display-name-input', userName);
  await clickOnMatchingText(window, 'Get started');
  // save recovery phrase
  await clickOnMatchingText(window, 'Reveal Recovery Phrase');
  const recoveryPhrase = await window.innerText('[data-testid=recovery-phrase-seed-modal]');

  await window.click('.bchat-icon-button.small');
  return { userName, bchatid, recoveryPhrase };
};

const openAppAndNewUser = async (multi: string): Promise<UserLoggedInType & { window: Page }> => {
  const window = await openAppAndWait(multi);

  const userName = `${multi}-user`;
  const loggedIn = await newUser(window, userName);
  return { window, ...loggedIn };
};

export async function openAppsAndNewUsers(windowToCreate: number) {
  if (windowToCreate >= multisAvailable.length) {
    throw new Error(`Do you really need ${multisAvailable.length} windows?!`);
  }
  // if windowToCreate = 3, this array will be ABC. If windowToCreate = 5, this array will be ABCDE
  const multisToUse = multisAvailable.slice(0, windowToCreate);
  const loggedInDetails = await Promise.all(
    [...multisToUse].map(async m => {
      return openAppAndNewUser(m);
    })
  );

  const windows = loggedInDetails.map(w => w.window);
  const users = loggedInDetails.map(w => {
    return _.pick(w, ['bchatid', 'recoveryPhrase', 'userName']);
  });
  return { windows, users };
}

export async function openAppsNoNewUsers(windowToCreate: number) {
  if (windowToCreate >= multisAvailable.length) {
    throw new Error(`Do you really need ${multisAvailable.length} windows?!`);
  }
  // if windowToCreate = 3, this array will be ABC. If windowToCreate = 5, this array will be ABCDE
  const multisToUse = multisAvailable.slice(0, windowToCreate);
  return Promise.all(
    [...multisToUse].map(async m => {
      return openAppAndWait(m);
    })
  );
}

export async function existingUser() {
  const recoveryPhraseTest =
    'pinched total ongoing sushi etched rest gone long oilfield incur code grunt code';
  const newUsername = 'new-username';
  // const bchatIDTest = '05560802be231abc2fbaa860f09da4c2f20dafa4e5f560f77d61c5f587ef2c741f';
  // const contactOne = 'Fish';
  // const contactTwo = 'Dragon';
  // const contactThree = 'Whale';
  // const contactFour = 'Gopher';
  const [windowA1] = await openAppsNoNewUsers(1);

  await clickOnTestIdWithText(windowA1, 'restore-using-recovery');
  await typeIntoInput(windowA1, 'recovery-phrase-input', recoveryPhraseTest);
  await typeIntoInput(windowA1, 'display-name-input', newUsername);
  await clickOnTestIdWithText(windowA1, 'continue-bchat-button');
  // await clickOnTestIdWithText(windowA1, 'leftpane-primary-avatar');
  // const bchatIDTest = await waitForTestIdWithText(windowA1, 'your-bchat-id');
  return existingUser;
}
