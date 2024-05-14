import bcrypt from 'bcrypt';
import express from "express";
import jwt from "jsonwebtoken";
import { MongoClient } from "mongodb";

const router = express.Router();
const mongoURI = "mongodb://localhost:27017";
const dbName = "yourDatabaseName";
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to MongoDB
client.connect(err => {
  if (err) {
    console.error("Error connecting to MongoDB:", err);
    return;
  }
  console.log("Connected to MongoDB");

  const db = client.db(dbName);

  // Admin Login
  router.post("/adminlogin", async (req, res) => {
    const collection = db.collection("admin");
    try {
      const admin = await collection.findOne({ email: req.body.email });
      if (admin && bcrypt.compareSync(req.body.password, admin.password)) {
        const token = jwt.sign(
          { role: "admin", email: admin.email, id: admin._id },
          "jwt_secret_key",
          { expiresIn: "1d" }
        );
        res.cookie('token', token);
        return res.json({ loginStatus: true });
      } else {
        return res.json({ loginStatus: false, Error: "Wrong email or password" });
      }
    } catch (err) {
      console.error("Error during admin login:", err);
      return res.json({ loginStatus: false, Error: "Internal server error" });
    }
  });

  // Department Routes
  router.get('/department', async (req, res) => {
    const collection = db.collection("department");
    try {
      const departments = await collection.find().toArray();
      return res.json({ Status: true, Result: departments });
    } catch (err) {
      console.error("Error fetching departments:", err);
      return res.json({ Status: false, Error: "Internal server error" });
    }
  });

  router.post('/add_department', async (req, res) => {
    const collection = db.collection("department");
    try {
      await collection.insertOne({ name: req.body.department });
      return res.json({ Status: true });
    } catch (err) {
      console.error("Error adding department:", err);
      return res.json({ Status: false, Error: "Internal server error" });
    }
  });

  const departmentSchema = new mongoose.Schema({
    name: String
});
const Department = mongoose.model('Department', departmentSchema);

// Middleware
app.use(bodyParser.json());

// Routes
app.post('/api/add_department', async (req, res) => {
    try {
        const department = new Department({ name: req.body.department });
        await department.save();
        res.json({ Status: true });
    } catch (error) {
        res.status(500).json({ Status: false, Error: error.message });
    }
});

});

export { router as adminRouter };

