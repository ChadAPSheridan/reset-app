const Project = require('../models/Project');
const User = require('../models/User');
const UserProjects = require('../models/UserProjects');
const Column = require('../models/Column'); // Import Column model

const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    await UserProjects.create({ UserId: project.owner, ProjectId: project.id }); // Add owner to UserProjects

    // Create default columns
    const defaultColumns = [
      { title: 'To Do', description: 'Tasks yet to be started.', position: 1, ProjectId: project.id },
      { title: 'In Progress', description: 'Tasks currently being worked on.', position: 2, ProjectId: project.id },
      { title: 'Review', description: 'Tasks awaiting review and approval.', position: 3, ProjectId: project.id },
      { title: 'Done', description: 'Completed Tasks.', position: 4, ProjectId: project.id }
    ];
    for (const column of defaultColumns) {
      await Column.create(column);
    }
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    let projects;
    if (user.permissionLevel === 'admin') {
      projects = await Project.findAll();
    } else {
      projects = await Project.findAll({
        include: [{
          model: UserProjects,
          where: { UserId: userId },
        }],
      });
    }

    console.log('Projects:', projects);
    res.status(200).json(projects);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getProject = async (req, res) => {
  try {
    const ProjectId = req.params.id;
    const users = await UserProjects.findAll({ where: { ProjectId } });
    res.status(200).json(users);
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

const updateProjectUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const { userIds } = req.body;

    console.log('Updating project users for project ID:', id); // Debugging output
    console.log('New user IDs:', userIds); // Debugging output

    const project = await Project.findByPk(id);
    if (!project) {
      console.error('Project not found for ID:', id); // Debugging output
      return res.status(404).json({ error: 'Project not found' });
    }

    // Remove existing associations
    await UserProjects.destroy({ where: { ProjectId: id } });
    console.log('Existing user associations removed for project ID:', id); // Debugging output

    // Add new associations
    const userProjects = userIds.map(userId => ({ UserId: userId, ProjectId: id }));
    await UserProjects.bulkCreate(userProjects);
    console.log('New user associations added for project ID:', id); // Debugging output

    res.status(200).json({ message: 'Project users updated successfully' });
  } catch (error) {
    console.error('Failed to update project users:', error); // Debugging output
    res.status(500).json({ error: 'Failed to update project users' });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  updateProjectUsers,
};