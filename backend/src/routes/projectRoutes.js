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

// Assign a user to a project
router.post('/:id/users', authenticate, checkAdmin, (req, res, next) => {
  console.log('Assign user to project route called with id:', req.params.id, 'and body:', req.body);
  next();
}, projectController.assignUserToProject);

// Remove a user from a project
router.delete('/:id/users/:userId', authenticate, checkAdmin, (req, res, next) => {
  console.log('Remove user from project route called with id:', req.params.id, 'and userId:', req.params.userId);
  next();
}, projectController.removeUserFromProject);

// Get a single project
router.get('/:id', authenticate, checkProjectAccess, (req, res, next) => {
  console.log('Get project route called with id:', req.params.id);
  next();
}, projectController.getProject);

// Update a project
router.put('/:id', authenticate, checkProjectAccess, (req, res, next) => {
  console.log('Update project route called with id:', req.params.id, 'and body:', req.body);
  next();
}, projectController.updateProject);

module.exports = router;