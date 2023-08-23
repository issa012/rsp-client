import axios from 'axios';
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const axiosInstance = axios.create({
  withCredentials: true,
});

type Props = {
  children?: ReactNode;
};

type User = {
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
    axiosInstance.get('https://rsp-aj41.onrender.com').then(() => {
      axiosInstance
        .post('https://rsp-aj41.onrender.com/guest-login')
        .then(({ data }) => {
          console.log(data);

          setUser(data);
        })
        .catch((err) => console.log(err));
    });
  }, []);

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
