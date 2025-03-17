const express = require('express');
const projectController = require('../controllers/projectController');
const { authenticate, checkProjectAccess } = require('../middleware/auth');
const checkAdmin = require('../middleware/checkAdmin');

const router = express.Router();

// Get all projects
router.get('/', authenticate, (req, res, next) => {
  console.log('Get all projects route called');
  next();
}, projectController.getProjects);

// Create a new project
router.post('/', authenticate, checkAdmin, (req, res, next) => {
  console.log('Create project route called with body:', req.body);
  next();
}, projectController.createProject);

// Delete a project
router.delete('/:id', authenticate, checkAdmin, (req, res, next) => {
  console.log('Delete project route called with id:', req.params.id);
  next();
}, projectController.deleteProject);

// Update project users
router.put('/:id/users', authenticate, checkAdmin, (req, res, next) => {
  console.log('Update project users route called with id:', req.params.id, 'and body:', req.body);
  next();
}, projectController.updateProjectUsers);


// Get a single project
router.get('/one/:id', authenticate, checkAdmin, (req, res, next) => {
  console.log('Get project route called with id:', req.params.id);
  next();
}, projectController.getProject);

// Update a project
router.put('/:id', authenticate, checkProjectAccess, (req, res, next) => {
  console.log('Update project route called with id:', req.params.id, 'and body:', req.body);
  next();
}, projectController.updateProject);

module.exports = router;