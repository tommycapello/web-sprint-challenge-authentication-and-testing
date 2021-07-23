const Auth = require('./auth-model')


const validateUniqueUser = async (req, res, next) => {
  const {username} = req.body
  const existingUser = await Auth.findByUsername(username)
  if(!existingUser){
    next({message:'username taken'})
  }
  else{
    next()
  }
}

const checkBody = (req, res, next) => {
    const { username, password } = req.body;
    const valid = Boolean(username && password);
    if (valid) {
      next();
    } else {
      next({
        status: 422,
        message: 'username and password required',
      });
    }
  };

module.exports = {
    validateUniqueUser,
    checkBody
}