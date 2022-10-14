// Copyright 2022 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

import React from 'react';
import { useSelector } from 'react-redux';

import type { LocalizerType } from '../../types/Util';
import type { StateType } from '../reducer';
import type { PropsType as SmartStoryCreatorPropsType } from './StoryCreator';
import { SmartStoryCreator } from './StoryCreator';
import { Stories } from '../../components/Stories';
import { getMe } from '../selectors/conversations';
import { getIntl } from '../selectors/user';
import { getPreferredBadgeSelector } from '../selectors/badges';
import {
  getHasReadReceiptSetting,
  getPreferredLeftPaneWidth,
} from '../selectors/items';
import {
  getSelectedStoryData,
  getStories,
  shouldShowStoriesView,
} from '../selectors/stories';
import { saveAttachment } from '../../util/saveAttachment';
import { useConversationsActions } from '../ducks/conversations';
import { useGlobalModalActions } from '../ducks/globalModals';
import { useStoriesActions } from '../ducks/stories';
import { useToastActions } from '../ducks/toast';

function renderStoryCreator({
  file,
  onClose,
}: SmartStoryCreatorPropsType): JSX.Element {
  return <SmartStoryCreator file={file} onClose={onClose} />;
}

export function SmartStories(): JSX.Element | null {
  const storiesActions = useStoriesActions();
  const { showConversation, toggleHideStories } = useConversationsActions();
  const { showStoriesSettings, toggleForwardMessageModal } =
    useGlobalModalActions();
  const { showToast } = useToastActions();

  const i18n = useSelector<StateType, LocalizerType>(getIntl);

  const isShowingStoriesView = useSelector<StateType, boolean>(
    shouldShowStoriesView
  );

  const preferredWidthFromStorage = useSelector<StateType, number>(
    getPreferredLeftPaneWidth
  );
  const getPreferredBadge = useSelector(getPreferredBadgeSelector);

  const { hiddenStories, myStories, stories } = useSelector(getStories);

  const me = useSelector(getMe);

  const selectedStoryData = useSelector(getSelectedStoryData);

  const isStoriesSettingsVisible = useSelector(
    (state: StateType) => state.globalModals.isStoriesSettingsVisible
  );

  const hasReadReceiptSetting = useSelector(getHasReadReceiptSetting);

  if (!isShowingStoriesView) {
    return null;
  }

  return (
    <Stories
      getPreferredBadge={getPreferredBadge}
      hiddenStories={hiddenStories}
      i18n={i18n}
      me={me}
      myStories={myStories}
      onForwardStory={storyId => {
        toggleForwardMessageModal(storyId);
      }}
      onSaveStory={story => {
        if (story.attachment) {
          saveAttachment(story.attachment, story.timestamp);
        }
      }}
      preferredWidthFromStorage={preferredWidthFromStorage}
      renderStoryCreator={renderStoryCreator}
      showConversation={showConversation}
      showStoriesSettings={showStoriesSettings}
      showToast={showToast}
      stories={stories}
      toggleHideStories={toggleHideStories}
      isViewingStory={selectedStoryData !== undefined}
      isStoriesSettingsVisible={isStoriesSettingsVisible}
      hasReadReceiptSetting={hasReadReceiptSetting}
      {...storiesActions}
    />
  );
}
