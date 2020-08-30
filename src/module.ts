import { RootPage } from 'RootPage';
import { AppPlugin } from '@grafana/data';
import { ExampleConfigCtrl } from './legacy/config';
import { GlobalSettings } from './types';

// Legacy exports just for testing
export { ExampleConfigCtrl as ConfigCtrl };

export const plugin = new AppPlugin<GlobalSettings>().setRootPage(RootPage);
