const layout = require('../layout');

const getError = (errors, prop) => {
  // prop === 'email' || 'password' || 'passwordConfirmation'
  try {
    return errors.mapped()[prop].msg;
  } catch (error) {
    return '';
  }
}

module.exports = () => {
  return layout({
    content: `
  <div>
    <form method="POST">
      <input name="email" placeholder="email" />
      
      <input name="password" placeholder="password" />
      
      <button>sign in</button>
    </form>
  </div>
` });
};