const Course = require('../models/course');
const StudentCourse = require('../models/student_course');
const User = require('../models/user');
const PurchaseHistory = require('../models/purchase_history');
const { default: mongoose } = require('mongoose');
const Lesson = require('../models/lessons');
const Section = require('../models/sections');
const Cart = require('../models/Cart/cart');
const CartDetail = require('../models/Cart/cartDetail');
require('dotenv').config();


exports.joinCourseWithCoin = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const { course_id } = req.body;
        const [course, user] = await Promise.all([
            Course.findOne({ course_id }),
            User.findOne({ user_id })
        ]);
        if (!course) {
            return res.status(400).json({ message: 'Course not found' });
        }

        if (Number(user.coin) < Number(course.coursePrice)) {
            return res.status(400).json({ message: 'Not enough coin' });
        }

        const newCoinStudent = Number(user.coin) - Number(course.coursePrice);
        const updateUserCoin = await User.updateOne({ user_id: user_id }, { $set: { coin: Number(newCoinStudent) } });
        const enroll = Number(course.enroll) + 1;
        await Course.updateOne({ course_id: course_id }, { $set: { enroll: enroll } });
        if (!updateUserCoin) {
            return res.status(400).json({ message: 'Failed to update coin student' });
        }
        const purchase_history = new PurchaseHistory({ course_id, user_id, totalPrice: course.coursePrice, status: 'completed', type: 'course' });
        await purchase_history.save();
        const teacher = await User.findOne({ user_id: course.user_id });
        const newCoinTeacher = Number(teacher.coin) + Number(course.coursePrice);
        const updateTeacherCoin = await User.updateOne({ user_id: course.user_id }, { $set: { coin: Number(newCoinTeacher) } });
        if (!updateTeacherCoin) {
            return res.status(400).json({ message: 'Failed to update coin teacher' });
        }

        const student_course = new StudentCourse({ course_id, user_id });
        await student_course.save();
        return res.status(200).json({ message: 'Course joined successfully' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
}


exports.joinCoursesInCart = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const user = await User.findOne({ user_id });
        const cart = await Cart.findOne({ user_id }).populate('items')
        const course_ids = cart.items.map(item => item.course_id);
        console.log({ course_ids })
        const userCart = await Cart.findOne({ user_id });
        if (!userCart) {
            return res.status(400).json({ message: 'Cart not found' });
        }
        if (userCart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }
        let totalPrice = userCart.totalPrice;
        const courses = await Course.find({ course_id: { $in: course_ids } });
        if (courses.length !== course_ids.length) {
            return res.status(400).json({ message: 'Some courses not found' });
        }
        console.log({ totalPrice })
        console.log({ user })
        if (Number(user.coin) < totalPrice) {
            return res.status(400).json({ message: 'Not enough coin' });
        }

        const checkExist = await StudentCourse.find({ user_id, course_id: { $in: course_ids } });
        if (checkExist.length > 0) {
            return res.status(400).json({ message: 'Some courses already joined' });
        }
        await Promise.all(
            courses.map(async (course) => {


                const student_course = new StudentCourse({ course_id: course.course_id, user_id });
                await student_course.save();
                const enroll = Number(course.enroll) + 1;
                await Course.updateOne({ course_id: course.course_id }, { $set: { enroll: enroll } });
                const purchase_history = new PurchaseHistory({ course_id: course.course_id, user_id, totalPrice: course.coursePrice, status: 'completed', type: 'course' });
                await purchase_history.save();
            })
        );
        const newCoin = Number(user.coin) - totalPrice;

        cart.items.forEach(async (item) => {
            await CartDetail.findOneAndDelete({ _id: item });
        });

        cart.items = [];

        cart.totalPrice = 0;
        await cart.save();

        await User.updateOne({ user_id }, { $set: { coin: newCoin } });
        return res.status(200).json({ message: 'Courses joined successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}












exports.joinCourseWithCode = async (req, res) => {
    try {
        const user = req.user;
        const { course_id, code } = req.body;
        const course = await Course.findOne({ course_id });
        if (!course) {
            return res.status(400).json({ message: 'Course not found' });
        }
        if (course.code !== code) {
            return res.status(400).json({ message: 'Invalid code' });
        }
        const student_course = new StudentCourse({ course_id, user_id: user.user_id });
        await student_course.save();

        const enroll = Number(course.enroll) + 1;
        await Course.updateOne({ course_id: course_id }, { $set: { enroll: enroll } });

        const purchase_history = new PurchaseHistory({ course_id, user_id: user.user_id, totalPrice: 0, status: 'completed', type: 'course' });
        await purchase_history.save();
        return res.status(200).json({ message: 'Course joined successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


exports.joinCourseWithTeacher = async (req, res) => {
    try {
        const { course_id, query } = req.body;
        const user = await User.findOne({
            $or: [
                { email: query },
                { code: query },
                { user_id: query }
            ]
        })
        console.log({ course_id, query })
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const course = await Course.findOne({ course_id });

        if (!course) {
            return res.status(400).json({ message: 'Course not found1   ' });
        }
        const student_course_Exits = await StudentCourse.findOne({ course_id, user_id: user.user_id });
        if (student_course_Exits) {
            return res.status(400).json({ message: 'Course already joined' });
        }


        const student_course = new StudentCourse({ course_id, user_id: user.user_id });
        await student_course.save();

        const enroll = Number(course.enroll) + 1;
        await Course.updateOne({ course_id: course_id }, { $set: { enroll: enroll } });

        const purchase_history = new PurchaseHistory({ course_id, user_id: user.user_id, totalPrice: 0, status: 'completed', type: 'course' });
        await purchase_history.save();
        return res.status(200).json({ message: 'Course joined successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


exports.listStudentCourse = async (req, res) => {
    try {
        const course_id = req.body.course_id;
        const user_id = req.user.user_id;

        let pipeline = [];

        if (!course_id) {
            pipeline = [

                {
                    $lookup: {
                        from: 'users', // Tên collection User trong MongoDB
                        localField: 'user_id',
                        foreignField: 'user_id',
                        as: 'user'
                    }
                },
                {
                    $lookup: {
                        from: 'courses', // Tên collection Course trong MongoDB
                        localField: 'course_id',
                        foreignField: 'course_id',
                        as: 'course'
                    }
                },
                {
                    $unwind: '$user' // Giải nén mảng user
                },
                {
                    $project: {
                        'user.code': 1,
                        'user.user_id': 1,
                        'user.full_name': 1,
                        progress: 1, // Lấy trường progress từ bảng student_course
                        joinAt: '$createdAt',// Thêm thời gian gia nhập
                        'course.name': 1,
                        teacher: '$course.user_id'

                    }
                },
                {
                    $project: {
                        'course.name': 1,
                        'user.code': 1,
                        'user.user_id': 1,
                        'user.full_name': 1,
                        teacher: 1,
                        progress: 1,
                        joinAt: 1,
                        id: '$_id'
                    }
                }
            ];
        } else {
            pipeline = [
                {
                    $match: { course_id: new mongoose.Types.ObjectId(course_id) } // Lọc theo course_id
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user_id',
                        foreignField: 'user_id',
                        as: 'user'
                    }
                },
                {
                    $lookup: {
                        from: 'courses',
                        localField: 'course_id',
                        foreignField: 'course_id',
                        as: 'course'
                    }
                },
                {
                    $unwind: '$user' // Giải nén mảng user
                },
                {
                    $project: {
                        'course.name': 1,
                        'user.code': 1,
                        'user.user_id': 1,
                        'user.full_name': 1,
                        progress: 1, // Lấy trường progress từ bảng student_course
                        joinAt: '$createdAt' // Thêm thời gian gia nhập
                    }
                },
                {
                    $group: {
                        _id: '$user.user_id', // Group theo user_id để tránh trùng lặp
                        user: { $first: '$user' },
                        progress: { $first: '$progress' }, // Lấy progress đầu tiên trong nhóm
                        joinAt: { $first: '$joinAt' },
                        id: { $first: '$_id' },
                        course: { $first: '$course' }
                    }
                },
                {
                    $project: {
                        'user.code': 1,
                        'user.user_id': 1,
                        'user.full_name': 1,
                        "user.code": 1,
                        progress: 1,
                        joinAt: 1,
                        id: 1,
                        'course.name': 1
                    }
                }
            ];
        }

        const listuser = await StudentCourse.aggregate(pipeline);

        const data = listuser.filter((item) => {
            console.log(`${item.teacher}`)
            return item.teacher == user_id;
        });
        return res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteStudentCourse = async (req, res) => {
    try {
        const id = req.body.id;
        if (!id) {
            return res.status(400).json({ message: 'id is required' });
        }
        const ress =await StudentCourse.findByIdAndDelete(id);
        if (!ress) {
            return res.status(400).json({ message: 'Student course not found' });
        }
        const course = await Course.findOne({ course_id:ress.course_id});
        const enroll = Number(course.enroll) - 1;
        await Course.updateOne({ course_id: ress.course_id }, { $set: { enroll: enroll } });
        if (!course) {
            return res.status(400).json({ message: 'Course not found' });
        }
        return res.status(200).json({ message: 'Student course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.updateProgress = async (req, res) => {
    try {
        const { course_id, lesson_id } = req.body;
        const user_id = req.user.user_id;

        console.log({ course_id, lesson_id, user_id });

        // Tìm StudentCourse theo course_id và user_id
        const student_course = await StudentCourse.findOne({ course_id, user_id });
        if (!student_course) {
            return res.status(400).json({ message: 'Student course not found' });
        }

        // Kiểm tra xem lesson_id đã có trong list_completed chưa
        if (student_course.list_completed.includes(lesson_id)) {
            return res.status(400).json({ message: 'Lesson already completed' });
        }

        // Lấy tất cả các Section của course_id
        const sections = await Section.find({ course_id });
        let countLesson = 0;

        // Đếm tổng số Lesson trong tất cả các Section
        await Promise.all(
            sections.map(async (section) => {
                const lessonCount = await Lesson.countDocuments({ section_id: section._id });
                console.log({ lessonCount });
                countLesson += lessonCount;
            })
        );

        console.log({ countLesson });

        // Tính toán progress
        const progress = Math.floor(((student_course.list_completed.length + 1) / countLesson) * 100);

        // Cập nhật progress và list_completed  
        student_course.progress = progress;
        student_course.list_completed.push(lesson_id);
        await student_course.save();
        return res.status(200).json({ message: 'Progress updated successfully', progress });
    } catch (error) {
        console.error('Error updating progress:', error); // Log lỗi chi tiết
        res.status(500).json({ message: error.message });
    }
};



exports.listUser = async (req, res) => {
    try {
        const user = req.user;
        // if( user.role === 2 ){
        //     const users = await User.find({
        //         user_id: user.user_id
        //     }, {
        //         email: 1,
        //         code: 1,
        //         user_id: 1
        //     });
        //   return  res.status(200).json(users);
        // }
        const users = await User.find({}, {
            email: 1,
            code: 1,
            user_id: 1
        });
        return res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


exports.rechargeAccount = async (req, res) => {
    try {
        const { coin } = req.body;
        if (coin < 0) {
            return res.status(400).json({ message: 'Coin must be greater than 0' });
        }

        const user = req.user;

        const purchase_history = new PurchaseHistory({ user_id: user.user_id, totalPrice: coin, status: 'pending', type: 'coin', type2: 'nap' });

        await purchase_history.save();
        // const a = await User.find({user_id:user.user_id})
        // await User.updateOne({
        //     user_id: user.user_id
        // }, {
        //     coin: a[0].coin + coin
        // })


        return res.status(200).json({ message: 'Coin added successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

exports.withdrawalAccount = async (req, res) => {
    try {
        const { coin } = req.body;
        console.log({ coin })
        if (coin < 0) {
            return res.status(400).json({ message: 'Coin must be greater than 0' });
        }
        const user = req.user;

        const purchase_history = new PurchaseHistory({ user_id: user.user_id, totalPrice: coin, status: 'pending', type: 'coin', type2: 'rut' });

        await purchase_history.save();
        // const a = await User.find({user_id:user.user_id})
        // await User.updateOne({
        //     user_id: user.user_id
        // }, {
        //     coin: a[0].coin + coin
        // })

        return res.status(200).json({ message: 'Coin added successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

exports.updateRechargeStatus = async (req, res) => {
    try {
        const { purchase_id, status } = req.body;
        console.log({ body: req.body })
        const purchase_history = await PurchaseHistory.findById(purchase_id);
        if (!purchase_history) {
            return res.status(400).json({ message: 'Purchase not found' });
        }
        if (purchase_history.status === 'completed') {

            return res.status(400).json({ message: 'Purchase already completed' });
        }
        if (purchase_history.status === 'cancelled') {
            return res.status(400).json({ message: 'Purchase already cancelled' });
        }
        purchase_history.status = status;
        await purchase_history.save();
        const a = await User.findOne({ user_id: purchase_history.user_id })
        let coin = purchase_history.type2 === 'nap' ? a.coin + purchase_history.totalPrice : a.coin - purchase_history.totalPrice
        console.log(a)
        await User.updateOne({
            user_id: purchase_history.user_id
        }, {
            coin: coin
        })

        if (status === 'completed') {
            return res.status(200).json({ message: 'completed' });
        } else if (status === 'cancelled') {
            return res.status(200).json({ message: 'cancelled' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


exports.listPurchaseHistory = async (req, res) => {
    try {
        const { type, status } = req.body
        const user_id = req.user.user_id;

        if (req.user.role === 1) {
            const purchase_history = await PurchaseHistory.find({ $or: [{ status }, { type }] }).sort({ purchaseDate: -1 }).populate({
                path: 'course_id',
                select: 'name',
                model: 'Course',
                localField: 'course_id',
                foreignField: 'course_id'
            }).populate({
                path: 'user_id',
                select: 'full_name',
                model: 'User',
                localField: 'user_id',
                foreignField: 'user_id'
            });
            const user = await User.findOne({ user_id: user_id })
            return res.status(200).json({ purchase_history, coin: user.coin });
        }

        const purchase_history = await PurchaseHistory.find({ user_id, type }).sort({ purchaseDate: -1 }).populate({
            path: 'course_id',
            select: 'name',
            model: 'Course',
            localField: 'course_id',
            foreignField: 'course_id'
        }).populate({
            path: 'user_id',
            select: 'full_name',
            model: 'User',
            localField: 'user_id',
            foreignField: 'user_id'
        });
        const user = await User.findOne({ user_id: user_id })
        return res.status(200).json({ purchase_history, coin: user.coin });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}







exports.Invoicing = async (req, res) => {
    try {
        const { purchasehistory_id } = req.body;
        const user_id = req.user.user_id;




        return res.status(200).json({ purchase_history });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}