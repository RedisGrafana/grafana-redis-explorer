/**
 * Series Size
 */
type SeriesSize = 'sm' | 'md' | 'lg';

/**
 * Panel Configuration Options
 */
export interface LicensePanelOptions {
  /**
   * Text
   *
   * @type {string}
   */
  text: string;

  showSeriesCount: boolean;

  seriesCountSize: SeriesSize;
}
