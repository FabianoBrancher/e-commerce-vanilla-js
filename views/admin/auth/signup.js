const layout = require('../layout');

module.exports = ({ request }) => {
  return layout({
    content: `
  <div>
    ${request.session.userId}
    <form method="POST">
      <input name="email" placeholder="email" />
      <input name="password" placeholder="password" />
      <input name="passwordConfirmation" placeholder="password confirmation" />
      <button>sign up</button>
    </form>
  </div>
`})
};