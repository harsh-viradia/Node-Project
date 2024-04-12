const fs = require('fs')
const path = require('path')
const templatesDir = path.resolve(baseDir, 'public/templates');
let emailTemplates = require('email-templates');
let htmlTemplate = require('../components/htmlTemplete/htmlTemplate.model');
const Templates = require('../components/emails/templatesModel')
const htmlTemplateConstant = require('../components/htmlTemplete/htmlTemplate.constant')

const modifyTemplateContent = async (templateData, compactData) =>
    new Promise((async (resolve, reject) => {
        templateData = replaceCurlyBracesWithEjsSyntax(templateData);
        await convertTemplateToString(templateData, compactData,
            (err, mailString) => {
                if (err) {
                    return reject(err)
                }
                resolve(mailString);
            });
    }));

const replaceCurlyBracesWithEjsSyntax = (str) => {
    return str.replace(/{{/g, '<%=').replace(/}}/g, '%>');
};

const convertTemplateToString = async (htmlString, payload, callback) => {
    // htmlString = /*"<% include mail_header.ejs %>" +*/ htmlString;
    /*+ "<% include mail_footer.ejs %>"*/
    createDynamicTemplate(htmlString,
        (err, templateName) => {
            emailTemplates(templatesDir, (err, template) => {
                if (err) {
                    callback(err)
                }
                template(templateName, payload,
                    (err, html, text) => {
                        if (err) {
                            callback(err);
                        }
                        fs.rmSync(templatesDir + '/' + templateName, {recursive: true});
                        callback(null, html);
                    });
            });
        });
};

const createDynamicTemplate = async (html_string, callback) => {
    let dir = 'auto-generated-' + await _random(15, true);
    let dirPath = `${templatesDir}/${dir}`;
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
    fs.writeFile(dirPath + '/html.ejs', html_string, (err) => {
        if (err) {
            callback(err);
        }
        callback(null, dir);
    });
};

const getTemplate = async (code, compactData) => {
    let template = await Templates.findOne({code: code}).lean()
    // const contents = await htmlTemplate.find({code: {$in: [htmlTemplateConstant.HEADER_CONTENT, htmlTemplateConstant.FOOTER_CONTENT]}}).lean();
    // const header = _.find(contents, {code: htmlTemplateConstant.HEADER_CONTENT});
    // const footer = _.find(contents, {code: htmlTemplateConstant.FOOTER_CONTENT});
    // const body = await setHeaderAndFooter(template.body, {header: header?.body, footer: footer?.body});
    template.body = await modifyTemplateContent(template.body, compactData);
    return template;
}

const setHeaderAndFooter = async (body, obj) => {
    return body.replace('{{header}}', obj.header || '').replace('{{footer}}', obj.footer || '');
}

module.exports = {
    getTemplate
}
