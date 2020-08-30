import React, { PureComponent } from 'react';
import { AppRootProps } from '@grafana/data';
import { GlobalSettings } from './types';

interface Props extends AppRootProps<GlobalSettings> {}

interface State {}

export class RootPage extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return <div>123</div>;
  }
}
