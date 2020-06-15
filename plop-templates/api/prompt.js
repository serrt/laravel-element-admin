const { notEmpty } = require('../utils.js')

module.exports = {
  description: 'generate a api js',
  prompts: [
    { type: 'input', name: 'name', message: 'api name please', validate: notEmpty('name') }
  ],
  actions: data => {
    const name = '{{name}}'
    const actions = [{
      type: 'add',
      path: `src/api/${name}.js`,
      templateFile: 'plop-templates/api/index.hbs',
      data: {
        name: name
      }
    }]

    return actions
  }
}
