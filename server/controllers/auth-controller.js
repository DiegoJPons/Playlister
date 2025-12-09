const auth = require("../auth");
const User = require("../models/user-model");
const bcrypt = require("bcryptjs");

getLoggedIn = async (req, res) => {
  try {
    let userId = auth.verifyUser(req);
    if (!userId) {
      return res.status(200).json({
        loggedIn: false,
        user: null,
        errorMessage: "?",
      });
    }

    const loggedInUser = await User.findOne({ _id: userId });
    console.log("loggedInUser: " + loggedInUser);

    return res.status(200).json({
      loggedIn: true,
      user: {
        _id: loggedInUser._id,
        userName: loggedInUser.userName,
        email: loggedInUser.email,
        avatar: loggedInUser.avatar,
        isGuest: loggedInUser.isGuest,
      },
    });
  } catch (err) {
    console.log("err: " + err);
    res.json(false);
  }
};

loginUser = async (req, res) => {
  console.log("loginUser");
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });
    }

    const existingUser = await User.findOne({ email: email });
    console.log("existingUser: " + existingUser);
    if (!existingUser) {
      return res.status(401).json({
        errorMessage: "Wrong email or password provided.",
      });
    }

    console.log("provided password: " + password);
    const passwordCorrect = await bcrypt.compare(
      password,
      existingUser.passwordHash
    );
    if (!passwordCorrect) {
      console.log("Incorrect password");
      return res.status(401).json({
        errorMessage: "Wrong email or password provided.",
      });
    }

    // LOGIN THE USER
    const token = auth.signToken(existingUser._id);
    console.log(token);

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: true,
      })
      .status(200)
      .json({
        success: true,
        user: {
          userName: existingUser.userName,
          email: existingUser.email,
          avatar: existingUser.avatar,
        },
      });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
};

logoutUser = async (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: true,
      sameSite: "none",
    })
    .send();
};

registerUser = async (req, res) => {
  console.log("REGISTERING USER IN BACKEND");
  try {
    const { userName, email, password, passwordVerify, avatarUrl } = req.body;
    console.log(
      "create user: " +
        userName +
        " " +
        email +
        " " +
        password +
        " " +
        passwordVerify
    );
    if (!userName || !email || !password || !passwordVerify || !avatarUrl) {
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });
    }
    console.log("all fields provided");
    if (password.length < 8) {
      return res.status(400).json({
        errorMessage: "Please enter a password of at least 8 characters.",
      });
    }
    console.log("password long enough");
    if (password !== passwordVerify) {
      return res.status(400).json({
        errorMessage: "Please enter the same password twice.",
      });
    }
    console.log("password and password verify match");
    const existingUser = await User.findOne({ email: email });
    console.log("existingUser: " + existingUser);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        errorMessage: "An account with this email address already exists.",
      });
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);
    console.log("passwordHash: " + passwordHash);

    const newUser = new User({
      userName,
      email,
      passwordHash,
      avatar: avatarUrl,
    });
    const savedUser = await newUser.save();
    console.log("new user saved: " + savedUser._id);

    // LOGIN THE USER
    const token = auth.signToken(savedUser._id);
    console.log("token:" + token);

    await res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .status(200)
      .json({
        success: true,
        user: {
          userName: savedUser.userName,
          email: savedUser.email,
          avatar: savedUser.avatar,
        },
      });

    console.log("token sent");
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
};

updateUser = async (req, res) => {
  console.log("UPDATING USER IN BACKEND");
  try {
    const { userName, password, passwordVerify, avatarUrl } = req.body;
    const userId = auth.verifyUser(req);
    if (!userId) {
      return res.status(400).json({
        errorMessage: "UNAUTHORIZED",
      });
    }

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(400).json({
        errorMessage: "USER NOT FOUND",
      });
    }

    user.userName = userName;
    user.avatar = avatarUrl || "";

    if (password || passwordVerify) {
      if (password.length < 8) {
        return res.status(400).json({
          errorMessage: "Please enter a password of at least 8 characters.",
        });
      }
      if (password !== passwordVerify) {
        return res.status(400).json({
          errorMessage: "Please enter the same password twice.",
        });
      }

      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      user.passwordHash = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      user: {
        _id: updatedUser._id,
        userName: updatedUser.userName,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      errorMessage: "ERROR WHILE UPDATING USER",
    });
  }
};

loginGuest = async (req, res) => {
  console.log("LOGIN GUEST IN BACKEND");
  try {
    const guestName = "Guest-" + Date.now().toString();
    const guestEmail = "guest-" + Date.now().toString() + "@guest.com";

    const guestAccount = new User({
      userName: guestName,
      email: guestEmail,
      passwordHash: null,
      avatar: "",
      isGuest: true,
    });

    const savedGuest = await guestAccount.save();

    const token = auth.signToken(savedGuest._id);

    await res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .status(200)
      .json({
        success: true,
        user: {
          _id: savedGuest._id,
          userName: savedGuest.userName,
          email: savedGuest.email,
          avatar: savedGuest.avatar,
          isGuest: true,
        },
      });
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};

module.exports = {
  getLoggedIn,
  registerUser,
  loginUser,
  logoutUser,
  updateUser,
  loginGuest,
};
