const cart = require("../models/Cart/cart");
const CartDetail = require("../models/Cart/cartDetail");
const Section = require("../models/sections");
const StudentCourse = require("../models/student_course");


async function checkCartExist(user_id) {
    const userCart = await cart.findOne({ user_id: user_id });
    if (!userCart) {
        const newCart = new cart({ user_id: user_id, items: [] });
        await newCart.save();
        return true;
    }
    return true;

}

exports.getCart = async (req, res) => {
    try {
        const user = req.user.user_id
        const check = await checkCartExist(user);
        if (!check) {
            const userCart = await cart.findOne({ user_id: req.user.user_id }).populate('items')
            .populate({
                path: `items`,
                model: `CartDetail`,
                localField: `items`,
                foreignField: `_id`,
                select: {
                    course_id: 1,
                    price: 1,
                    _id: 1
                },
                populate: {
                    path:'course_id',
                    model:'Course',
                    localField:'course_id',
                    foreignField:'course_id',
                   
                }
            })
                ;
            return res.status(200).json(userCart);
        }
        const userCart = await cart.findOne({ user_id: user })
            .populate({
                path: `items`,
                model: `CartDetail`,
                localField: `items`,
                foreignField: `_id`,
                select: {
                    course_id: 1,
                    price: 1,
                    _id: 1
                },
                populate: {
                    path:'course_id',
                    model:'Course',
                    localField:'course_id',
                    foreignField:'course_id',
                   
                }
            })
        return res.status(200).json(userCart);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


exports.addToCart = async (req, res) => {
    try {
        const { course_id, price } = req.body;

        // Find or create the user's cart
        let userCart = await cart.findOne({ user_id: req.user.user_id });
        if (!userCart) {
            userCart = new cart({ user_id: req.user.user_id, items: [], totalPrice: 0 });
        }

        // Check if the course already exists in the cart
        const existingItem = await CartDetail.findOne({
            _id: { $in: userCart.items },
            course_id: course_id
        });

        if (existingItem) {
            return res.status(400).json({ message: 'Course already in cart' });
        }
        const existInStudentCourse = await StudentCourse.findOne({course_id:course_id,user_id:req.user.user_id});
        if(existInStudentCourse){
            return res.status(400).json({ message: 'Course already in your course' });
        }

        // Create a new CartDetail item
        const detail = new CartDetail({ course_id, price: Number(price) });
        await detail.save();

        // Add the detail to the cart
        userCart.items.push(detail._id);
        userCart.totalPrice += Number(price);

        // Save the updated cart
        await userCart.save();

        return res.status(200).json(userCart);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { cartDetail_id } = req.body;
        console.log(cartDetail_id)
        const userCart = await cart.findOne({ user_id: req.user.user_id });
        // ...remove detail from items...
        userCart.items.pull(cartDetail_id);
        // ...recalculate total price...
        const cartDetai = await CartDetail.findOne({_id:cartDetail_id});
        userCart.totalPrice -= cartDetai.price;
        await userCart.save();
        await CartDetail.findByIdAndDelete(cartDetail_id);
        
        return res.json(userCart);
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: err.message });
    }
};