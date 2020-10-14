const express = require('express');
const moment = require('moment');
const path = require('path');

const { isAuthenticated } = require('../config/auth');;
const { systemError } = require('../functions/errors');
const { slugify } = require('../functions/general');

const router = express.Router();

router.post('/', (req, res, next) => {
    try {
        const { folderPath, extension, title } = req.body;
        const reqFile = req.files;
        const user = req.user;
        if (reqFile == undefined) {
            return res.status(400).send('No files were uploaded.');
        }

        if (reqFile.file == undefined) {
            return res.status(400).send('No files were uploaded.');
        }
        
        let file = reqFile.file;
        let ext = extension;
        let date = moment(Date.now()).format('YYYY-MM-DD');
        let randomName = slugify(`${title} ${date}`);
        const fileN = `${randomName}.${ext}`;
    
        let finalFile = `${folderPath}/${fileN}`;
    
        const publicDir = req.app.locals.publicDir;
        const finalFilePath = path.join(publicDir, finalFile);
        
        file.mv(finalFilePath, async (err) => {
            if (err){
                const error = new Error(JSON.stringify([err.message]));
                next(error);
            } else {
                res.send(finalFile);
            }
        });
    } catch (e) {
        next(systemError(e.message));
    }
});

module.exports = router;