import { css, cx } from 'emotion';
import { first } from 'lodash';
import React from 'react';
import { LicensePanelOptions } from 'types';
import { PanelProps } from '@grafana/data';
import { Button, Container, Field, TextArea } from '@grafana/ui';

/**
 * Panel Property
 */
interface Props extends PanelProps<LicensePanelOptions> {}

/**
 * Panel
 */
export const LicensePanel: React.FC<Props> = ({ options, data, width, height }) => {
  const licenseField = first(data.series)
    ?.fields.filter(field => field.name === 'license')
    .map(field => field);

  if (!licenseField) {
    return <div>No data</div>;
  }

  /**
   * Get License
   */
  const license = first(first(licenseField)?.values.toArray());

  /**
   * Render
   */
  return (
    <div
      className={cx(
        css`
          width: ${width}px;
          height: ${height}px;
        `
      )}
    >
      <Container>
        <Field label="Cluster key" description="Determines cluster capabilities for paid subscriptions">
          <div>
            <TextArea css="" value={license} rows={10} disabled={!options.allowUpdate} />
          </div>
        </Field>
      </Container>

      <Container>
        {options.allowUpdate && (
          <div>
            <Button>Update</Button>
          </div>
        )}
      </Container>
    </div>
  );
};
