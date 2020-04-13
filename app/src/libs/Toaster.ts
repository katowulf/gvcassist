/**
 * Alternatives considered; discarded because they can only show one message:
 * https://github.com/eolant/vuetify-toast-snackbar
 * https://www.npmjs.com/package/snackbarstack
 */
const DefaultToastAction = (message: ToasterMessage) => message.dismiss();
const DURATION = 10;

export class ToasterMessage {
  public readonly type: string;
  public readonly message: string;
  public readonly props: ToasterMessageProps;
  private action: Function = DefaultToastAction;
  private timeoutRef?: number;
  private toaster?: Toaster;

  constructor(type: string, message: string, props?: object) {
    this.type = type;
    this.message = message;
    this.props = Object.assign(
      {
        buttonColor: type,
        borderColor: type,
        elevation: 1,
        hasColoredBorder: false,
        isText: true,
        buttonText: "Okay",
        iconText: null,
        icon: null,
        color: null,
        borderLocation: null
      },
      props
    );
    Object.freeze(this.props);
    console.log("ToasterMessage", this.type, this.message, this.props);
  }

  setAction(action: Function) {
    this.action = action;
  }
  setParent(toaster: Toaster) {
    this.toaster = toaster;
  }

  setDuration(seconds: number) {
    this.timeoutRef = setTimeout(() => this.dismiss(), seconds * 1000);
  }

  activate() {
    this.clearTimeout();
    this.action(this);
  }

  dismiss() {
    this.clearTimeout();
    if (this.toaster) {
      this.toaster.removeMessage(this);
      delete this.toaster;
    }
  }

  private clearTimeout() {
    if (typeof this.timeoutRef !== "undefined") {
      clearTimeout(this.timeoutRef);
      delete this.timeoutRef;
    }
  }
}

export interface ToasterAction {
  textOrIcon: string;
  isIcon: boolean;
  handler: Function;
}

// See https://vuetifyjs.com/en/components/alerts/#api
export interface ToasterMessageProps {
  elevation: number;
  isText: boolean;
  icon: string | null;
  hasColoredBorder: boolean;
  borderLocation: string | null;
  borderColor: string | null;
  color: string | null; // should only be set if not using a default type (error, warning, info, success)
  buttonColor: string;
  buttonText: string | null;
  iconText: string | null;
}

class Toaster {
  readonly messages: ToasterMessage[] = [];

  public getMessages() {
    return this.messages;
  }

  public removeMessage(message: ToasterMessage) {
    const index = this.messages.indexOf(message);
    if (index > -1) {
      this.messages.splice(index, 1);
    }
  }

  public handleError(tag: string, e: Error) {
    console.error(tag);
    console.error(e);
    this.error(`Internal error [${tag}]: ${e.message}`);
  }

  public error(message: string): ToasterMessage {
    const props = {
      iconText: "fas fa-times-circle",
      buttonText: null,
      isText: false,
      buttonColor: "white"
    } as ToasterMessageProps;
    return this.addMessage(new ToasterMessage("error", message, props));
  }

  public warning(message: string): ToasterMessage {
    return this.addMessage(new ToasterMessage("warning", message));
  }

  public info(message: string): ToasterMessage {
    return this.addMessage(new ToasterMessage("info", message));
  }

  public success(message: string): ToasterMessage {
    return this.addMessage(new ToasterMessage("success", message));
  }

  public note(message: string): ToasterMessage {
    const props = {
      iconText: "fas fa-times-circle",
      buttonText: null,
      isText: false,
      hasColoredBorder: true,
      borderLocation: "left",
      color: "blue-grey",
      icon: undefined
    };
    return this.addMessage(new ToasterMessage("info", message, props));
  }

  public addMessage(
    message: ToasterMessage,
    overrideDurationInSeconds?: number
  ) {
    this.messages.push(message);
    message.setParent(this);
    Toaster.setDuration(message, overrideDurationInSeconds);
    return message;
  }

  private static setDuration(
    message: ToasterMessage,
    durationSeconds?: number
  ) {
    const duration =
      typeof durationSeconds !== "undefined" ? durationSeconds : DURATION;
    if (duration > 0) {
      message.setDuration(duration);
    }
  }
}

export const toaster = new Toaster();

/**
 * Okay, you caught me having a little fun. This is just a generic error handler that displays
 * a Toaster warning and also logs some data in the JS console. Hopefully it will eventually
 * talk to Analytics as well.
 * @param tag String in the format Class::method
 */
export const burnedTheToast = function(tag: string) {
  return (e: Error) => toaster.handleError(tag, e);
};

export default toaster;
