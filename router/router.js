const express = require("express")
const router = express.Router()

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ 
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
})

const feedBackController = require("../controller/feedBackController")
const { validateBodySchema } = require("../validation/feedbackValidationSchema")
const userController = require("../controller/userController")
const tokenAuthentication = require("../controller/tokenAuthentication")
const propertyController = require("../controller/propertyController")

// feedback routes
router.post('/feedback', validateBodySchema,tokenAuthentication ,feedBackController.create)
router.get('/feedback/:tableName',tokenAuthentication, feedBackController.getAllRecords)
router.put('/feedback', validateBodySchema, tokenAuthentication,feedBackController.updateRecord)
router.delete('/feedback',tokenAuthentication,feedBackController.deleteRecord)

// user auth routes 
router.post('/signup',userController.signup)
router.post('/login',userController.login)
// router.post('/logout',userController.logout)
// router.post('/forgot-password',userController.forgotPassword)
// router.post('/reset-password',userController.resetPassword)
// router.post('/verify-email',userController.verifyEmail)
// router.post('/resend-verification-email',userController.resendVerificationEmail)

//property routes
router.post('/property',propertyController.create) // validation for duplicates is pending 
router.get('/property',propertyController.listAll)
// router.put('/property',tokenAuthentication,propertyController.update)
// router.delete('/property',tokenAuthentication,propertyController.delete)

//upload Photos

router.post('/upload-photos', upload.array('files', 5), propertyController.uploadPhotos)

module.exports = router