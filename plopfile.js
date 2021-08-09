const viewGenerator = require('./plop-templates/view/prompt')
const componentGenerator = require('./plop-templates/component/prompt')
const storeGenerator = require('./plop-templates/store/prompt.js')
const apiGenerator = require('./plop-templates/api/prompt.js')
const resourceGenerator = require('./plop-templates/resource/prompt.js')

module.exports = function(plop) {
  plop.setGenerator('resource', resourceGenerator)
  plop.setGenerator('view', viewGenerator)
  plop.setGenerator('component', componentGenerator)
  plop.setGenerator('store', storeGenerator)
  plop.setGenerator('api', apiGenerator)
}
