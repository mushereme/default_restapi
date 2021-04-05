const pdf = require("html-pdf")
const ejs = require("ejs")
const path = require("path")
const puppeteer = require("puppeteer")

exports.createPdf = async (id, data, options) => {
    return await new Promise((resolve, reject) => {
        pdf.create(data, options).toFile(`pdf/vote_${id}.pdf`, (err, data) => {
            if(err) reject(err)            
            resolve(data)
        })
    })
    
}

exports.renderFile = async (templatePath, data) => {
    return await new Promise((resolve, reject) => {
        ejs.renderFile(path.join('./views', templatePath), data, (err, data) => {
            if(err) reject(err) 
            resolve(data)
        })
    })
}

exports.puppeteer = async (html, option, id) => {

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
    })

    const page = await browser.newPage()
    
    await page.setContent(html, {
        waitUntil: 'domcontentloaded'
    })

    var rendered = await page.pdf(option)

    await browser.close()
}