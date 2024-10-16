const CardlineProduct = require('../models/CardlineProduct');

exports.createCardlineProduct = async (req, res) => {
    try {
        const { title, page } = req.body;
        const image = req.file.filename;

        const newCard = new CardlineProduct({
            title,
            image,
            page
        });

        await newCard.save();
        res.status(201).json({ message: 'Cardline product created successfully', card: newCard });
    } catch (error) {
        res.status(500).json({ message: 'Error creating cardline product', error });
    }
};

exports.getCardlineProducts = async (req, res) => {
    try {
        console.log('Fetching cardline products...');
        const cards = await CardlineProduct.find().populate('page');
        console.log('Cards fetched:', cards);
        res.status(200).json(cards);
    } catch (error) {
        console.error('Error fetching cardline products:', error);
        res.status(500).json({ message: 'Error fetching cardline products', error });
    }
};

exports.updateCardlineProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, page } = req.body;
      const updateFields = { title, page };
  
      if (req.file) {
        updateFields.image = req.file.filename;
      }
  
      const updatedCard = await CardlineProduct.findByIdAndUpdate(id, updateFields, { new: true });
      res.status(200).json({ message: 'Cardline product updated successfully', card: updatedCard });
    } catch (error) {
      res.status(500).json({ message: 'Error updating cardline product', error });
    }
};
  
exports.deleteCardlineProduct = async (req, res) => {
    try {
      const { id } = req.params;
      await CardlineProduct.findByIdAndDelete(id);
      res.status(200).json({ message: 'Cardline product deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting cardline product', error });
    }
};