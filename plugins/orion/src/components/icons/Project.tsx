import React from 'react';
import { SvgIcon, SvgIconProps } from '@material-ui/core';

export function ProjectIcon(props: SvgIconProps): JSX.Element {
  return (
    <SvgIcon
      fill="none"
      {...{ ...props, fontSize: '6rem' as SvgIconProps['fontSize'] }}
      viewBox="0 0 90 90"
    >
      <path
        d="M62.313 32.5a17.738 17.738 0 0 1 17.812 17.813c0 3.483-.99 6.768-2.731 9.5l12.191 12.27-5.502 5.502-12.35-12.152a17.803 17.803 0 0 1-9.42 2.692A17.738 17.738 0 0 1 44.5 50.312 17.738 17.738 0 0 1 62.313 32.5Zm0 7.917a9.896 9.896 0 1 0 0 19.792 9.896 9.896 0 0 0 0-19.792Zm9.895-23.75H8.875V56.25h28.381c.673 2.85 1.821 5.502 3.286 7.917H8.875c-4.394 0-7.917-3.563-7.917-7.917V8.75A7.89 7.89 0 0 1 8.875.833h23.75l7.917 7.917h31.666a7.917 7.917 0 0 1 7.917 7.917v15.081c-2.296-2.177-4.948-3.958-7.917-5.186v-9.895Z"
        fill="#000"
        fillOpacity={0.36}
      />
    </SvgIcon>
  );
}
