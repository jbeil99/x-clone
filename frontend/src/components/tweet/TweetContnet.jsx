import { useState } from 'react';
import UserCard from './UserCard';
import { Link } from 'react-router';

const TweetContent = ({ tweet, isTweetLong = false }) => {
  const [expanded, setExpanded] = useState(false);

  const handleSeeMoreClick = () => {
    setExpanded(true);
  };

  const displayContent = () => {
    if (!tweet?.content) return '';

    const parseContent = (content) => {
      const regex = /(@\w+)|(#\w+)|([^@#]+)/g;
      const parts = [];
      let match;

      while ((match = regex.exec(content)) !== null) {
        if (match[1]) {
          const username = match[1].substring(1);
          console.log(tweet.mentions?.includes(username), " hi")
          if (tweet.mentions?.includes(username)) {
            parts.push(
              <UserCard username={username} match={match} key={`mention-${parts.length}`} />
            );
          } else {
            parts.push(match[1])
          }

        } else if (match[2]) {
          const hashtag = match[2].substring(1);

          if (tweet.hashtags?.includes(hashtag)) {
            parts.push(
              <Link to={`hastags/${hashtag}`}>
                <span key={`hashtag-${parts.length}`} className="text-blue-500 hover:text-blue-600 font-medium cursor-pointer">
                  {match[2]}
                </span>
              </Link>
            );
          } else {
            parts.push(match[2])
          }
        } else if (match[3]) {
          parts.push(<span key={`text-${parts.length}`}>{match[3]}</span>);
        }
      }

      return parts;
    };

    if (isTweetLong && !expanded) {
      const truncatedContent = tweet.content.substring(0, 120);
      return (
        <>
          {parseContent(truncatedContent)}
          <span>...</span>
          <button
            onClick={handleSeeMoreClick}
            className="text-blue-500 hover:text-blue-400 font-medium ml-1"
          >
            See more
          </button>
        </>
      );
    }

    return parseContent(tweet.content);
  };

  return <div className="tweet-content">{displayContent()}</div>;
};

export default TweetContent;