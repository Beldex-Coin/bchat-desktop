import { BrowserWindow, Menu } from 'electron';
import { LocaleMessagesType } from './locale';
import { getLogger } from './logging';
import { resolveSpellCheckerLanguages } from './spell_check_languages';

const setSpellCheckerLocale = (
  browserWindow: BrowserWindow,
  appLocale: string,
  spellCheckEnabled: boolean
) => {
  const { session } = browserWindow.webContents;

   if (process.platform === 'darwin') {
    session.setSpellCheckerEnabled(spellCheckEnabled);
    return;
  }

  const logger = getLogger();

  const available = session.availableSpellCheckerLanguages;
  const languages = resolveSpellCheckerLanguages(available, appLocale);
  logger.info(`spellcheck: app locale: ${appLocale}`);
  logger.info('spellcheck: available spellchecker languages:', available);
  logger.info('spellcheck: setting languages to:', languages);

  if (!languages.length) {
    logger.info(`spellcheck: no dictionary for ${appLocale}, disabling the spellchecker`);
    session.setSpellCheckerEnabled(false);
    return;
  }

  session.setSpellCheckerLanguages(languages);
  session.setSpellCheckerEnabled(spellCheckEnabled);
};

export const setup = (
  browserWindow: BrowserWindow,
  messages: LocaleMessagesType,
  appLocale: string,
  spellCheckEnabled: boolean
) => {
  setSpellCheckerLocale(browserWindow, appLocale, spellCheckEnabled);

  browserWindow.webContents.on('context-menu', (_event: any, params: any) => {
    const { editFlags } = params;
    const isMisspelled = Boolean(params.misspelledWord);
    const showMenu = params.isEditable || editFlags.canCopy;

    // Popup editor menu
    if (showMenu) {
      const template = [];

      if (isMisspelled) {
        if (params.dictionarySuggestions.length > 0) {
          template.push(
            ...params.dictionarySuggestions.map((label: any) => ({
              label,
              click: () => {
                browserWindow.webContents.replaceMisspelling(label);
              },
            }))
          );
        } else {
          template.push({
            label: messages.contextMenuNoSuggestions,
            enabled: false,
          });
        }
        template.push({ type: 'separator' });
      }

      if (params.isEditable) {
        if (editFlags.canUndo) {
          template.push({ label: messages.editMenuUndo, role: 'undo' });
        }
        // This is only ever `true` if undo was triggered via the context menu
        // (not ctrl/cmd+z)
        if (editFlags.canRedo) {
          template.push({ label: messages.editMenuRedo, role: 'redo' });
        }
        if (editFlags.canUndo || editFlags.canRedo) {
          template.push({ type: 'separator' });
        }
        if (editFlags.canCut) {
          template.push({ label: messages.editMenuCut, role: 'cut' });
        }
      }

      if (editFlags.canPaste) {
        template.push({ label: messages.editMenuPaste, role: 'paste' });
      }

      // Only enable select all in editors because select all in non-editors
      // results in all the UI being selected
      if (editFlags.canSelectAll && params.isEditable) {
        template.push({
          label: messages.editMenuSelectAll,
          role: 'selectall',
        });
      }

      const menu = Menu.buildFromTemplate(template);
      menu.popup({ window: browserWindow });
    }
  });
};
