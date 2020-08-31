import { PanelPlugin } from '@grafana/data';
import { LicensePanel } from './LicensePanel';
import { LicensePanelOptions } from './types';

/**
 * Panel plugin
 */
export const plugin = new PanelPlugin<LicensePanelOptions>(LicensePanel).setPanelOptions((builder) => {
  return builder.addBooleanSwitch({
    path: 'allowUpdate',
    name: 'Allow Update',
    defaultValue: false,
  });
});
