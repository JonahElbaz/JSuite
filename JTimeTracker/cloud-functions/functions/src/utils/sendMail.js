const nodemailer = require('nodemailer');
const Handlebars = require('handlebars');
const reportTemplateHTML = require('../templates/report.js');
const pdf = require('html-pdf');

async function sendReportMail(email, subject, data) {
    const template = Handlebars.compile(reportTemplateHTML);
    const result = template(data);

    try {
        const base64Data = await new Promise((resolve) => {
            pdf.create(result, {}).toBuffer((err, buffer) => {
                // @ts-ignore
                resolve(new Buffer.from(buffer).toString('base64'));
            });
        });

        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'jtimetrackerapp@gmail.com',
                pass: 'C_[x=P\\)%4H8jbU_'
            },
        });

        transporter.sendMail({
            from: '"J Time Tracker" <jonahelbaz96@gmail.com>', // sender address
            to: email,
            subject: subject,
            html: `
            <h2>Dear Jonah,</h2>
            <div>Attached is your report</div>
        `,
            attachments: [
                {
                    filename: `report.pdf`,
                    content: base64Data,
                    encoding: 'base64',
                }
            ]
        }).then(info => {
            console.log("Message sent: %s", info.messageId);

        }).catch(e => {
            console.log('Error: ' + e);
        })
    }catch (e) {
        console.log('Failed: ' + e)
    }

}

module.exports = sendReportMail;
