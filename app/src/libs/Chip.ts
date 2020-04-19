interface ChipProps {
  color: string;
  altColor: string;
  textColor: string;
  icon: string | null;
  altIcon: string;
}

export class Chip {
  private readonly props: ChipProps;
  private timeout: null | number = null;
  public toggled = false;
  public color: string;
  public textColor: string;
  public icon: string | null;
  constructor(public readonly label: string, props = {}) {
    this.props = Object.assign(
      {
        color: "indigo",
        altColor: "error",
        textColor: "white",
        icon: null,
        altIcon: "mdi-undo-variant"
      },
      props
    );
    this.color = this.props.color;
    this.icon = this.props.icon;
    this.textColor = this.props.textColor;
  }

  toggleThen(seconds: number, next: () => void) {
    this.toggle();
    if (this.toggled) {
      this.timeout = setTimeout(next, seconds * 1000);
    }
  }

  toggle() {
    if (this.timeout) clearTimeout(this.timeout);
    this.toggled = !this.toggled;
    this.color = this.toggled ? this.props.altColor : this.props.color;
    this.icon = this.toggled ? this.props.altIcon : this.props.icon;
  }

  isToggled() {
    return this.toggled;
  }
}
