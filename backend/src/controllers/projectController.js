const Project = require('../models/Project');
const User = require('../models/User');

const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.status(200).json(projects);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [User],
    });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    await project.update(req.body);
    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    await project.destroy();
    res.status(204).json();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const assignUserToProject = async (req, res) => {
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
};

const removeUserFromProject = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const project = await Project.findByPk(id);
    const user = await User.findByPk(userId);
    await project.removeUser(user);
    res.status(200).json({ message: 'User removed from project' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove user from project' });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  assignUserToProject,
  removeUserFromProject,
};