const FilterGroup = require('../models/FilterGroup');

exports.createFilterGroup = async (req, res) => {
  try {
    const { subcategory, filters } = req.body;

    if (!subcategory || !Array.isArray(filters)) {
      return res.status(400).json({ error: 'Invalid data format' });
    }

    const savedFilterGroups = await Promise.all(
      filters.map(async (group) => {
        const { groupName, checkboxes } = group;

        if (!groupName || !Array.isArray(checkboxes)) {
          throw new Error('Invalid group format');
        }

        const newFilterGroup = new FilterGroup({
          subcategory,
          groupName,
          checkboxes
        });

        return await newFilterGroup.save();
      })
    );

    res.status(201).json({ message: 'Filter groups created successfully', data: savedFilterGroups });
  } catch (error) {
    console.error('Error creating filter groups:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getFilterGroupsBySubcategory = async (req, res) => {
  try {
    const { subcategoryId } = req.params;
    const filterGroups = await FilterGroup.find({ subcategory: subcategoryId });
    res.status(200).json(filterGroups);
  } catch (error) {
    console.error('Error fetching filter groups:', error);
    res.status(500).json({ error: 'Error fetching filter groups' });
  }
};

exports.deleteCheckbox = async (req, res) => {
  try {
    const { groupId, checkboxIndex } = req.params;
    const filterGroup = await FilterGroup.findById(groupId);

    if (!filterGroup) {
      return res.status(404).json({ error: 'Filter group not found' });
    }

    filterGroup.checkboxes.splice(Number(checkboxIndex), 1);
    await filterGroup.save();

    res.status(200).json({ message: 'Checkbox deleted successfully' });
  } catch (error) {
    console.error('Error deleting checkbox:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.addCheckboxToGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { checkboxes } = req.body;

    if (!Array.isArray(checkboxes)) {
      return res.status(400).json({ error: 'Checkboxes must be an array' });
    }

    const filterGroup = await FilterGroup.findById(groupId);

    if (!filterGroup) {
      return res.status(404).json({ error: 'Filter group not found' });
    }

    filterGroup.checkboxes.push(...checkboxes);
    await filterGroup.save();

    res.status(200).json({ message: 'Checkboxes added successfully', data: filterGroup });
  } catch (error) {
    console.error('Error adding checkboxes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteFilterGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const filterGroup = await FilterGroup.findById(groupId);

    if (!filterGroup) {
      return res.status(404).json({ error: 'Filter group not found' });
    }

    await filterGroup.deleteOne();

    res.status(200).json({ message: 'Filter group deleted successfully' });
  } catch (error) {
    console.error('Error deleting filter group:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};