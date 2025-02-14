const fs = require('fs');
const readline = require('readline');
const { exec } = require('child_process');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const crypto = require('crypto'); // Import crypto for generating JWT_SECRET
require('dotenv').config({ path: '../backend/.env' });

const { Sequelize } = require('sequelize'); // Import Sequelize
const { User, Project, Column, Task, UserProjects } = require('../backend/src/models'); // Import models

// Function to display ASCII header
const displayHeader = (title) => {
  console.log(`
  ============================================
  ${title}
  ============================================
  `);
};

// Function to display the app logo
const displayLogo = () => {
  const logoPath = './logo.ascii';
  if (fs.existsSync(logoPath)) {
    const logo = fs.readFileSync(logoPath, 'utf-8');
    console.log(logo);
  }
};

// Function to check if MariaDB is installed
const checkMariaDB = () => {
  return new Promise((resolve, reject) => {
    exec('mariadb --version', (error, stdout, stderr) => {
      if (error) {
        reject('MariaDB is not installed.');
      } else {
        resolve('MariaDB is installed.');
      }
    });
  });
};

// Function to read .env file and return values
const readEnvFile = () => {
  const envPath = '../backend/.env';
  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, ''); // Create the .env file if it doesn't exist
    return false;
  }
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const envLines = envContent.split('\n');
  const envValues = envLines.reduce((acc, line) => {
    const [key, value] = line.split('=');
    if (key && value) {
      acc[key.trim()] = value.trim();
    }
    return acc;
  }, {});
  return [
    envValues.DB_HOST,
    envValues.DB_USER,
    envValues.DB_PASSWORD,
    envValues.DB_NAME
  ];
};

// Function to prompt user for .env file info
const promptEnvInfo = () => {
  displayHeader('ENVIRONMENT CONFIGURATION');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const questions = [
    'Enter DB_HOST: ',
    'Enter DB_USER: ',
    'Enter DB_PASSWORD: ',
    'Enter DB_NAME: '
  ];

  let answers = [];

  const askQuestion = (index) => {
    if (index === questions.length) {
      rl.close();
      return answers;
    }
    rl.question(questions[index], (answer) => {
      answers.push(answer);
      askQuestion(index + 1);
    });
  };

  return new Promise((resolve) => {
    rl.on('close', () => {
      resolve(answers);
    });
    askQuestion(0);
  });
};

// Function to finalize .env file
const finalizeEnvFile = () => {
  const envPath = '../backend/.env';
  const envContent = fs.readFileSync(envPath, 'utf-8');
  fs.writeFileSync(envPath, `${envContent}#valid\n`);
  console.log('Environment file finalized.');
};

// Function to test DB connection
const testDBConnection = async () => {
  displayHeader('TESTING DATABASE CONNECTION');
  try {
    let [dbHost, dbUser, dbPassword, dbName] = readEnvFile();
    const sequelizeVerify = new Sequelize(dbName, dbUser, dbPassword, {
      host: dbHost,
      dialect: 'mariadb',
      logging: false // Mute console output
    });
    await sequelizeVerify.authenticate();
    console.log('Connected to the database successfully.');
  } catch (error) {
    if (error instanceof Sequelize.AccessDeniedError) {
      console.error('Access denied for user. Deleting .env file and restarting setup.');
      fs.unlinkSync('../backend/.env'); // Delete the .env file
    } else {
      console.error('Failed to connect to the database:', error);
    }
    throw error; // Re-throw the error to handle it in the main function
  }
};

// Function to check if .env file is valid
const isEnvFileValid = () => {
  const envPath = '../backend/.env';
  if (!fs.existsSync(envPath)) {
    return false;
  }
  const envContent = fs.readFileSync(envPath, 'utf-8');
  return envContent.includes('#valid');
};

// Function to prompt user for admin credentials and DB host
const promptAdminCredentials = () => {
  displayHeader('EXISTING DB ADMIN CREDENTIALS');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const questions = [
    'Enter DB Admin Username: ',
    'Enter DB Admin Password: ',
    'Enter DB Host (default: localhost): '
  ];

  let answers = [];

  const askQuestion = (index) => {
    if (index === questions.length) {
      rl.close();
      return answers;
    }
    if (index === 1) {
      // Mask the password input
      rl.stdoutMuted = true;
      rl.question(questions[index], (answer) => {
        rl.stdoutMuted = false;
        console.log('\n'); // Move to the next line after password input
        answers.push(answer);
        askQuestion(index + 1);
      });
    } else {
      rl.question(questions[index], (answer) => {
        answers.push(answer || (index === 2 ? 'localhost' : ''));
        askQuestion(index + 1);
      });
    }
  };

  rl._writeToOutput = function _writeToOutput(stringToWrite) {
    if (rl.stdoutMuted) {
      rl.output.write('\x1B[2K\x1B[200D' + questions[1] + '*'.repeat(rl.line.length));
    } else {
      rl.output.write(stringToWrite);
    }
  };

  return new Promise((resolve) => {
    rl.on('close', () => {
      resolve(answers);
    });
    askQuestion(0);
  });
};

// Function to validate password strength
const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasNonalphas = /\W/.test(password);
  return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasNonalphas;
};

// Function to prompt user for app DB info with password validation
const promptAppDBInfo = () => {
  displayHeader('APP DATABASE CONFIGURATION');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const questions = [
    'Enter App DB Name (default: reset_app): ',
    'Enter App DB Username (default: reset_user): ',
    'Enter App DB Password: '
  ];

  let answers = [];

  const askQuestion = (index) => {
    if (index === questions.length) {
      rl.close();
      return answers;
    }
    rl.question(questions[index], (answer) => {
      if (index === 2 && !validatePassword(answer)) {
        console.log('Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.');
        askQuestion(index);
      } else if (index === 0) {
        answers.push(answer || 'reset_app');
        askQuestion(index + 1);
      } else {
        answers.push(answer || 'reset_user');
        askQuestion(index + 1);
      }
    });
  };

  return new Promise((resolve) => {
    rl.on('close', () => {
      resolve(answers);
    });
    askQuestion(0);
  });
};

// Function to prompt user for IP if DB host is not localhost
const promptUserIP = () => {
  displayHeader('WEB APP IP CONFIGURATION');
  console.log('You entered something other than localhost for the DB_HOST.\nPlease enter the IP address of the machine the app is hosted on.');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('Enter IP address: ', (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};

// Function to prompt user for admin details
const promptAdminDetails = () => {
  displayHeader('APP ADMIN LOGIN DETAILS');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const questions = [
    'Enter Reset App Admin First Name: ',
    'Enter Reset App Admin Last Name: ',
    'Enter Reset App Admin Username: ',
    'Enter Reset App Admin Password: '
  ];

  let answers = [];

  const askQuestion = (index) => {
    if (index === questions.length) {
      rl.close();
      return answers;
    }
    if (index === 2) {
      const defaultUsername = `${answers[0].toLowerCase()}${answers[1].charAt(0).toLowerCase()}`;
      rl.question(`${questions[index]} (default: ${defaultUsername}): `, (answer) => {
        answers.push(answer || defaultUsername);
        askQuestion(index + 1);
      });
    } else {
      rl.question(questions[index], (answer) => {
        answers.push(answer);
        askQuestion(index + 1);
      });
    }
  };

  return new Promise((resolve) => {
    rl.on('close', () => {
      resolve(answers);
    });
    askQuestion(0);
  });
};

// Function to create necessary tables for the app
const createAppTables = async (sequelizeApp) => {
  displayHeader('CREATING APP TABLES');
  try {
    // Register models with the new Sequelize instance
    Project.init(Project.getAttributes(), { sequelize: sequelizeApp });
    User.init(User.getAttributes(), { sequelize: sequelizeApp });
    Column.init(Column.getAttributes(), { sequelize: sequelizeApp });
    Task.init(Task.getAttributes(), { sequelize: sequelizeApp });
    await UserProjects.init(UserProjects.getAttributes(), { sequelize: sequelizeApp });


    // Sync all models that are not already in the database
    await sequelizeApp.sync();
    console.log('App tables created successfully.');

    // Prompt for admin details
    console.log('Please enter the details for the Reset App admin user:');
    const [firstName, lastName, username, password] = await promptAdminDetails();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new admin user into the User table
    await User.create({
      firstName,
      lastName,
      username,
      password: hashedPassword,
      permissionLevel: 'admin'
    });

    console.log('Admin user created successfully.');
    // Insert default project
    await Project.create({ name: 'Default Project', description: 'This is the default project.' });

    // Create default columns
    const defaultColumns = [
      { title: 'To Do', description: 'Tasks yet to be started.', position: 1, projectId: 1 },
      { title: 'In Progress', description: 'Tasks currently being worked on.', position: 2, projectId: 1 },
      { title: 'Review', description: 'Tasks awaiting review and approval.', position: 3, projectId: 1 },
      { title: 'Done', description: 'Completed Tasks.', position: 4, projectId: 1 }
    ];

    for (const column of defaultColumns) {
      await Column.create(column);
    }

    // create the link between the admin user and the default project
    const adminUser = await User.findOne({ where: { username } });
    const defaultProject = await Project.findOne({ where: { name: 'Default Project' }});
    await adminUser.addProject(defaultProject);

    console.log('Default columns created successfully.');
  } catch (error) {
    console.error('Failed to create app tables, admin user, or default columns:', error);
  }
};

// Function to create database and user
const setupDatabase = async (adminUsername, adminPassword, dbHost, appDBName, appDBUsername, appDBPassword) => {
  displayHeader('SETTING UP DATABASE AND USER');
  const sequelizeAdmin = new Sequelize('mysql', adminUsername, adminPassword, {
    host: dbHost,
    dialect: 'mariadb',
    logging: false // Mute console output
  });

  try {
    await sequelizeAdmin.authenticate();
    console.log('Admin connected to the database successfully.');

    await sequelizeAdmin.query(`CREATE DATABASE IF NOT EXISTS ${appDBName};`);

    let userHost = 'localhost';
    if (dbHost !== 'localhost') {
      userHost = await promptUserIP();
    }

    await sequelizeAdmin.query(`CREATE USER IF NOT EXISTS '${appDBUsername}'@'${userHost}' IDENTIFIED BY '${appDBPassword}';`);
    await sequelizeAdmin.query(`GRANT ALL PRIVILEGES ON ${appDBName}.* TO '${appDBUsername}'@'${userHost}';`);
    await sequelizeAdmin.query('FLUSH PRIVILEGES;');

    console.log('Database and user setup completed successfully.');

    // Reinitialize Sequelize with the new app credentials
    const sequelizeApp = new Sequelize(appDBName, appDBUsername, appDBPassword, {
      host: dbHost,
      dialect: 'mariadb',
      logging: false // Mute console output
    });

    await createAppTables(sequelizeApp);
  } catch (error) {
    console.error('Failed to set up the database and user:', error);
  } finally {
    await sequelizeAdmin.close();
  }
};

const runNpmInstall = (directory) => {
  return new Promise((resolve, reject) => {
    exec(`npm install`, { cwd: directory }, (error, stdout, stderr) => {
      if (error) {
        reject(`Failed to run npm install in ${directory}: ${stderr}`);
      } else {
        resolve(`npm install completed in ${directory}`);
      }
    });
  });
};

// Main function
const main = async () => {
  displayLogo(); // Display the app logo
  displayHeader('INITIALIZING RESET APP');
  const envPath = '../backend/.env';
  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, ''); // Create the .env file if it doesn't exist
  }

  try {
    if (isEnvFileValid()) {
      console.log('.env file is valid.');
      await testDBConnection();
      return;
    }
  } catch (error) {
    console.log('Invalid .env file. Restarting setup.');
  }

  const [adminUsername, adminPassword, dbHost] = await promptAdminCredentials();

  const sequelizeAdmin = new Sequelize('mysql', adminUsername, adminPassword, {
    host: dbHost,
    dialect: 'mariadb',
    logging: false // Mute console output
  });

  try {
    await sequelizeAdmin.authenticate();
    console.log('Admin connected to the database successfully.');

    const [appDBName, appDBUsername, appDBPassword] = await promptAppDBInfo();
    await setupDatabase(adminUsername, adminPassword, dbHost, appDBName, appDBUsername, appDBPassword);

    const jwtSecret = crypto.randomBytes(64).toString('hex'); // Generate JWT_SECRET

    const envContent = `DB_HOST=${dbHost}\nDB_USER=${appDBUsername}\nDB_PASSWORD=${appDBPassword}\nDB_NAME=${appDBName}\nJWT_SECRET=${jwtSecret}\n`;
    fs.writeFileSync(envPath, envContent);

    // Reinitialize Sequelize with the new app credentials
    const sequelizeApp = new Sequelize(appDBName, appDBUsername, appDBPassword, {
      host: dbHost,
      dialect: 'mariadb',
      logging: false // Mute console output
    });

    try {
      await sequelizeApp.authenticate();
      console.log('App connected to the database successfully.');
      finalizeEnvFile(); // Add #valid to .env file

    } catch (error) {
      console.error('Failed to connect to the database with app credentials:', error);
    }
  } catch (error) {
    console.error('Failed to connect to the database:', error);
  } finally {
    await sequelizeAdmin.close();
  }

  try {
      displayHeader('INSTALLING DEPENDENCIES');
      // Run npm install in frontend and backend directories
      await runNpmInstall('../frontend');
      console.log('npm install completed in frontend directory.');
      await runNpmInstall('../backend');
      console.log('npm install completed in backend directory.');
  } catch (error) {
      console.error('Failed to run npm install:', error);
  }

  displayHeader('INITIALIZATION COMPLETE');
  console.log('Reset App has been initialized successfully.\nPlease run the dev app using the following command from the root directory:\n\n  npm run dev\n');

};

main();