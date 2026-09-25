import pRetry from 'p-retry';

/**
 * Wraps a single attachment-upload attempt in a bounded retry. Shared by Attachments.ts's
 * uploadToFsV2() (file server v2) and AttachmentsV2.ts's uploadV2() (open group v2) - neither of
 * the underlying calls (FSv2.uploadFileToFsV2(), uploadFileOpenGroupV2()) retries internally,
 * unlike MessageSender.send()'s 7 attempts for a text message or postMessage()'s 3 retries for an
 * open-group text post, so a single transient network blip during an attachment upload used to
 * fail the whole attachment (and therefore the whole message) outright, with no second chance to
 * recover. Attachments take longer to transfer than a text message, so they're more exposed to
 * exactly this kind of blip.
 *
 * Both underlying calls report failure by resolving null rather than throwing - uploadOnce should
 * do the same, and this turns that into a rejection so pRetry actually retries it.
 *
 * @param label short tag identifying the calling site in log lines (e.g. "uploadToFsV2")
 * @param fileName the attachment's filename, only used for logging
 * @param uploadOnce performs a single upload attempt; resolve null to indicate failure
 */
export async function uploadWithRetry<T>(
  label: string,
  fileName: string | undefined,
  uploadOnce: () => Promise<T | null>
): Promise<T> {
  return pRetry(
    async () => {
      const result = await uploadOnce();
      if (!result) {
        throw new Error(`${label}: upload of ${fileName} failed`);
      }
      return result;
    },
    {
      retries: 3,
      factor: 2,
      minTimeout: 1000,
      maxTimeout: 4000,
      onFailedAttempt: e => {
        window?.log?.warn(
          `${label} attempt #${e.attemptNumber} failed for ${fileName}. ${e.retriesLeft} retries left...`
        );
      },
    }
  );
}
