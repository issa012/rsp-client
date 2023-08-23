import { URL } from './axios';
import useSWR from 'swr';

export const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Leaderboards = () => {
  const { data, isLoading } = useSWR(`${URL}/top10`, fetcher);
  if (isLoading) {
    return <div>Is loading</div>;
  }

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
        {data.map((item, index) => {
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
