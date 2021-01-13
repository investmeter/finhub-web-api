const {createLogger, format, transports, config} = require('winston')

// const { createLogger, format, transports } = require('winston');

const { combine, timestamp, label, printf } = format;

const formatOutput = printf(({ level, message, label, timestamp, ms }) => {
    if (label) {
        return `${timestamp} [${label}] ${level}: ${message}`
    }
    else{
        return `${timestamp} ${level}: ${message}`
    }

});

const consoleFormat =  format.combine(
    format.timestamp(),
    format.splat(),
    formatOutput

)

const fileFormat =  format.combine(
    format.timestamp(),
    format.json()
)

const logger = createLogger({
    levels: config.syslog.levels,
   // format:   format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
    transports: [
        new transports.Console({ level: 'info' , format:combine(format.colorize({all:true}),consoleFormat)}),
        new transports.File({
            filename: 'gateway.log',
            level: 'info',
            format: consoleFormat
        })
    ]
})

//logger.info("test %o", {something2:"sdfsdfsad"}, {label:"YO"} )

module.exports=logger





