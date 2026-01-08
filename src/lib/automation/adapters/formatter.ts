import { IntegrationAdapter, ExecutionContext } from '../types';

export class FormatterAdapter implements IntegrationAdapter {
  name = 'formatter';

  async execute(action: string, config: any, context: ExecutionContext): Promise<any> {
    switch (action) {
      case 'format_text':
        return await this.formatText(config, context);

      case 'format_number':
        return await this.formatNumber(config, context);

      case 'format_date':
        return await this.formatDate(config, context);

      case 'split_text':
        return await this.splitText(config, context);

      case 'find_replace':
        return await this.findReplace(config, context);

      case 'extract_text':
        return await this.extractText(config, context);

      default:
        throw new Error(`Unknown Formatter action: ${action}`);
    }
  }

  validate(config: any): boolean {
    return true;
  }

  private async formatText(config: any, context: ExecutionContext): Promise<any> {
    let text = config.text || '';

    if (config.uppercase) {
      text = text.toUpperCase();
    }
    if (config.lowercase) {
      text = text.toLowerCase();
    }
    if (config.capitalize) {
      text = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }
    if (config.trim) {
      text = text.trim();
    }

    return { formatted_text: text };
  }

  private async formatNumber(config: any, context: ExecutionContext): Promise<any> {
    const number = parseFloat(config.number || 0);
    const decimals = config.decimals || 2;
    const locale = config.locale || 'de-DE';
    const style = config.style || 'decimal'; // 'decimal' | 'currency' | 'percent'

    const formatter = new Intl.NumberFormat(locale, {
      style: style as any,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      currency: config.currency || 'EUR',
    });

    return { formatted_number: formatter.format(number) };
  }

  private async formatDate(config: any, context: ExecutionContext): Promise<any> {
    const date = new Date(config.date || Date.now());
    const format = config.format || 'iso'; // 'iso' | 'date' | 'time' | 'datetime' | 'custom'

    let formatted: string;

    switch (format) {
      case 'iso':
        formatted = date.toISOString();
        break;
      case 'date':
        formatted = date.toLocaleDateString('de-DE');
        break;
      case 'time':
        formatted = date.toLocaleTimeString('de-DE');
        break;
      case 'datetime':
        formatted = date.toLocaleString('de-DE');
        break;
      case 'custom':
        formatted = this.formatCustomDate(date, config.custom_format || 'YYYY-MM-DD');
        break;
      default:
        formatted = date.toISOString();
    }

    return { formatted_date: formatted };
  }

  private formatCustomDate(date: Date, format: string): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  }

  private async splitText(config: any, context: ExecutionContext): Promise<any> {
    const text = config.text || '';
    const delimiter = config.delimiter || ' ';
    const parts = text.split(delimiter);

    return {
      parts,
      first: parts[0] || '',
      last: parts[parts.length - 1] || '',
      count: parts.length,
    };
  }

  private async findReplace(config: any, context: ExecutionContext): Promise<any> {
    let text = config.text || '';
    const find = config.find || '';
    const replace = config.replace || '';
    const replaceAll = config.replace_all !== false; // Default: replace all

    if (replaceAll) {
      text = text.split(find).join(replace);
    } else {
      text = text.replace(find, replace);
    }

    return { result: text };
  }

  private async extractText(config: any, context: ExecutionContext): Promise<any> {
    const text = config.text || '';
    const pattern = config.pattern || '';
    const flags = config.flags || 'g';

    try {
      const regex = new RegExp(pattern, flags);
      const matches = text.match(regex);

      return {
        matches: matches || [],
        first_match: matches?.[0] || null,
        all_matches: matches || [],
      };
    } catch (error) {
      throw new Error(`Invalid regex pattern: ${pattern}`);
    }
  }
}

