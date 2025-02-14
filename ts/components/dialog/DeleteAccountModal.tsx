import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ed25519Str } from '../../bchat/onions/onionPath';
import { forceNetworkDeletion } from '../../bchat/apis/snode_api/SNodeAPI';
import { forceSyncConfigurationNowIfNeeded } from '../../bchat/utils/syncUtils';
import { updateConfirmModal, updateDeleteAccountModal } from '../../state/ducks/modalDialog';
import { BchatButton, BchatButtonColor } from '../basic/BchatButton';
import { BchatHtmlRenderer } from '../basic/BchatHTMLRenderer';
// import { BchatSpinner } from '../basic/BchatSpinner';
import { BchatWrapperModal } from '../BchatWrapperModal';

import * as Data from '../../data/data';
import { deleteAllLogs } from '../../node/logs';
import { BchatIcon } from '../icon/BchatIcon';
// import { wallet } from '../../wallet/wallet-rpc';
// import { kill } from 'cross-port-killer';
// import { HTTPError } from '../../bchat/utils/errors';

export const deleteDbLocally = async (deleteType?: string) => {
  // wallet
  // .closeWallet()
  // .then(() => {
  // kill(64371)
  //     .then(() => {
  //       console.log('killed port.....');
  //     })
  //     .catch(err => {
  //       throw new HTTPError('beldex_rpc_port', err);
  //     });
  // })
  // .catch(err => {
  //   throw new HTTPError('close wallet error', err);
  // });
  window?.log?.info('last message sent successfully. Deleting everything');
  window.persistStore?.purge();
  await deleteAllLogs();
  if (deleteType === 'oldVersion') {
    await Data.removeAllWithOutRecipient();
  } else {
    await Data.removeAll();
  }
  await Data.close();
  await Data.removeDB();
  await Data.removeOtherData();
  window.localStorage.setItem('restart-reason', 'delete-account');
};

export async function sendConfigMessageAndDeleteEverything(deleteType?: string) {
  try {
    // DELETE LOCAL DATA ONLY, NOTHING ON NETWORK
    window?.log?.info('DeleteAccount => Sending a last SyncConfiguration');

    // be sure to wait for the message being effectively sent. Otherwise we won't be able to encrypt it for our devices !
    await forceSyncConfigurationNowIfNeeded(true);
    window?.log?.info('Last configuration message sent!');
    await deleteDbLocally(deleteType);
    window.restart();
  } catch (error) {
    // if an error happened, it's not related to the delete everything on network logic as this is handled above.
    // this could be a last sync configuration message not being sent.
    // in all case, we delete everything, and restart
    window?.log?.error(
      'Something went wrong deleting all data:',
      error && error.stack ? error.stack : error
    );
    try {
      await deleteDbLocally(deleteType);
    } catch (e) {
      window?.log?.error(e);
    } finally {
      window.restart();
    }
  }
}

async function deleteEverythingAndNetworkData() {
  try {
    // DELETE EVERYTHING ON NETWORK, AND THEN STUFF LOCALLY STORED
    // a bit of duplicate code below, but it's easier to follow every case like that (helped with returns)

    // send deletion message to the network
    const potentiallyMaliciousSnodes = await forceNetworkDeletion();
    if (potentiallyMaliciousSnodes === null) {
      window?.log?.warn('DeleteAccount => forceNetworkDeletion failed');

      // close this dialog
      window.inboxStore?.dispatch(updateDeleteAccountModal(null));
      window.inboxStore?.dispatch(
        updateConfirmModal({
          title: window.i18n('dialogClearAllDataDeletionFailedTitle'),
          message: window.i18n('dialogClearAllDataDeletionFailedDesc'),
          okTheme: BchatButtonColor.Danger,
          okText: window.i18n('deviceOnly'),
          onClickOk: async () => {
            await deleteDbLocally();
            window.restart();
          },
        })
      );
      return;
    }

    if (potentiallyMaliciousSnodes.length > 0) {
      const snodeStr = potentiallyMaliciousSnodes.map(ed25519Str);
      window?.log?.warn(
        'DeleteAccount => forceNetworkDeletion Got some potentially malicious snodes',
        snodeStr
      );
      // close this dialog
      window.inboxStore?.dispatch(updateDeleteAccountModal(null));
      // open a new confirm dialog to ask user what to do
      window.inboxStore?.dispatch(
        updateConfirmModal({
          title: window.i18n('dialogClearAllDataDeletionFailedTitle'),
          message: window.i18n('dialogClearAllDataDeletionFailedMultiple', [
            potentiallyMaliciousSnodes.join(', '),
          ]),
          messageSub: window.i18n('dialogClearAllDataDeletionFailedTitleQuestion'),
          okTheme: BchatButtonColor.Danger,
          okText: window.i18n('deviceOnly'),
          onClickOk: async () => {
            await deleteDbLocally();
            window.restart();
          },
        })
      );
      return;
    }

    // We removed everything on the network successfully (no malicious node!). Now delete the stuff we got locally
    // without sending a last configuration message (otherwise this one will still be on the network)
    await deleteDbLocally();
    window.restart();
  } catch (error) {
    // if an error happened, it's not related to the delete everything on network logic as this is handled above.
    // this could be a last sync configuration message not being sent.
    // in all case, we delete everything, and restart
    window?.log?.error(
      'Something went wrong deleting all data:',
      error && error.stack ? error.stack : error
    );
    try {
      await deleteDbLocally();
    } catch (e) {
      window?.log?.error(e);
    }
    window.restart();
  }
}

export const DeleteAccountModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDeviceOnly, setDeleteDeviceOnly] = useState(false);
  const [deleteEverythingWithNetwork, setDeleteEverythingWithNetwork] = useState(false);

  const dispatch = useDispatch();

  const onDeleteEverythingLocallyOnly = async () => {
    if (!isLoading) {
      setIsLoading(true);
      try {
        window.log.warn('Deleting everything on device but keeping network data');

        await sendConfigMessageAndDeleteEverything();
      } catch (e) {
        window.log.warn(e);
      } finally {
        setIsLoading(false);
      }
    }
  };
  const onDeleteEverythingAndNetworkData = async () => {
    if (!isLoading) {
      setIsLoading(true);
      try {
        window.log.warn('Deleting everything including network data');
        await deleteEverythingAndNetworkData();
      } catch (e) {
        window.log.warn(e);
      } finally {
        setIsLoading(false);
      }
    }
  };

  /**
   * Performs specified on close action then removes the modal.
   */
  const onClickCancelHandler = useCallback(() => {
    dispatch(updateDeleteAccountModal(null));
  }, []);

  return (
    <BchatWrapperModal
      title={window.i18n('clearAllData')}
      // onClose={onClickCancelHandler}
      okButton={{
        text: window.i18n('close'),
        onClickOkHandler: onClickCancelHandler
      }}
      iconShow={true}
      customIcon={<BchatIcon iconType="clearDataIcon" iconSize={26} />}
      isloading={isLoading}
    >
      {/* <div className="bchat-modal__centered"> */}
        <div className='bchat-modal__deleteAccountModal'>
          <div className='fontSemiBold'>
            {window.i18n('deleteAccountWarning')}
            <span>{window.i18n('dialogClearAllDataDeletionQuestion')}</span>
          </div>

          <div className="buttons">
            <BchatButton
              text={window.i18n('deviceOnly')}
              buttonColor={deleteDeviceOnly ? BchatButtonColor.Danger : BchatButtonColor.Enable}
              onClick={() => {
                setDeleteDeviceOnly(true);
                setDeleteEverythingWithNetwork(false);

              }}
              // disabled={deleteEverythingWithNetwork || deleteDeviceOnly}
              style={{ marginRight: '25px', minWidth: '240px', height: '55px',fontWeight: 500 }}
              iconType={deleteDeviceOnly ? "circle" : undefined}
              iconSize="tiny"
            />
            <BchatButton
              text={window.i18n('entireAccount')}
              buttonColor={deleteEverythingWithNetwork ? BchatButtonColor.Danger : BchatButtonColor.Enable}
              onClick={() => {
                setDeleteEverythingWithNetwork(true);
                setDeleteDeviceOnly(false);
              }}
              // disabled={deleteEverythingWithNetwork || deleteDeviceOnly}
              style={{ marginRight: '12px', minWidth: '240px', height: '55px',fontWeight: 500 }}
              iconType={deleteEverythingWithNetwork ? "circle" : undefined}
              iconSize="tiny"
            />
          </div>
          {deleteEverythingWithNetwork && (
            <BchatHtmlRenderer
              tag="span"
              className="bchat-confirm-main-message"
              html={window.i18n('areYouSureDeleteEntireAccount')}
            />
          )}

          {deleteDeviceOnly && (
            <BchatHtmlRenderer
              tag="span"
              className="bchat-confirm-main-message"
              html={window.i18n('areYouSureDeleteDeviceOnly')}
            />
          )}
          {(deleteDeviceOnly || deleteEverythingWithNetwork) && (

            <div className="buttons" style={{ marginLeft: '110px', height: "90px", marginBottom: '10px' }}>

              <BchatButton
                text={window.i18n('iAmSure')}
                buttonColor={BchatButtonColor.Primary}
                onClick={() => {
                  if (deleteDeviceOnly) {
                    void onDeleteEverythingLocallyOnly();
                  } else if (deleteEverythingWithNetwork) {
                    void onDeleteEverythingAndNetworkData();
                  }
                }}
                // disabled={isLoading}
                style={{ marginRight: '25px', minWidth: '240px', height: '55px' }}
              />
            </div>
          )}
        </div>

        {/* <BchatSpinner loading={isLoading} /> */}
      {/* </div> */}
    </BchatWrapperModal>
  );
};
