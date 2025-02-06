const express = require('express');
const Project = require('../models/Project');
const User = require('../models/User');
const checkAdmin = require('../middleware/checkAdmin');
const checkProjectAccess = require('../middleware/auth');
const projectController = require('../controllers/projectController');

const router = express.Router();

// Get all projects
router.get('/', async (req, res) => {
    try {
      const projects = await Project.findAll();
      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  });
// Create a new project
router.post('/', checkAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = await Project.create({ name, description });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Delete a project
router.delete('/:id', checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await Project.destroy({ where: { id } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Assign a user to a project
router.post('/:id/users', checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const project = await Project.findByPk(id);
    const user = await User.findByPk(userId);
    await project.addUser(user);
    res.status(200).json({ message: 'User assigned to project' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign user to project' });
  }
});

router.post('/projects', projectController.createProject);
router.get('/projects', projectController.getProjects);
router.get('/projects/:id', checkProjectAccess, projectController.getProject);
router.put('/projects/:id', checkProjectAccess, projectController.updateProject);
router.delete('/projects/:id', checkProjectAccess, projectController.deleteProject);

module.exports = router;