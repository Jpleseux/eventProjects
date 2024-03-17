export type userProps = {
    email: string;
    name: string;
    password: string;
    uuid: string;
    token?: string;
  };
  
  export class UserEntity {
    constructor(readonly props: userProps) {}
    email(): string {
      return this.props.email;
    }
    avatar(): string | undefined{
      return this.props.uuid;
    }
    token(): string | undefined{
      return this.props.token;
    }
    password(): string {
      return this.props.password;
    }
    setPassword(password: string) {
      this.props.password = password;
    }
    setEmail(email: string) {
      this.props.email = email;
    }
    setToken(token: string) {
      this.props.token = token;
    }
  }
  