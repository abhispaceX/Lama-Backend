const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  
});

const db = mongoose.connection;
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Existing Project schema and model
const projectSchema = new mongoose.Schema({
    name: String,
    link: String,
    status: String,
    dateTime: String,
});

const Project = mongoose.model('Project', projectSchema);

// New Projects schema and model
const newProjectSchema = new mongoose.Schema({
    name: String,
    episodes: Number,
    lastEdited: String,
    color: String,
});

const NewProject = mongoose.model('NewProject', newProjectSchema);

// Middleware to log requests
app.use((req, res, next) => {
    next();
});

// CRUD API endpoints for existing projects
app.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

app.post('/projects', async (req, res) => {
    const project = new Project({
        name: req.body.name,
        link: req.body.link,
        status: req.body.status,
        dateTime: req.body.dateTime,
    });

    try {
        const newProject = await project.save();
        res.status(201).json(newProject);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

app.delete('/projects/:id', async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Project deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

// CRUD API endpoints for new projects
app.get('/newprojects', async (req, res) => {
    try {
        const projects = await NewProject.find();
        res.json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

app.post('/newprojects', async (req, res) => {
    const newProject = new NewProject({
        name: req.body.name,
        episodes: req.body.episodes,
        lastEdited: req.body.lastEdited,
        color: req.body.color,
    });

    try {
        const createdProject = await newProject.save();
        res.status(201).json(createdProject);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

app.delete('/newprojects/:id', async (req, res) => {
    try {
        await NewProject.findByIdAndDelete(req.params.id);
        res.json({ message: 'Project deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
