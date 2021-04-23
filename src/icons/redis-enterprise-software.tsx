import React, { FC } from 'react';
import { SVGProps } from '../types';

/**
 * Redis Enterprise Software
 */
export const RedisEnterpriseSoftware: FC<SVGProps> = ({ size, fill, title, ...rest }) => {
  return (
    <a
      target="_blank"
      rel="noreferrer"
      href="https://redislabs.com/redis-enterprise-software/overview/"
      title={
        title
          ? title
          : 'Redis Enterprise is a robust, in-memory database platform built by the same people who develop open source Redis.'
      }
    >
      <svg
        version="1.1"
        id="RedisEnterpriseSoftware"
        x="0px"
        y="0px"
        viewBox="0 0 36 26.6"
        width={size}
        height={size}
        {...rest}
      >
        <path
          fill={fill ? fill : '#DC382D'}
          d="M34,17h-2.3v-1.4c0-1.8-1.5-3.3-3.3-3.3h-10V9.1h2.4c1,0,1.7-0.7,1.7-1.7V1.9c0-1-0.7-1.7-1.7-1.7h-5.5
	c-1,0-1.7,0.7-1.7,1.7v5.6c0,0.9,0.7,1.6,1.7,1.6h2.1v3.2H7.7c-1.8,0-3.3,1.5-3.3,3.3V17H2.2c-1,0-1.7,0.7-1.7,1.7v5.5
	c0,1,0.7,1.7,1.6,1.7h5.6c1,0,1.7-0.7,1.7-1.7v-5.5c0-1-0.7-1.7-1.7-1.7H5.4v-1.4c0-1.3,1-2.3,2.3-2.3h9.7V17h-2.1
	c-1,0-1.7,0.7-1.7,1.7v5.5c0,1,0.7,1.7,1.7,1.7h5.5c1,0,1.7-0.7,1.7-1.7v-5.5c0-1-0.7-1.7-1.7-1.7h-2.4v-3.7h10c1.3,0,2.3,1,2.3,2.3
	V17h-2.3c-1,0-1.7,0.7-1.7,1.7v5.5c0,1,0.8,1.7,1.8,1.7H34c1,0,1.7-0.7,1.7-1.7v-5.5C35.7,17.7,35,17,34,17z M14.6,7.5V1.9
	c0-0.4,0.3-0.7,0.7-0.7h5.5c0.4,0,0.7,0.3,0.7,0.7v5.5c0,0.4-0.3,0.7-0.7,0.7h-5.5C14.9,8.1,14.6,7.8,14.6,7.5z M8.4,18.7v5.5
	c0,0.4-0.3,0.7-0.7,0.7H2.1c-0.3,0-0.6-0.3-0.6-0.7v-5.5c0-0.4,0.3-0.7,0.7-0.7h5.5C8.1,18,8.4,18.3,8.4,18.7z M21.5,18.7v5.5
	c0,0.4-0.3,0.7-0.7,0.7h-5.5c-0.4,0-0.7-0.3-0.7-0.7v-5.5c0-0.4,0.3-0.7,0.7-0.7h5.5C21.2,18,21.5,18.3,21.5,18.7z M34.7,24.2
	c0,0.4-0.3,0.7-0.7,0.7h-5.5c-0.4,0-0.8-0.3-0.8-0.7v-5.5c0-0.4,0.3-0.7,0.7-0.7H34c0.4,0,0.7,0.3,0.7,0.7V24.2z"
        />
      </svg>
    </a>
  );
};
