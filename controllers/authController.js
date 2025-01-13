const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { send } = require('process');
const sendEmail = require('../sendEmail');
const { promises } = require('dns');
const Cart = require('../models/Cart/cart');
const { default: mongoose } = require('mongoose');

dotenv.config();

// Registration API
exports.register = async (req, res) => {
    try {
        const { full_name, dob, email, password, avatar_url, status, role } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        if(!password) {
            return res.status(400).json({ message: 'Password is required' });
        }
        const codeuser = crypto.randomBytes(4).toString('hex');
        const user_id = new mongoose.Types.ObjectId();
        // Create new user
        user = new User({
            user_id,
            full_name,
            dob,
            email,
            password: await bcrypt.hash(password, 10),
            avatar_url,
            status,
            role,
            code: codeuser
        });
        const cart = new Cart({ user_id: user_id, items: [] });
        await cart.save();
        await user.save();
      return res.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Login API
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if(user.status == 3) return res.status(400).json({ message: 'User is not block' });
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        // Generate token
        const token = jwt.sign({ user }, process.env.YOUR_JWT_SECRET, { expiresIn: '7d' });
        const refreshToken = jwt.sign({ user }, process.env.YOUR_JWT_SECRET, { expiresIn: '7d' });

      return res.status(200).json({ token, refreshToken: refreshToken });
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ message: 'refreshToken is required' });
    }
    try {
        const user = jwt.verify(refreshToken, process.env.YOUR_JWT_SECRET);
        const newToken = jwt.sign({ user }, process.env.YOUR_JWT_SECRET, { expiresIn: '1h' });
      return res.status(200).json({ token: newToken });
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.logout = async (req, res) => {
  return res.status(200).json({ message: 'User logged out successfully' });
}

exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findOne({user_id:req.user.user_id});
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
      return res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Forgot Password API
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const resetToken = jwt.sign({ user: { id: user.user_id } }, process.env.RESET_PASSWORD_SECRET, { expiresIn: '1h'  }); // 10 minutes
        const url = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
        
       const a = await sendEmail(email, url, user.full_name, 'Reset Password');
        console.log(a);
      return res.status(200).json({ message: 'Password reset link has been sent to your email' });
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Reset Password API
exports.resetPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const user = await User.findOne({user_id:req.user.id});
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
      return res.status(200).json({ message: 'Password has been reset' });
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

