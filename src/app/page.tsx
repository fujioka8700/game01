import Link from 'next/link';
import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div>
      <ul>
        <li>
          <Link href="/sample">サンプル</Link>
        </li>
        <li>
          <Link href="/game-one">ゲーム１</Link>
        </li>
        <li>
          <Link href="/game-two">ゲーム２</Link>
        </li>
      </ul>
    </div>
  );
};

export default HomePage;
