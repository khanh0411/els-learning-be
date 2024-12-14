

const Category = require('../models/category');





exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        console.log(categories);

        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findOneAndDelete({category_id:req.body.category_id});
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findOneAndUpdate({category_id:req.body.category_id},{ $set: req.body }, { new: true });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category updated successfully', category });
    }catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.createCategory = async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(201).json({ message: 'Category created successfully', category });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
