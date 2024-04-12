const express = require('express')
const routes = express.Router()
const adminCourseRoutes = require('./admin/courseRoutes')
const adminSectionRoutes = require('./admin/sectionRoutes')
const adminMaterialsRoutes = require('./admin/materialRoutes')
const adminQuestionsRoutes = require('./admin/questionsRoutes')

const webRoutes = require('./web/courseRoutes')
const deviceRoutes = require('./device/courseRoutes')

routes.use('/admin/courses', adminCourseRoutes)
routes.use('/admin/courses/sections', adminSectionRoutes)
routes.use('/admin/courses/sections/materials', adminMaterialsRoutes)
routes.use('/admin/courses/sections/materials/questions', adminQuestionsRoutes)
routes.use('/web/api/v1/courses', webRoutes)
routes.use('/device/api/v1/courses', deviceRoutes)

module.exports = routes;