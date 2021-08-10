const { notEmpty } = require('../utils.js')

module.exports = {
  description: 'generate a resource views',
  prompts: [
    { type: 'input', name: 'name', message: 'resource name please', validate: notEmpty('name') }
  ],
  actions: data => {
    const name = '{{name}}'
    const actions = [{
      type: 'add',
      path: `src/views/${name}/index.vue`,
      templateFile: 'plop-templates/resource/index.hbs'
    }, {
      type: 'add',
      path: `src/views/${name}/create.vue`,
      templateFile: 'plop-templates/resource/create.hbs'
    }, {
      type: 'add',
      path: `src/views/${name}/edit.vue`,
      templateFile: 'plop-templates/resource/edit.hbs'
    }, {
      type: 'add',
      path: `src/views/${name}/form.vue`,
      templateFile: 'plop-templates/resource/form.hbs'
    }, {
      type: 'add',
      path: `src/views/${name}/show.vue`,
      templateFile: 'plop-templates/resource/show.hbs'
    }, {
      type: 'add',
      path: `src/router/${name}.js`,
      templateFile: 'plop-templates/resource/route.hbs'
    }]

    return actions
  }
}
