export type userProps = {
  uuid: string;
  email: string;
  password: string;
  name: string;
};

export class UserEntity {
  constructor(readonly props: userProps) {}
  email(): string {
    return this.props.email;
  }
  uuid(): string {
    return this.props.uuid;
  }
  name(): string {
    return this.props.name;
  }
  password(): string {
    return this.props.password;
  }
  setEmail(email: string) {
    this.props.email = email;
  }
  setPassword(Password: string) {
    this.props.password = Password;
  }
  payloadToken() {
    const payload: any = {
      uuid: this.props.uuid,
      email: this.props.email,
    };
    return payload;
  }
}
