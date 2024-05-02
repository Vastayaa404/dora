import chalk from 'chalk';
import morgan from 'morgan';

morgan.token('ip', req => {
    return req.headers['x-real-ip'] || req.ip;
});

const morganFormat = (tokens, req, res) => {
    const status = tokens.status(req, res);
    const statusColor = status >= 500 ? 'red' : status >= 400 ? 'yellow' : status >= 300 ? 'cyan' : status >= 200 ? 'green' : 'reset';

    return `${chalk[statusColor](tokens.method(req, res))} ${chalk[statusColor](tokens.url(req, res))} from [${tokens.ip(req, res)}]` +
    ` responded ${chalk[statusColor](status)} ${tokens.referrer(req, res) || '[no ref]'} - ${tokens['response-time'](req, res)} ms at` +
    ` [${tokens.date(req, res, 'web')}]`
};

export { morgan, morganFormat };