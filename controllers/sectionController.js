
const Section = require('../models/sections');
const Lesson = require('../models/lessons');

exports.createSections = async (req, res) => {
    try {
        const section = new Section(req.body);
        await section.save();
        res.status(201).json({ message: 'Section created successfully', section });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getSections = async (req, res) => {
    try {
        const sections = await Section.find();
        res.status(200).json(sections);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getSectionById = async (req, res) => {
    try {
        // const section = await Section.findOne({section_id:req.body.section_id});
        // if (!section) {
        //     return res.status(404).json({ message: 'Section not found' });
        // }
        // const lessons = await Lesson.find({ section_id: section.section_id });
        const section = await Section.aggregate([
            { $match: { _id: req.body.section_id } },
            {
                $lookup: {
                    from: 'lessons',
                    localField: '_id',
                    foreignField: 'section_id',
                    as: 'lessons'
                }
            }       
        ])
        res.status(200).json({ section });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteSection = async (req, res) => {
    try {
        const section = await Section.findByIdAndDelete(req.body.sectionId);
        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }
        res.status(200).json({ message: 'Section deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateSection = async (req, res) => {
    try {
        const section = await Section.findByIdAndUpdate(req.body.sectionId, req.body, { new: true });
        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }
        res.status(200).json({ message: 'Section updated successfully', section });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};