export class Logger {
  constructor(context = 'Logger') {
    this.context = context;
    this.colors = {
      reset: '\x1b[0m',
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      magenta: '\x1b[35m',
      cyan: '\x1b[36m',
      white: '\x1b[37m'
    };
  }

  formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const contextStr = `[${this.context}]`;
    const levelStr = `[${level.toUpperCase()}]`;
    
    let output = `${timestamp} ${contextStr} ${levelStr} ${message}`;
    
    if (data) {
      output += '\n' + JSON.stringify(data, null, 2);
    }
    
    return output;
  }

  colorize(text, color) {
    return `${this.colors[color]}${text}${this.colors.reset}`;
  }

  info(message, data = null) {
    const formatted = this.formatMessage('info', message, data);
    console.log(this.colorize(formatted, 'blue'));
  }

  success(message, data = null) {
    const formatted = this.formatMessage('success', message, data);
    console.log(this.colorize(formatted, 'green'));
  }

  warn(message, data = null) {
    const formatted = this.formatMessage('warn', message, data);
    console.warn(this.colorize(formatted, 'yellow'));
  }

  error(message, data = null) {
    const formatted = this.formatMessage('error', message, data);
    console.error(this.colorize(formatted, 'red'));
  }

  debug(message, data = null) {
    if (process.env.NODE_ENV === 'development') {
      const formatted = this.formatMessage('debug', message, data);
      console.log(this.colorize(formatted, 'magenta'));
    }
  }
} 