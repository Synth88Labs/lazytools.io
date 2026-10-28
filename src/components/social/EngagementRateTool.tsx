import { useState } from 'preact/hooks';
import { Num, Result, CalcShell, n, fmt } from './shared';

export default function EngagementRateTool() {
  const [likes, setLikes] = useState('1200');
  const [comments, setComments] = useState('85');
  const [shares, setShares] = useState('40');
  const [followers, setFollowers] = useState('25000');

  const f = n(followers);
  const er = f > 0 ? ((n(likes) + n(comments) + n(shares)) / f) * 100 : 0;
  const tier = er >= 6 ? 'excellent' : er >= 3 ? 'strong' : er >= 1 ? 'average' : 'low';

  return (
    <CalcShell
      inputs={
        <>
          <Num label="Likes" value={likes} onInput={setLikes} />
          <Num label="Comments" value={comments} onInput={setComments} />
          <Num label="Shares / saves" value={shares} onInput={setShares} />
          <Num label="Followers" value={followers} onInput={setFollowers} />
        </>
      }
      output={<Result label="Engagement rate" value={`${fmt(er)}%`} hint={`(likes + comments + shares) ÷ followers · ${tier}`} />}
    />
  );
}
