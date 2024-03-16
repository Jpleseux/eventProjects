export type commitmentsProps = {
  date: Date;
  time: string;
  title: string;
  eventPlace: string;
  uuid: string;
};
export class commitmentsEntity {
  constructor(readonly props: commitmentsProps) {}
  getdate(): Date {
    return this.props.date;
  }

  gettime(): string {
    return this.props.time;
  }

  gettitle(): string {
    return this.props.title;
  }

  geteventPlace(): string {
    return this.props.eventPlace;
  }

  getuuid(): string {
    return this.props.uuid;
  }
  setdate(value: Date) {
    this.props.date = value;
  }

  settime(value: string) {
    this.props.time = value;
  }

  settitle(value: string) {
    this.props.title = value;
  }

  seteventPlace(value: string) {
    this.props.eventPlace = value;
  }

  setuuid(value: string) {
    this.props.uuid = value;
  }
}
