import { useContext, useEffect, useState } from 'react';
import { AuthContext, User } from './auth-context';
import { axiosInstance } from './axios';

const Leaderboards = () => {
  const [leaderboards, setLeaderboards] = useState<User[]>([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    axiosInstance.get<User[]>('https://rsp-aj41.onrender.com/top10').then(({ data }) => {
      setLeaderboards(data);
    });
  }, [user]);
  return (
    <div>
      <h1>Leaderboards</h1>
      <div className="list">
        <div className="list__item">
          <div>ID</div>
          <div>Username</div>
          <div>Games</div>
          <div>Wins</div>
        </div>
        {leaderboards.map((item, index) => {
          return (
            <div className="list__item">
              <div>{index}</div>
              <div>{item.username}</div>
              <div>{item.games}</div>
              <div>{item.wins}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Leaderboards;
