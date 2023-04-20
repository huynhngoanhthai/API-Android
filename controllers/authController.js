const { sign } = require("jsonwebtoken");
const ApiError = require("../utils/apiError");
const bcrypt = require('bcrypt')
const catchAsync = require("../middlewares/catchAsync");
const mysql = require("../config/Database/mySQL");
const EmailService = require("../utils/sendEmail");
EmailService.init();
exports.signup = catchAsync(async (req, res,next) => {
  
  const { name, email, password } = req.body;
  const salt = bcrypt.genSaltSync();
  const hashPassword = bcrypt.hashSync(password, salt);

  mysql.query('INSERT INTO users (name, email,password) VALUES (?, ?, ?);',[name, email, hashPassword],(error, result) => {
    if (error) {
      console.log(error.message);
      return next( new ApiError(400, "Error occurred during sign up process"));
    }
    console.log(result);
    res.status(200).json({ success: true, data: result });
  });
});
exports.setAction =  
catchAsync(async (req, res,next) => {
  
  const {  email } = req.params;

  mysql.query('CALL checkUpdateEmail(?);',[email],(error, result) => {
    if (error) {
      console.log(error);
      return next( new ApiError(400, error.sqlMessage));
    } 
    console.log(result);
    res.status(200).json({ success: true });
  });
});
exports.login = catchAsync(async (req, res,next) => {
  const { email, password } = req.body;
  
  
  mysql.query("SELECT * FROM users WHERE email = ?", [email], (error, result) => {
      if (error)  throw new ApiEror(400, error.message);
      if (!result.length) return next( new ApiError(403, "email or password wrong"));

      const user = result[0];
      console.log(user.action);
      if (user.action == 'false') return next( new ApiError(403, "email or password wrong"));
      // Do something with the user object here
      if (!user) return next( new ApiError(403, "email or password wrong"));
      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) return next(new ApiError(403, "email or password wrong"))
      else {
        req.user = { 
          email: user.email,
          password: user.password,
          name: user.name,
        }
        const token = sign(
          req.user,
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );
        res.json({
          success: true,
          token: token,
          user: req.user,
        });
      }
  
  });


});
exports.sendOTP = catchAsync(async (req,res) => {
  const { email } = req.body;
  if(!email)  throw new ApiError(403, "email not empty");
  const OTP =Math.floor(Math.random() * 900000).toString();
  try {
    EmailService.sendEmail(email, "Welcome to website","OPT: " + OTP);
  } catch (error) {
    res.status(200).json({ success: false,
    
    });
  }
 
  res.status(200).json({ success: true,
    OTP:OTP
  });
})

// exports.forgotPassword = catchAsync(async (req, res) => {
//   const { email } = req.body;

//   if (!email) throw new ApiError(400, "Please provide email!");

//   const user = await User.findOne({ email });

//   const randomPassword = Math.floor(Math.random() * 99999999) + 10000000;

//   user.updateOne({ password: randomPassword });

//   EmailService.sendEmail(
//     user.email,
//     "forgot Password",
//     "password new: " + randomPassword
//   );

//   res.status(200).json({ success: true, message: "Please checked your email" });
// });

// exports.resetPassword = catchAsync(async (req, res) => {
//   const { password, newPassword, newpasswordConfirmation } = req.body;

//   if (!password || !newpasswordConfirmation || !newPassword)
//     throw new ApiError(
//       400,
//       "Please provide both a password and a confirmation!"
//     );
//   if (newPassword !== newpasswordConfirmation)
//     throw new ApiError(400, "new password and confirmation do not match.");

//   const checked = await bcrypt.compare(password, req.user.password);
//   if (checked == false) {
//     throw new ApiError(400, "Incorrect password");
//   }

//   const user = await User.findByIdAndUpdate(req.user.id, {
//     password: newPassword,
//   });

//   res.status(200).json({ success: true, data: user });
// });