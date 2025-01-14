
const Lession = require('../models/lessons');


exports.createLession = async (req, res) => {
    try {
        
        const newLession = new Lession(req.body);
        await newLession.save();
        res.status(201).json(newLession);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getLessions = async (req, res) => {
    try {
        const lessions = await Lession.find();
        res.status(200).json(lessions);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getLessionById = async (req, res) => {
    try {
        const lession = await Lession.findById(req.params.id);
        if (!lession) {
            return res.status(404).json({ message: 'Lession not found' });
        }
        res.status(200).json(lession);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.updateLession = async (req, res) => {
    try {
        const lession = await Lession.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!lession) {
            return res.status(404).json({ message: 'Lession not found' });
        }
        res.status(200).json(lession);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.deleteLession = async (req, res) => {
    try {
        const lession = await Lession.findByIdAndDelete(req.params.id);
        if (!lession) {
            return res.status(404).json({ message: 'Lession not found' });
        }
        res.status(200).json({ message: 'Lession deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}