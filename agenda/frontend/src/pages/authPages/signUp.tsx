import React, { useContext, useState, ChangeEvent, FormEvent, useEffect } from 'react';
import '../../../public/style/auth/signUp.css';
import Message from '../../components/visual/Message.component';
import { GatewayContext } from '../../gateway/gatewayContext';
import { UserEntity } from '../../entities/auth/User.entity';
import Loader from '../../components/visual/Loader';
import { useNavigate } from 'react-router';
function SignUp() {
  const navigate = useNavigate();
  const gatewayContext = useContext(GatewayContext);
  const userGateway = gatewayContext?.userGateway;

  const [user, setUser] = useState<UserEntity>(new UserEntity({ email: '', userName: '', avatar: '', phone_number: '', password: '' }));
  const [msg, setMsg] = useState({ msg: null, status: null });
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setConfirmPassword(value);
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevState) => new UserEntity({ ...prevState.props, [name]: value }));
  };

  useEffect(() => {
    document.body.style.pointerEvents = loading ? 'none' : 'auto';
  }, [loading]);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ msg: null, status: null });
    if (user.password() !== confirmPassword) {
      setMsg({ msg: 'As senhas não são iguais', status: 400 });
    } else {
      const response = await userGateway?.signUp(user);
      setMsg({ msg: response?.message, status: response?.status });
      if (msg.status && msg.status < 300 && msg.msg !== "Esse email já foi cadastrado no banco") {
        setTimeout(() => navigate("/"), 3000);
      } else if (response.status > 300) {
        setTimeout(() => navigate("/"), 3000);
      }
    }
    setLoading(false);
  };
  return (
    <div className="signBody">
      {msg.msg && 
        <Message msg={msg.msg} status={msg.status} timers={3000} />
      }
      <form className="form" onSubmit={submit}>
        {loading && 
                <Loader />
        }
        <p className="title">Cadastre-se</p>
        <p className="message">Cadastre-se para ter acesso ao site.</p>
        <label>
          <input
            onChange={handleOnChange}
            placeholder="Nome"
            type="text"
            className="input"
            name="name"
          />
        </label>
        <label>
          <input
            onChange={handleOnChange}
            placeholder="Email"
            type="email"
            className="input"
            name="email"
          />
        </label>
        <label>
          <input
            onChange={handleOnChange}
            placeholder="Senha"
            type="password"
            className="input"
            name="password"
          />
        </label>
        <label>
          <input
            placeholder="Confirme sua senha"
            type="password"
            className="input"
            name="confirmPassword"
            onChange={handleConfirmPasswordChange}
          />
        </label>
        <div className="buttons">
        <button type="submit" className="submit">
          Cadastrar
        </button>
        </div>
        <p className="signin">
          Já tem uma conta ? <a href="/">Login</a>{' '}
        </p>
      </form>
    </div>
  );
}

export default SignUp;
