const User = require('../models/user');
const Course = require('../models/course');
const StudentCourse = require('../models/student_course');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, { user_id: 1, full_name: 1, role: 1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getAllUsers22 = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { user_id } = req.body;
        if (user_id === req.user.user_id) {
            return res.status(400).json({ message: 'You cannot delete yourself' });
        }
        console.log({ user_id });
        const user = await User.find({ user_id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.findOneAndDelete({ user_id });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.setRole = async (req, res) => {
    try {
        const { user_id, role, status } = req.body;
        if (!Number.isInteger(role) || !Number.isInteger(status)) {
            return res.status(400).json({ message: 'Role or status must be an integer' });
        }

        if (user_id === req.user.user_id) {
            return res.status(400).json({ message: 'You cannot change your own role' });
        }

        if (!role || !status) {
            return res.status(400).json({ message: 'Role or status is required' });
        }

        const user = await User.findOne({ user_id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = Number(role);
        user.status = Number(status);
        await user.save();
        res.status(200).json({ message: 'Role updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
exports.detailUser = async (req, res) => {
    try {
        const user = req.user;
        console.log({ user });
        res.status(200).json(user);

    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}



exports.profile = async (req, res) => {
    try {
        const user = req.user;
        const profile = await User.findOne({ user_id: user.user_id },{
            full_name:1,
            email:1,
            address:1,
            avatar:1,
            role:1,
            status:1,
            created_at:1,
            updated_at:1,
            coin:1,
            dob:1,
            gender:1,
            email_contact:1,
            phone_contact:1,
            avatar_url:1,
            code:1
        });

        const CoursesSignedUp = await StudentCourse.countDocuments({ user_id: user.user_id });
        const CoursesSuccessfullyCompleted = await StudentCourse.find({ user_id: user.user_id })
            .populate(
                {
                    path: 'course_id',
                    select: { process: 1 },
                    model: 'Course',
                    localField: 'course_id',
                    foreignField: 'course_id'
                }
            ).countDocuments({ process: "100" });
        
        // delete profile.password;

        console.log();
        res.status(200).json({ CoursesSignedUp, CoursesSuccessfullyCompleted ,profile});


    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }

}
exports.editProfile = async (req, res) => {
    try {
        const { full_name, email_contact, phone_contact, avatar_url, dob, gender } = req.body;
        const user = req.user;

        const updatedUser = await User.findOneAndUpdate(
            { user_id: user.user_id },
            {
                full_name: full_name,
                email_contact: email_contact,
                phone_contact: phone_contact,
                avatar_url: avatar_url,
                dob: dob,
                gender: gender
            },
            { new: true }
        );
        console.log({ updatedUser });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Update profile success', user: updatedUser });

    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}