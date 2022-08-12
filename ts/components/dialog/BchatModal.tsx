import React from 'react';
import classNames from 'classnames';
import { BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { BchatIconButton, BchatIconType } from '../icon';

interface Props {
  title: string;
  onClose: any;
  showExitIcon?: boolean;
  showHeader?: boolean;
  headerReverse?: boolean;
  //Maximum of two icons or buttons in header
  headerIconButtons?: Array<{
    iconType: BchatIconType;
    iconRotation: number;
    onClick?: any;
  }>;
  headerButtons?: Array<{
    buttonType: BchatButtonType;
    buttonColor: BchatButtonColor;
    text: string;
    onClick?: any;
  }>;
}

interface State {
  isVisible: boolean;
}

export class BchatModal extends React.PureComponent<Props, State> {
  public static defaultProps = {
    showExitIcon: true,
    showHeader: true,
    headerReverse: false,
  };

  private node: HTMLDivElement | null;

  constructor(props: any) {
    super(props);
    this.state = {
      isVisible: true,
    };

    this.close = this.close.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.node = null;
  }

  public componentDidMount() {
    window.addEventListener('keyup', this.onKeyUp);

    document.addEventListener('mousedown', this.handleClick, false);
  }

  public componentWillUnmount() {
    window.removeEventListener('keyup', this.onKeyUp);

    document.removeEventListener('mousedown', this.handleClick, false);
  }

  public handleClick = (e: any) => {
    if (this.node && this.node.contains(e.target)) {
      return;
    }

    this.close();
  };

  public render() {
    const { title, headerIconButtons, showExitIcon, showHeader, headerReverse } = this.props;
    const { isVisible } = this.state;

    return isVisible ? (
      <div ref={node => (this.node = node)} className={'bchat-modal'}>
        {showHeader ? (
          <>
            <div className={classNames('bchat-modal__header', headerReverse && 'reverse')}>
              <div className="bchat-modal__header__close">
                {showExitIcon ? (
                  <BchatIconButton
                    iconType="exit"
                    iconSize="small"
                    onClick={this.close}
                    dataTestId="modal-close-button"
                  />
                ) : null}
              </div>
              <div className="bchat-modal__header__title">{title}</div>
              <div className="bchat-modal__header__icons">
                {headerIconButtons
                  ? headerIconButtons.map((iconItem: any) => {
                      return (
                        <BchatIconButton
                          key={iconItem.iconType}
                          iconType={iconItem.iconType}
                          iconSize={'large'}
                          iconRotation={iconItem.iconRotation}
                          onClick={iconItem.onClick}
                        />
                      );
                    })
                  : null}
              </div>
            </div>
          </>
        ) : null}

        <div className="bchatl-modal__body">{this.props.children}</div>
      </div>
    ) : null;
  }

  public close() {
    this.setState({
      isVisible: false,
    });

    document.removeEventListener('mousedown', this.handleClick, false);

    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  public onKeyUp(event: any) {
    switch (event.key) {
      case 'Esc':
      case 'Escape':
        this.close();
        break;
      default:
    }
  }
}
