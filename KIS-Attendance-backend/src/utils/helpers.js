const generateCode = () => {
  let code = '';
  const possible = '0123456789';
  for (var i = 0; i < 6; i++) {
    code += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return code;
};
module.exports = {
  generateCode,
};
