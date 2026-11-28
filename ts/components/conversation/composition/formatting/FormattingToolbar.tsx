import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import ReactTooltip from 'react-tooltip';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  $setSelection,
  BLUR_COMMAND,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  FOCUS_COMMAND,
  FORMAT_TEXT_COMMAND,
  KEY_DOWN_COMMAND,
  LexicalEditor,
  RangeSelection,
  SELECTION_CHANGE_COMMAND,
  TextFormatType,
} from 'lexical';
import { mergeRegister } from '@lexical/utils';
import {
  $getFormatState,
  $getSelectedPlainText,
  $insertLink,
  $removeLink,
  $toggleCodeBlock,
  $toggleInlineFormat,
  $toggleList,
  $toggleQuote,
  EMPTY_FORMAT_STATE,
  FormatState,
  InlineFormat,
  OPEN_LINK_DIALOG_COMMAND,
} from './textFormatting';
import {
  FormatBulletedListIcon,
  FormatCodeBlockIcon,
  FormatInlineCodeIcon,
  FormatLinkIcon,
  FormatNumberedListIcon,
  FormatQuoteIcon,
} from './FormatIcons';

// Text formatting in the message box (Figma Text_Formatting, dark 5773:5729 / white 5808:54273):
// the Aa switch, the toolbar row over the input (02), the quick format bar on a selection (04), the
// Add link popover (05), the code block hint (06) and the keyboard shortcuts. Underline is left out:
// the message format has no underline the other BChat apps would show.

const isMac = typeof navigator !== 'undefined' && /Mac/i.test(navigator.platform);

// Tooltips: the app's own (react-tooltip, shown after 0.5s, the BchatToolTip in the actions panel)
// instead of the native title, which Electron shows late or not at all. Buttons that appear after the
// tooltip layer was set up (the toolbar is shown by "Aa", the quick bar on a selection) have to be
// registered with it again whenever they mount.
const useTooltipRebuild = (active = true) => {
  useEffect(() => {
    if (active) {
      ReactTooltip.rebuild();
    }
  });
};
const tooltipProps = (text: string) => ({
  'data-tip': text,
  'data-place': 'top',
  'data-effect': 'solid',
});
const MOD = isMac ? 'Cmd' : 'Ctrl';
const withShortcut = (label: string, keys: string) => `${label} (${keys})`;

export const useFormatState = (editor: LexicalEditor | null): FormatState => {
  const [state, setState] = useState<FormatState>(EMPTY_FORMAT_STATE);
  useEffect(() => {
    if (!editor) {
      return undefined;
    }
    const read = () => editor.getEditorState().read(() => setState($getFormatState()));
    read();
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) =>
        editorState.read(() => setState($getFormatState()))
      ),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          setState($getFormatState());
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor]);
  return state;
};

/* ---------------------------------------------------------------------------------------------- */
/* buttons                                                                                         */
/* ---------------------------------------------------------------------------------------------- */

type FormatButtonProps = {
  title: string;
  active?: boolean;
  disabled?: boolean;
  className?: string;
  onClick: () => void;
  children: ReactNode;
};

const FormatButton = ({ title, active, disabled, className, onClick, children }: FormatButtonProps) => (
  <button
    type="button"
    {...tooltipProps(title)}
    aria-label={title}
    aria-pressed={!!active}
    disabled={disabled}
    className={classNames('composer-format-btn', className, active && 'is-active')}
    // keep the selection in the message box; the tooltip goes once the button is used
    onMouseDown={e => {
      e.preventDefault();
      ReactTooltip.hide();
    }}
    onClick={onClick}
  >
    {children}
  </button>
);

const InlineButtons = ({
  editor,
  state,
  withLink,
  withCode,
}: {
  editor: LexicalEditor;
  state: FormatState;
  withLink: boolean;
  withCode: boolean;
}) => {
  const { i18n } = window;
  const toggle = (format: InlineFormat) => editor.update(() => $toggleInlineFormat(format));
  const inCode = state.codeBlock;
  return (
    <>
      <FormatButton
        title={withShortcut(i18n('formatBold'), `${MOD}+B`)}
        className="composer-format-btn--bold"
        active={state.bold}
        disabled={inCode}
        onClick={() => toggle('bold')}
      >
        B
      </FormatButton>
      <FormatButton
        title={withShortcut(i18n('formatItalic'), `${MOD}+I`)}
        className="composer-format-btn--italic"
        active={state.italic}
        disabled={inCode}
        onClick={() => toggle('italic')}
      >
        I
      </FormatButton>
      <FormatButton
        title={withShortcut(i18n('formatStrikethrough'), `${MOD}+Shift+X`)}
        className="composer-format-btn--strike"
        active={state.strikethrough}
        disabled={inCode}
        onClick={() => toggle('strikethrough')}
      >
        S
      </FormatButton>
      {withLink && (
        <FormatButton
          title={withShortcut(i18n('formatLink'), `${MOD}+Shift+U`)}
          active={state.link}
          disabled={inCode}
          onClick={() => editor.dispatchCommand(OPEN_LINK_DIALOG_COMMAND, undefined)}
        >
          <FormatLinkIcon />
        </FormatButton>
      )}
      {withCode && (
        <FormatButton
          title={withShortcut(i18n('formatInlineCode'), `${MOD}+Shift+C`)}
          active={state.code}
          disabled={inCode}
          onClick={() => toggle('code')}
        >
          <FormatInlineCodeIcon />
        </FormatButton>
      )}
    </>
  );
};

/** The toolbar row over the input (Figma 5773:6239): B I S | link, 1. list, bullets | quote, `code`, code block. */
export const FormattingToolbar = ({ editor }: { editor: LexicalEditor | null }) => {
  const state = useFormatState(editor);
  useTooltipRebuild(!!editor);
  if (!editor) {
    return null;
  }
  const { i18n } = window;
  const inCode = state.codeBlock;
  return (
    <div className="composer-format-toolbar" role="toolbar" aria-label={i18n('formatText')}>
      <InlineButtons editor={editor} state={state} withLink={false} withCode={false} />
      <span className="composer-format-divider" aria-hidden="true" />
      <FormatButton
        title={withShortcut(i18n('formatLink'), `${MOD}+Shift+U`)}
        active={state.link}
        disabled={inCode}
        onClick={() => editor.dispatchCommand(OPEN_LINK_DIALOG_COMMAND, undefined)}
      >
        <FormatLinkIcon />
      </FormatButton>
      <FormatButton
        title={withShortcut(i18n('formatNumberedList'), `${MOD}+Shift+7`)}
        active={state.number}
        onClick={() => editor.update(() => $toggleList(editor, 'number'))}
      >
        <FormatNumberedListIcon />
      </FormatButton>
      <FormatButton
        title={withShortcut(i18n('formatBulletedList'), `${MOD}+Shift+8`)}
        active={state.bullet}
        onClick={() => editor.update(() => $toggleList(editor, 'bullet'))}
      >
        <FormatBulletedListIcon />
      </FormatButton>
      <span className="composer-format-divider" aria-hidden="true" />
      <FormatButton
        title={withShortcut(i18n('formatQuote'), `${MOD}+Shift+9`)}
        active={state.quote}
        onClick={() => editor.update(() => $toggleQuote())}
      >
        <FormatQuoteIcon />
      </FormatButton>
      <FormatButton
        title={withShortcut(i18n('formatInlineCode'), `${MOD}+Shift+C`)}
        active={state.code}
        disabled={inCode}
        onClick={() => editor.update(() => $toggleInlineFormat('code'))}
      >
        <FormatInlineCodeIcon />
      </FormatButton>
      <FormatButton
        title={withShortcut(i18n('formatCodeBlock'), `${MOD}+Alt+Shift+C`)}
        active={state.codeBlock}
        onClick={() => editor.update(() => $toggleCodeBlock())}
      >
        <FormatCodeBlockIcon />
      </FormatButton>
    </div>
  );
};

/** "Aa" after the emoji button (Figma 5773:6288): shows / hides the toolbar. */
export const FormattingToggle = ({ on, onClick }: { on: boolean; onClick: () => void }) => {
  useTooltipRebuild();
  return (
    <>
      <button
        type="button"
        className={classNames('composer-format-toggle', on && 'is-on')}
        {...tooltipProps(window.i18n('formatText'))}
        aria-label={window.i18n('formatText')}
        aria-pressed={on}
        onMouseDown={e => {
          e.preventDefault();
          ReactTooltip.hide();
        }}
        onClick={onClick}
      >
        Aa
      </button>
      <span className="composer-format-toggle-divider" aria-hidden="true" />
    </>
  );
};

/** Under the input while the caret is in a code block (Figma 5773:7834 "Hint"). */
export const CodeBlockHint = ({ editor }: { editor: LexicalEditor | null }) => {
  const state = useFormatState(editor);
  if (!state.codeBlock) {
    return null;
  }
  return <div className="composer-code-hint">{window.i18n('codeBlockSendHint', [MOD])}</div>;
};

/* ---------------------------------------------------------------------------------------------- */
/* plugins (inside the LexicalComposer)                                                            */
/* ---------------------------------------------------------------------------------------------- */

/** Cmd/Ctrl+B / I go through the markers too; Cmd/Ctrl+U (underline) does nothing. */
export const FormattingShortcutsPlugin = () => {
  const [editor] = useLexicalComposerContext();
  useEffect(
    () =>
      mergeRegister(
        editor.registerCommand(
          FORMAT_TEXT_COMMAND,
          (format: TextFormatType) => {
            if (format === 'bold' || format === 'italic' || format === 'strikethrough' || format === 'code') {
              $toggleInlineFormat(format);
            }
            return true;
          },
          COMMAND_PRIORITY_HIGH
        ),
        editor.registerCommand(
          KEY_DOWN_COMMAND,
          (event: KeyboardEvent) => {
            const mod = isMac ? event.metaKey : event.ctrlKey;
            if (!mod || !event.shiftKey) {
              return false;
            }
            const run = (fn: () => void) => {
              event.preventDefault();
              fn();
              return true;
            };
            switch (event.code) {
              case 'KeyX':
                return run(() => $toggleInlineFormat('strikethrough'));
              case 'KeyU':
                // after the browser's pending selection change, so the popover gets the whole selection
                return run(() =>
                  setTimeout(() => editor.dispatchCommand(OPEN_LINK_DIALOG_COMMAND, undefined), 0)
                );
              case 'Digit7':
                return run(() => $toggleList(editor, 'number'));
              case 'Digit8':
                return run(() => $toggleList(editor, 'bullet'));
              case 'Digit9':
                return run(() => $toggleQuote());
              case 'KeyC':
                return run(() =>
                  event.altKey ? $toggleCodeBlock() : $toggleInlineFormat('code')
                );
              default:
                return false;
            }
          },
          COMMAND_PRIORITY_HIGH
        )
      ),
    [editor]
  );
  return null;
};

/** B I S link `code` over a selection while the toolbar is closed (Figma 5773:6948). */
export const QuickFormatBarPlugin = ({ disabled }: { disabled: boolean }) => {
  const [editor] = useLexicalComposerContext();
  const state = useFormatState(editor);
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null);
  const [focused, setFocused] = useState(false);

  const measure = useCallback(() => {
    const root = editor.getRootElement();
    const domSelection = window.getSelection();
    if (!root || !domSelection || domSelection.rangeCount === 0 || domSelection.isCollapsed) {
      setPosition(null);
      return;
    }
    const range = domSelection.getRangeAt(0);
    if (!root.contains(range.commonAncestorContainer)) {
      setPosition(null);
      return;
    }
    const rect = range.getBoundingClientRect();
    setPosition({ left: rect.left + rect.width / 2, top: rect.top });
  }, [editor]);

  useEffect(
    () =>
      mergeRegister(
        editor.registerUpdateListener(() => measure()),
        editor.registerCommand(
          FOCUS_COMMAND,
          () => {
            setFocused(true);
            return false;
          },
          COMMAND_PRIORITY_LOW
        ),
        editor.registerCommand(
          BLUR_COMMAND,
          () => {
            setFocused(false);
            return false;
          },
          COMMAND_PRIORITY_LOW
        )
      ),
    [editor, measure]
  );

  const visible = !(disabled || !focused || !position || !state.hasSelection || state.codeBlock);
  useTooltipRebuild(visible);
  if (!visible) {
    return null;
  }
  return createPortal(
    <div
      className="quick-format-bar"
      style={{ left: position.left, top: position.top }}
      onMouseDown={e => e.preventDefault()}
    >
      <InlineButtons editor={editor} state={state} withLink={true} withCode={true} />
    </div>,
    document.body
  );
};

/** The Add link popover over the message box (Figma 5773:7369): TEXT / LINK, Cancel / Save. */
export const LinkDialogPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [dialog, setDialog] = useState<{
    saved: RangeSelection | null;
    text: string;
    url: string;
    left: number;
    bottom: number;
  } | null>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(
    () =>
      editor.registerCommand(
        OPEN_LINK_DIALOG_COMMAND,
        () => {
          const state = $getFormatState();
          if (state.codeBlock) {
            return true;
          }
          if (state.link) {
            $removeLink(); // the link button on a link takes the link off
            return true;
          }
          const selection = $getSelection();
          const saved = $isRangeSelection(selection) ? selection.clone() : null;
          const composer = editor.getRootElement()?.closest('.send-message-input');
          const box = composer?.getBoundingClientRect();
          setDialog({
            saved,
            text: $getSelectedPlainText(),
            url: '',
            left: box ? Math.max(12, box.left + 100) : 120,
            bottom: box ? window.innerHeight - box.top + 12 : 120,
          });
          return true;
        },
        COMMAND_PRIORITY_LOW
      ),
    [editor]
  );

  useLayoutEffect(() => {
    if (dialog) {
      (dialog.text ? urlRef : textRef).current?.focus();
    }
    // focus once, when it opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!dialog]);

  const close = useCallback(
    (restore: boolean) => {
      const saved = dialog?.saved;
      setDialog(null);
      editor.focus();
      if (restore && saved) {
        editor.update(() => {
          $setSelection(saved.clone());
        });
      }
    },
    [dialog, editor]
  );

  useEffect(() => {
    if (!dialog) {
      return undefined;
    }
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        close(true);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [dialog, close]);

  if (!dialog) {
    return null;
  }
  const { i18n } = window;
  const canSave = dialog.url.trim().length > 0;
  const save = () => {
    if (!canSave) {
      return;
    }
    const { saved, text, url } = dialog;
    setDialog(null);
    editor.focus();
    editor.update(() => $insertLink(saved, text, url));
  };

  return createPortal(
    <div
      ref={boxRef}
      className="link-popover"
      role="dialog"
      aria-label={i18n('addLink')}
      style={{ left: dialog.left, bottom: dialog.bottom }}
      onKeyDown={e => {
        if (e.key === 'Escape') {
          e.preventDefault();
          e.stopPropagation();
          close(true);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          save();
        }
      }}
    >
      <div className="link-popover__title">{i18n('addLink')}</div>
      <div className="link-popover__fields">
        <label className="link-popover__field">
          <span className="link-popover__label">{i18n('linkTextLabel')}</span>
          <input
            ref={textRef}
            className="link-popover__input"
            value={dialog.text}
            spellCheck={false}
            onChange={e => setDialog({ ...dialog, text: e.target.value })}
          />
        </label>
        <label className="link-popover__field link-popover__field--url">
          <span className="link-popover__label">{i18n('linkUrlLabel')}</span>
          <input
            ref={urlRef}
            className="link-popover__input"
            value={dialog.url}
            spellCheck={false}
            onChange={e => setDialog({ ...dialog, url: e.target.value })}
          />
        </label>
      </div>
      <div className="link-popover__actions">
        <button type="button" className="link-popover__cancel" onClick={() => close(true)}>
          {i18n('cancel')}
        </button>
        <button type="button" className="link-popover__save" disabled={!canSave} onClick={save}>
          {i18n('save')}
        </button>
      </div>
    </div>,
    document.body
  );
};
