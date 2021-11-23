const Handlebars = require('handlebars');
const reportTemplateHTML = require('./templates/report.js');

async function generateReportPDF(data, context) {
    if (!data.content) {
        return {message: 'Missing data content'};
    }
    try {
        const template = Handlebars.compile(reportTemplateHTML);
        const result = template(data.content);
        return {message: 'PDF Created', data: result, result}
    } catch (e) {
        console.log('Failed to create pdf');
        console.log(JSON.stringify(e));
        return {message: 'Failed to create pdf'};
    }
}

module.exports = generateReportPDF;
