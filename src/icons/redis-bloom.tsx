import React, { FC } from 'react';
import { SVGProps } from '../types';

/**
 * RedisBloom
 */
export const RedisBloom: FC<SVGProps> = ({ size, fill, ...rest }) => {
  return (
    <a
      target="_blank"
      href="https://docs.redislabs.com/latest/modules/redisbloom/"
      title="A Bloom filter is a probabilistic data structure which provides an efficient way to verify that an entry is certainly not in a set."
    >
      <svg version="1.1" id="RedisBloom" x="0px" y="0px" viewBox="0 0 32 32" width={size} height={size} {...rest}>
        <path
          fill={fill ? fill : '#DC382D'}
          d="M17.4,24.3c-0.9,0.3-1.8,0.3-2.7,0l-8-3.2L6.3,22l8,3.2c1.1,0.4,2.3,0.4,3.5,0l8-3.2l-0.4-0.9L17.4,24.3z
		  M17,29.4c-0.7,0.2-1.4,0.2-2,0l-6.2-2.3L8.4,28l6.2,2.3c0.9,0.3,1.8,0.3,2.7,0l6.2-2.3l-0.4-0.9L17,29.4z M17.4,18.9
		 c-0.9,0.4-1.9,0.4-2.9,0L3.9,14.4l-0.4,0.9l10.7,4.4c1.2,0.5,2.5,0.5,3.6,0l10.7-4.4l-0.4-0.9L17.4,18.9z M31.1,6.8l-12.9-5
		 c-1.4-0.5-2.9-0.5-4.3,0l-13,5C0.2,7.1-0.2,7.9,0.1,8.6C0.2,9,0.5,9.3,0.9,9.4l13,5c1.4,0.5,2.9,0.5,4.3,0l12.9-5
		 c0.7-0.3,1.1-1.1,0.8-1.8C31.8,7.3,31.5,7,31.1,6.8z M30.7,8.5l-13,5c-1.2,0.4-2.4,0.4-3.6,0l-13-5C1.1,8.4,0.9,8.2,1,8
		 c0-0.1,0.1-0.2,0.2-0.2l13-5c1.2-0.4,2.4-0.4,3.6,0l13,5C31,7.9,31.1,8.1,31,8.3C30.9,8.4,30.9,8.5,30.7,8.5z"
        />
      </svg>
    </a>
  );
};
