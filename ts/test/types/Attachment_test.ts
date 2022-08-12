import { assert } from 'chai';
import moment from 'moment';

import * as Attachment from '../../types/Attachment';
import * as MIME from '../../types/MIME';
import { SignalService } from '../../protobuf';

const stringToArrayBuffer = (str: string) => {
  if (typeof str !== 'string') {
    throw new TypeError("'string' must be a string");
  }

  const array = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i += 1) {
    array[i] = str.charCodeAt(i);
  }
  return array.buffer;
};

// tslint:disable-next-line: max-func-body-length
describe('Attachment', () => {
  describe('getFileExtension', () => {
    it('should return file extension from content type', () => {
      const input: Attachment.AttachmentType = {
        fileName: 'funny-cat.mov',
        url: 'funny-cat.mov',
        contentType: MIME.IMAGE_GIF,
        fileSize: null,
        screenshot: null,
        thumbnail: null,
      };
      assert.strictEqual(Attachment.getFileExtension(input), 'gif');
    });

    it('should return file extension for QuickTime videos', () => {
      const input: Attachment.AttachmentType = {
        fileName: 'funny-cat.mov',
        url: 'funny-cat.mov',
        contentType: MIME.VIDEO_QUICKTIME,
        fileSize: null,
        screenshot: null,
        thumbnail: null,
      };
      assert.strictEqual(Attachment.getFileExtension(input), 'mov');
    });

    it('should return file extension for application files', () => {
      const input: Attachment.AttachmentType = {
        fileName: 'funny-cat.odt',
        url: 'funny-cat.odt',
        contentType: MIME.ODT,
        fileSize: null,
        screenshot: null,
        thumbnail: null,
      };
      assert.strictEqual(Attachment.getFileExtension(input), 'odt');
    });
  });

  describe('getSuggestedFilename', () => {
    context('for attachment with filename', () => {
      it('should generate a filename without timestamp', () => {
        const attachment: Attachment.AttachmentType = {
          fileName: 'funny-cat.mov',
          url: 'funny-cat.mov',
          contentType: MIME.VIDEO_QUICKTIME,
          fileSize: null,
          screenshot: null,
          thumbnail: null,
        };
        const actual = Attachment.getSuggestedFilename({ attachment });
        const expected = 'funny-cat.mov';
        assert.strictEqual(actual, expected);
      });
      it('should generate a filename without timestamp but with an index', () => {
        const attachment: Attachment.AttachmentType = {
          fileName: 'funny-cat.mov',
          url: 'funny-cat.mov',
          contentType: MIME.VIDEO_QUICKTIME,
          fileSize: null,
          screenshot: null,
          thumbnail: null,
        };
        const actual = Attachment.getSuggestedFilename({
          attachment,
          index: 3,
        });
        const expected = 'funny-cat.mov';
        assert.strictEqual(actual, expected);
      });
      it('should generate a filename with an extension if contentType is not setup', () => {
        const attachment: Attachment.AttachmentType = {
          fileName: 'funny-cat.ini',
          url: 'funny-cat.ini',
          contentType: '',
          fileSize: null,
          screenshot: null,
          thumbnail: null,
        };
        const actual = Attachment.getSuggestedFilename({
          attachment,
          index: 3,
        });
        const expected = 'funny-cat.ini';
        assert.strictEqual(actual, expected);
      });

      it('should generate a filename with an extension if contentType is text/plain', () => {
        const attachment: Attachment.AttachmentType = {
          fileName: 'funny-cat.txt',
          url: 'funny-cat.txt',
          contentType: 'text/plain',
          fileSize: null,
          screenshot: null,
          thumbnail: null,
        };
        const actual = Attachment.getSuggestedFilename({
          attachment,
          index: 3,
        });
        const expected = 'funny-cat.txt';
        assert.strictEqual(actual, expected);
      });
      it('should generate a filename with an extension if contentType is json', () => {
        const attachment: Attachment.AttachmentType = {
          fileName: 'funny-cat.json',
          url: 'funny-cat.json',
          contentType: '',
          fileSize: null,
          screenshot: null,
          thumbnail: null,
        };
        const actual = Attachment.getSuggestedFilename({
          attachment,
          index: 3,
        });
        const expected = 'funny-cat.json';
        assert.strictEqual(actual, expected);
      });
    });
    context('for attachment without filename', () => {
      it('should generate a filename based on timestamp', () => {
        const attachment: Attachment.AttachmentType = {
          contentType: MIME.VIDEO_QUICKTIME,
          url: 'funny-cat.mov',
          fileName: 'funny-cat.mov',
          fileSize: null,
          screenshot: null,
          thumbnail: null,
        };
        const timestamp = moment('2000-01-01').toDate();
        const actual = Attachment.getSuggestedFilename({
          attachment,
          timestamp,
        });
        const expected = 'funny-cat.mov';
        assert.strictEqual(actual, expected);
      });
    });
    context('for attachment with index', () => {
      it('should generate a filename based on timestamp if filename is not set', () => {
        const attachment: Attachment.AttachmentType = {
          fileName: '',
          url: 'funny-cat.mov',
          contentType: MIME.VIDEO_QUICKTIME,
          fileSize: null,
          screenshot: null,
          thumbnail: null,
        };
        const timestamp = new Date(new Date(0).getTimezoneOffset() * 60 * 1000);
        const actual = Attachment.getSuggestedFilename({
          attachment,
          timestamp,
          index: 3,
        });
        const expected = 'bchat-attachment-1970-01-01-000000_003.mov';
        assert.strictEqual(actual, expected);
      });

      it('should generate a filename based on filename if present', () => {
        const attachment: Attachment.AttachmentType = {
          fileName: 'funny-cat.mov',
          url: 'funny-cat.mov',
          contentType: MIME.VIDEO_QUICKTIME,
          fileSize: null,
          screenshot: null,
          thumbnail: null,
        };
        const timestamp = new Date(new Date(0).getTimezoneOffset() * 60 * 1000);
        const actual = Attachment.getSuggestedFilename({
          attachment,
          timestamp,
          index: 3,
        });
        const expected = 'funny-cat.mov';
        assert.strictEqual(actual, expected);
      });
    });
  });

  describe('isVisualMedia', () => {
    it('should return true for images', () => {
      const attachment: Attachment.Attachment = {
        fileName: 'meme.gif',
        data: stringToArrayBuffer('gif'),
        contentType: MIME.IMAGE_GIF,
      };
      assert.isTrue(Attachment.isVisualMedia(attachment));
    });

    it('should return true for videos', () => {
      const attachment: Attachment.Attachment = {
        fileName: 'meme.mp4',
        data: stringToArrayBuffer('mp4'),
        contentType: MIME.VIDEO_MP4,
      };
      assert.isTrue(Attachment.isVisualMedia(attachment));
    });

    it('should return false for voice message attachment', () => {
      const attachment: Attachment.Attachment = {
        fileName: 'Voice Message.aac',
        flags: SignalService.AttachmentPointer.Flags.VOICE_MESSAGE,
        data: stringToArrayBuffer('voice message'),
        contentType: MIME.AUDIO_AAC,
      };
      assert.isFalse(Attachment.isVisualMedia(attachment));
    });

    it('should return false for other attachments', () => {
      const attachment: Attachment.Attachment = {
        fileName: 'foo.json',
        data: stringToArrayBuffer('{"foo": "bar"}'),
        contentType: MIME.APPLICATION_JSON,
      };
      assert.isFalse(Attachment.isVisualMedia(attachment));
    });
  });

  describe('isFile', () => {
    it('should return true for JSON', () => {
      const attachment: Attachment.Attachment = {
        fileName: 'foo.json',
        data: stringToArrayBuffer('{"foo": "bar"}'),
        contentType: MIME.APPLICATION_JSON,
      };
      assert.isTrue(Attachment.isFile(attachment));
    });

    it('should return false for images', () => {
      const attachment: Attachment.Attachment = {
        fileName: 'meme.gif',
        data: stringToArrayBuffer('gif'),
        contentType: MIME.IMAGE_GIF,
      };
      assert.isFalse(Attachment.isFile(attachment));
    });

    it('should return false for videos', () => {
      const attachment: Attachment.Attachment = {
        fileName: 'meme.mp4',
        data: stringToArrayBuffer('mp4'),
        contentType: MIME.VIDEO_MP4,
      };
      assert.isFalse(Attachment.isFile(attachment));
    });

    it('should return false for voice message attachment', () => {
      const attachment: Attachment.Attachment = {
        fileName: 'Voice Message.aac',
        flags: SignalService.AttachmentPointer.Flags.VOICE_MESSAGE,
        data: stringToArrayBuffer('voice message'),
        contentType: MIME.AUDIO_AAC,
      };
      assert.isFalse(Attachment.isFile(attachment));
    });
  });

  describe('isVoiceMessage', () => {
    it('should return true for voice message attachment', () => {
      const attachment: Attachment.Attachment = {
        fileName: 'Voice Message.aac',
        flags: SignalService.AttachmentPointer.Flags.VOICE_MESSAGE,
        data: stringToArrayBuffer('voice message'),
        contentType: MIME.AUDIO_AAC,
      };
      assert.isTrue(Attachment.isVoiceMessage(attachment));
    });

    it('should return true for legacy Android voice message attachment', () => {
      const attachment: Attachment.Attachment = {
        data: stringToArrayBuffer('voice message'),
        contentType: MIME.AUDIO_MP3,
      };
      assert.isTrue(Attachment.isVoiceMessage(attachment));
    });

    it('should return false for other attachments', () => {
      const attachment: Attachment.Attachment = {
        fileName: 'foo.gif',
        data: stringToArrayBuffer('foo'),
        contentType: MIME.IMAGE_GIF,
      };
      assert.isFalse(Attachment.isVoiceMessage(attachment));
    });
  });
});
