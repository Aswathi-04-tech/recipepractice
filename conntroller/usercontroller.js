const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => { 
    // first create a contorllere for user registration
    //export  use for insallisation and exporting the function to be used in other files This creates the function and exports it in one statement.
    //  It is the same idea as defining const register = async... and exporting it afterward.
    // async is used to define an asynchronous function that returns a promise. It allows the use of await within the function, which pauses the execution of the function until the promise is resolved or rejected.
    // req is the request object that contains information about the HTTP request, such as the request body, query parameters, headers, etc. 
    // res is the response object that is used to send a response back to the client.

    try{
        //get the user data from the request body
        const{ name, email, password } = req.body;
        //VALIDATE THE USER DATA OR INPUT FEALDS
        // check if the required fields are provided
        if(!name || !email || !password){
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
        // check if the email OR USER ALREADY EXISTS IN THE DATABASE
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).json({ message: 'User already exists' });
        }   
        //IF NO THEN CHECK PASSWOR AND ITS HASING
        // hash the password before saving it to the database
        // bcrypt is a library that provides a way to hash passwords securely. It uses a hashing algorithm to convert the password into a fixed-length string of characters,
        //  which is difficult to reverse-engineer. This helps protect user passwords in case of a data breach.
        // The number 10 is the salt rounds, which determines the complexity of the hashing process. A higher number means more security but also more processing time.
        // The hashed password is then stored in the database instead of the plain text password.
        //THE 10 IS THE 10 NUMBER OR CHACTERS USED TO HASH THE PASSWORD. IT IS A SALT VALUE THAT MAKES THE HASHING PROCESS MORE SECURE.

        const hashedPassword = await bcrypt.hash(password, 10);
        //AFTERVTHAT CREATE A NEW USER INSTANCE AND SAVE IT TO THE DATABASE
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });
        await newUser.save();
        return res.status(201).json({ message: 'User registered successfully' , user:{_id: newUser._id, name: newUser.name, email: newUser.email }});
        //WHY USE OR ADD USER DATA IN THE RESPONSE?
        // Including user data in the response can be useful for the client application to immediately have access to the newly created user's information without needing to make an additional request to fetch it.
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });  
    }
}

//THEN CREATE LOGIN

exports.loginUser = async (req, res) => {
  try {
    // Get email and password from request body
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Compare entered password with hashed password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send response to frontend
    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    return res.status(200).json({
      message: 'Profile fetched successfully',
      user
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};