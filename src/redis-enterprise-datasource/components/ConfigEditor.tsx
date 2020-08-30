import React, { ChangeEvent, PureComponent } from 'react';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { LegacyForms } from '@grafana/ui';
import { REDataSourceOptions, RESecureJsonData } from '../types';

/**
 * Form fields
 */
const { SecretFormField, FormField, Switch } = LegacyForms;

/**
 * Config editor props
 */
interface Props extends DataSourcePluginOptionsEditorProps<REDataSourceOptions> {}

/**
 * Config editor component state
 */
interface State {}

/**
 * Config editor
 */
export class ConfigEditor extends PureComponent<Props, State> {
  /**
   * Redis Enterprise API host change listener
   *
   * @param {ChangeEvent<HTMLInputElement>} event Change event
   */
  onHostChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    onOptionsChange({
      ...options,
      jsonData: {
        ...options.jsonData,
        host: event.target.value,
      },
    });
  };

  /**
   * Redis Enterprise API user change listener
   *
   * @param {ChangeEvent<HTMLInputElement>} event Change event
   */
  onBasicAuthUserChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    onOptionsChange({
      ...options,
      basicAuth: true,
      basicAuthUser: event.target.value,
    });
  };

  /**
   * Redis Enterprise API password change listener.
   * Secure field (only sent to the backend)
   *
   * @param {ChangeEvent<HTMLInputElement>} event Change event
   */
  onBasicAuthPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    onOptionsChange({
      ...options,
      secureJsonData: { ...options.secureJsonData, basicAuthPassword: event.target.value },
    });
  };

  /**
   * Redis Enterprise API password reset listener
   */
  onBasicAuthPasswordReset = () => {
    const { onOptionsChange, options } = this.props;
    onOptionsChange({
      ...options,
      secureJsonFields: { ...options.secureJsonFields, basicAuthPassword: false },
      secureJsonData: { ...options.secureJsonData, basicAuthPassword: '' },
    });
  };

  /**
   * Render component
   */
  render() {
    const { options, onOptionsChange } = this.props;
    const { jsonData, secureJsonFields } = options;
    const secureJsonData = (options.secureJsonData || {}) as RESecureJsonData;

    /**
     * Return content
     */
    return (
      <div className="gf-form-group">
        <h3 className="page-heading">Redis Enterprise</h3>

        <div className="gf-form">
          <FormField
            label="Cluster URL"
            placeholder="https://redis-enterprise-cluster:9443"
            tooltip="Accepts https://host:port address."
            labelWidth={10}
            inputWidth={20}
            value={jsonData.host || ''}
            onChange={this.onHostChange}
          />
        </div>

        <div className="gf-form">
          <FormField
            label="User"
            placeholder="user@host.domain"
            labelWidth={10}
            inputWidth={20}
            value={options.basicAuthUser || ''}
            onChange={this.onBasicAuthUserChange}
          />
        </div>

        <div className="gf-form">
          <SecretFormField
            isConfigured={(secureJsonFields && secureJsonFields.basicAuthPassword) as boolean}
            label="Password"
            labelWidth={10}
            inputWidth={20}
            value={secureJsonData.basicAuthPassword || ''}
            onReset={this.onBasicAuthPasswordReset}
            onChange={this.onBasicAuthPasswordChange}
          />
        </div>

        <div className="gf-form">
          <Switch
            label="Skip TLS Verify"
            labelClass="width-10"
            tooltip="If checked, the server's certificate will not be checked for validity."
            checked={jsonData.tlsSkipVerify || false}
            onChange={(event) => {
              const jsonData = { ...options.jsonData, tlsSkipVerify: event.currentTarget.checked };
              onOptionsChange({ ...options, jsonData });
            }}
          />
        </div>
      </div>
    );
  }
}
