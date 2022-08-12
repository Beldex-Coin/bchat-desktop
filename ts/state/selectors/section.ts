import { createSelector } from 'reselect';

import { StateType } from '../reducer';
import { OverlayMode, SectionStateType, SectionType } from '../ducks/section';
import { BchatSettingCategory } from '../../components/settings/BchatSettings';

export const getSection = (state: StateType): SectionStateType => state.section;

export const getFocusedSection = createSelector(
  getSection,
  (state: SectionStateType): SectionType => state.focusedSection
);

export const getFocusedSettingsSection = createSelector(
  getSection,
  (state: SectionStateType): BchatSettingCategory | undefined => state.focusedSettingsSection
);

export const getIsAppFocused = createSelector(
  getSection,
  (state: SectionStateType): boolean => state.isAppFocused
);

export const getOverlayMode = createSelector(
  getSection,
  (state: SectionStateType): OverlayMode => state.overlayMode
);
