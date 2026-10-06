import { assert } from 'chai';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';

import { BchatIcon } from '../../components/icon';
import { BchatIconButton } from '../../components/icon/BchatIconButton';

function cssFor(element: JSX.Element): string {
  const sheet = new ServerStyleSheet();
  try {
    renderToString(sheet.collectStyles(element));
    return sheet.getStyleTags();
  } finally {
    sheet.seal();
  }
}

describe('BchatIcon flipInRtl', () => {
  it('mirrors the icon through --rtl-mirror and keeps the rotation', () => {
    const css = cssFor(<BchatIcon iconType="chevron" iconSize={20} iconRotation={270} flipInRtl={true} />);
    assert.include(css, 'transform:scaleX(var(--rtl-mirror,1)) rotate(270deg)');
  });

  it('adds no RTL rule without the prop', () => {
    const css = cssFor(<BchatIcon iconType="chevron" iconSize={20} iconRotation={270} />);
    assert.notInclude(css, 'scaleX');
  });

  // An `html[dir='rtl'] &` rule compiles to the class shared by every BchatIcon,
  // so one flipped icon on screen used to mirror and rotate all the others.
  it('does not leak the flip onto other icons', () => {
    const css = cssFor(
      <div>
        <BchatIcon iconType="chevron" iconSize={20} iconRotation={268} flipInRtl={true} />
        <BchatIcon iconType="chevron" iconSize={20} />
      </div>
    );
    assert.notInclude(css, "html[dir='rtl']");
    assert.include(css, 'transform:rotate(0deg)');
  });

  it('passes flipInRtl through BchatIconButton', () => {
    const css = cssFor(<BchatIconButton iconType="chevron" iconSize={20} flipInRtl={true} />);
    assert.include(css, 'scaleX(var(--rtl-mirror,1)) rotate(0deg)');
  });
});
