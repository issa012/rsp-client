import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { axiosInstance } from './axios';
import { URL } from './axios';

type Props = {
  children?: ReactNode;
};

export type User = {
  id: number | null;
  username: string | null;
  games: number;
  wins: number;
};

type IAuthContext = {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
};

const initialValue = {
  user: { id: null, username: null, games: 0, wins: 0 },
  setUser: () => {},
};

const AuthContext = createContext<IAuthContext>(initialValue);

const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User>(initialValue.user);
  const values = useMemo(() => ({ user, setUser }), [user]);

  useEffect(() => {
    axiosInstance.get(URL).then(() => {
      axiosInstance
        .post(`${URL}/guest-login`, { id: localStorage.getItem('id') })
        .then(({ data }) => {
          console.log(data);

          setUser(data);
          localStorage.setItem('id', data.id);
        })
        .catch((err) => console.log(err));
    });
  }, []);

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
