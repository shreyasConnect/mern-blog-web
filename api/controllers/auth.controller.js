import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const otpStorage = []; // Assuming otpStorage is declared globally or appropriately
const resendAttempts = {}; // Track resend attempts per user

// Function to generate and send OTP with timestamp
const generateAndSendOtp = async (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const timestamp = Date.now();

  otpStorage[email] = {
    otp,
    timestamp,
  };
  console.log(otpStorage);

  // Send the OTP to the user (send email, SMS, etc.)
  console.log(`OTP sent to ${email}: ${otp}`);

  return timestamp; // Return the timestamp for expiration tracking
}

// Function to track resend attempts
function trackResendAttempt(email) {
  if (!resendAttempts[email]) {
    resendAttempts[email] = 1;
  } else {
    resendAttempts[email]++;
  }
  return resendAttempts[email];
}


// Nodemailer setup (use your own SMTP details)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'wildlifewondersunveiled@gmail.com',
    pass: 'ialjcgryxzvcecgs',
  },
});


export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log(email);

  try {
    // Check if a document exists in the collection matching the email
    const userExists = await User.findOne({ email });

    if (userExists) {
      const timestamp = generateAndSendOtp(email);
      console.log(timestamp);

      // Reset resend attempts counter when generating a new OTP
      resendAttempts[email] = 0;

      const mailOptions = {
        from: 'wildlifewondersunveiled@gmail.com',
        to: email,
        subject: 'Password Reset OTP',
        html: `<!DOCTYPE html>
              <html lang="en">
              
              <head>
                  <meta charset="UTF-8">
                  <title>Password Reset OTP</title>
              
              
              </head>
              
              <body>
              
                  <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                      <div style="margin:50px auto;width:70%;padding:20px 0">
                          <div style="border-bottom:1px solid #eee">
                              <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">TechSavvy Blogs</a>
                          </div>
                          <p style="font-size:1.1em">Hi,</p>
                          <p>Thank you for choosing TechSavvy Blogs. Use the following OTP to complete your Password Recovery
                              Procedure.
                              OTP is valid for 10 minutes</p>
                          <h2
                              style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">
                              ${otpStorage[email].otp}</h2>
                          <p style="font-size:0.9em;">Regards,<br />TechSavvy Blogs</p>
                          <hr style="border:none;border-top:1px solid #eee" />
                          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                              <p>SCTR'S Pune Institute Of Computer Technology</p>
                              <p>Dhankawadi-411043</p>
                              <p>Pune</p>
                          </div>
                      </div>
                  </div>
              
              
              </body>
              
              </html>`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.status(500).json({ success: false, message: "Failed to send OTP. Please try again." });
        } else {
          res.status(200).json({ message: "OTP sent to your email address." });
          console.log('Email sent: ' + info.response);
        }
      });
    } else {
      // If no document exists with the provided email
      return res.status(400).json({ success: false, message: "Email doesn't exist!" });
    }
  } catch (error) {
    console.log("error: ", error);
  }


};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const Email = email;
  const storedOtpData = otpStorage[Email];
  console.log(email)

  try {
    if (storedOtpData.otp != otp) {
      return res.status(401).json({ success: false, message: "Invalid OTP" });
    }
    const expirationTime = 10 * 60 * 1000; // 10 minutes in milliseconds
    if (Date.now() - storedOtpData.timestamp > expirationTime) {
      return res.status(500).json({ success: false, message: "OTP has expired" });
    }
    res.status(200).json({ message: "OTP verified successfully." });
    delete otpStorage[email];
  }
  catch (error) {
    console.log("error:", error);
  }

}

export const resetPassword = async (req, res) => {
  const { email, password } = req.body;
  console.log(email)

  const hashedPassword = bcryptjs.hashSync(password, 10);
  try {
    // Update password based on email
    const result = await User.updateOne(
      { email }, // Filter by email
      { $set: { password: hashedPassword } } // Set new password
    );

    console.log(result)

    // Check if any document was modified (password reset was successful)
    if (result.modifiedCount !== 0) {
      res.status(200).json({ success: true, message: "Password reset successfully." });
    } else {
      res.status(500).json({ success: false, message: "An error occurred while resetting the password." });
    }

  }
  catch (error) {
    console.log("error: ", error);
    res.status(500).json({ success: false, message: "An error occurred while resetting the password." });
  }
}


export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === '' ||
    email === '' ||
    password === ''
  ) {
    next(errorHandler(400, 'All fields are required'));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.json('Signup successful');
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === '' || password === '') {
    next(errorHandler(400, 'All fields are required'));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, 'User not found'));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, 'Invalid password'));
    }
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET
    );

    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(' ').join('') +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
