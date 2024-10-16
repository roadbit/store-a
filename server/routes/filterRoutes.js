const express = require('express');
const router = express.Router();
const { createFilterGroup, getFilterGroupsBySubcategory, deleteCheckbox, addCheckboxToGroup, deleteFilterGroup } = require('../controllers/filterController');
const FilterGroup = require('../models/FilterGroup');

router.post('/filters', createFilterGroup);
router.get('/filters/:subcategoryId', getFilterGroupsBySubcategory);
router.delete('/filters/:groupId/:checkboxIndex', deleteCheckbox);
router.put('/filters/:groupId', addCheckboxToGroup);
router.delete('/filters/:groupId', deleteFilterGroup);
router.get('/checkboxes/:groupId', async (req, res) => {
    try {
      const { groupId } = req.params;
      const filterGroup = await FilterGroup.findById(groupId);
      if (!filterGroup) {
        return res.status(404).json({ error: 'Filter group not found' });
      }
      res.status(200).json({ checkboxes: filterGroup.checkboxes });
    } catch (error) {
      console.error('Error fetching checkboxes:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

module.exports = router;