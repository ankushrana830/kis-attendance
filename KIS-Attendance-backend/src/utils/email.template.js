const addEmployeeTemplate = (name, emp_id, password) => {
 return `<p>Hello ${name}</p>
  <p>you are registered with kis. Your employee_id is ${emp_id} and your password is ${password} </p>
  <p> Do not forward or share your  details to anyone</p>  
  <p> Sincerely</p>
  <p> The Kis Team</p>
  `;
};

module.exports = {
  addEmployeeTemplate,
};
