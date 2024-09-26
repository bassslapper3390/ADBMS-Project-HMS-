const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 5500;
app.use(express.static('./public'));
// MySQL connection successfully addes 

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Replace with your MySQL password
  database: 'ADBMS_proj'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ', err);
    return;
  }
  console.log('Connected to the database!');
});
//console.log("Status of connection"+connection);
// Create tables
// Create Doctor table

connection.query(`
  CREATE TABLE IF NOT EXISTS Doctor (
    DoctorID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(50),
    Speciality VARCHAR(50)
  )
`, (err, result) => {
  if (err) throw err;
  console.log('Doctor table created or already exists');
});

// Create Patient table
/*
connection.query(`
  CREATE TABLE IF NOT EXISTS Patient (
    PatientID INT PRIMARY KEY,
    Name VARCHAR(50),
    Contact VARCHAR(50)
  )
`, (err, result) => {
  if (err) throw err;
  console.log('Patient table created or already exists');

  // Set the initial value for PatientID
 

  connection.query('ALTER TABLE Patient AUTO_INCREMENT = 1', (err, result) => {
    if (err) throw err;
    console.log('Initial value set for PatientID');
  });
});
*/
connection.query(`
  CREATE TABLE IF NOT EXISTS Patient (
    PatientID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(50),
    Contact VARCHAR(50)
  )
`, (err, result) => {
  if (err) throw err;
  console.log('Patient table created or already exists');
});

 
// Create Appointment table

connection.query(`
  CREATE TABLE IF NOT EXISTS Appointment (
    AppointmentID INT PRIMARY KEY AUTO_INCREMENT,
    Date DATE,
    Time TIME,
    DoctorID INT,
    PatientID INT,
    FOREIGN KEY (DoctorID) REFERENCES Doctor(DoctorID),
    FOREIGN KEY (PatientID) REFERENCES Patient(PatientID)
  )
`, (err, result) => {
  if (err) throw err;
  console.log('Appointment table created or already exists');
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
  res.render('index', { menus: [] });
});

app.get('/menu1', (req, res) => {
  connection.query('SELECT * FROM Patient', (err, results) => {
    if (err) throw err;
    res.render('menu1', { patients: results });
  });
});

app.post('/menu1/insert', (req, res) => {
  console.log("ok")
  const { name, contact } = req.body;
  connection.query('INSERT INTO Patient (Name, Contact) VALUES (?, ?)', [name, contact], (err, result) => {
    if (err) throw err;
    res.redirect('/menu1');
  });
});

app.post('/menu1/update', (req, res) => {
  const { patientID, name, contact } = req.body;
  connection.query('UPDATE Patient SET Name = ?, Contact = ? WHERE PatientID = ?', [name, contact, patientID], (err, result) => {
    if (err) throw err;
    res.redirect('/menu1');
  });
});



app.get('/menu2', (req, res) => {
  connection.query('SELECT * FROM Doctor', (err, results) => {
    if (err) throw err;
    res.render('menu2', { doctors: results });
  });
});

app.post('/menu2/insert', (req, res) => {
  const { name, speciality } = req.body;
  connection.query('INSERT INTO Doctor (Name, Speciality) VALUES (?, ?)', [name, speciality], (err, result) => {
    if (err) throw err;
    res.redirect('/menu2');
  });
});

app.post('/menu2/update', (req, res) => {
  const { doctorID, name, speciality } = req.body;
  connection.query('UPDATE Doctor SET Name = ?, Speciality = ? WHERE DoctorID = ?', [name, speciality, doctorID], (err, result) => {
    if (err) throw err;
    res.redirect('/menu2');
  });
});


app.get('/menu3', (req, res) => {
  connection.query('SELECT * FROM Appointment', (err, results) => {
    if (err) throw err;
    res.render('menu3', { appointments: results });
  });
});

app.post('/menu3/insert', (req, res) => {
  const { doctorID, patientID, date, time } = req.body;
  connection.query('INSERT INTO Appointment (DoctorID, PatientID, Date, Time) VALUES (?, ?, ?, ?)', [doctorID, patientID, date, time], (err, result) => {
    if (err) throw err;
    res.redirect('/menu3');
  });
});

app.post('/menu3/update', (req, res) => {
  const { appointmentID, doctorID, patientID, date, time } = req.body;
  connection.query('UPDATE Appointment SET DoctorID = ?, PatientID = ?, Date = ?, Time = ? WHERE AppointmentID = ?', [doctorID, patientID, date, time, appointmentID], (err, result) => {
    if (err) throw err;
    res.redirect('/menu3');
  });
});

app.post('/menu1/delete', (req, res) => {
  const { patientID } = req.body;
  connection.query('DELETE FROM Patient WHERE PatientID = ?', [patientID], (err, result) => {
    if (err) throw err;
    res.redirect('/menu1');
  });
});

app.post('/menu2/delete', (req, res) => {
  const { doctorID } = req.body;
  connection.query('DELETE FROM Doctor WHERE DoctorID = ?', [doctorID], (err, result) => {
    if (err) throw err;
    res.redirect('/menu2');
  });
});

app.post('/menu3/delete', (req, res) => {
  const { appointmentID } = req.body;
  connection.query('DELETE FROM Appointment WHERE AppointmentID = ?', [appointmentID], (err, result) => {
    if (err) throw err;
    res.redirect('/menu3');
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});