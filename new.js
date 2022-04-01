let express = require("express");
let app = express();
let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
let port = process.env.port || 3000;
let router = express.Router();
app.use("/api/student", router);

app.listen(port, () => {
	console.log(`Node.js application running on port : ${port}`);
});

let students = [
	{
		StudentId: 1,
		FirstName: "Jalpesh",
		LastName: "Vadgama",
		Gender: "Male",
	},
	{
		StudentId: 2,
		FirstName: "Vishal",
		LastName: "Vadgama",
		Gender: "Male",
	},
];

//Get all students
router.get("/", (req, res) => {
	res.json(students);
});

//Get students based on id
router.get("/:Id", (req, res) => {
	let id = parseInt(req.params.Id);
	let currentStudent = students.filter((x) => x.StudentId == id)[0];
	if (currentStudent) {
		res.json(currentStudent);
	} else {
		res.sendStatus(404);
	}
});

ValidateStudent = (student) => {
	let message = "";
	if (!student.StudentId) {
		message = "Student id not found";
	}
	if (!student.FirstName) {
		message = "Student firstname not found";
	}

	if (!student.LastName) {
		message = "Student lastname not found";
	}

	if (!student.Gender) {
		message = "Student gender not found";
	}
	return message;
};

//Create student
router.post("/", (req, res) => {
	let student = req.body;
	let isValid = ValidateStudent(student);
	if (isValid == "") {
		students.push(student);
		console.log(students);
		res.status(201).send(students);
	} else {
		res.statusMessage = isValid;
		res.sendStatus(404);
	}
});

router.put("/:Id", (req, res) => {
	let studentId = req.params.Id;
	let student = req.body;
	let currentStudent = students.filter((x) => x.StudentId == studentId)[0];
	if (currentStudent) {
		let isValid = ValidateStudent(student);
		if (isValid == "") {
			currentStudent.FirstName = student.FirstName;
			currentStudent.LastName = student.LastName;
			currentStudent.Gender = student.Gender;
			res.status(200).send(students);
		} else {
			res.statusMessage = isValid;
			res.sendStatus(404);
		}
	} else {
		res.statusMessage = "Student does not exist";
		res.sendStatus(404);
	}
});

//Delete API

router.delete("/:Id", (req, res) => {
	let studentId = req.params.Id;
	let currentStudent = students.filter((x) => x.StudentId == studentId)[0];
	if (currentStudent) {
		students = students.filter((x) => x.StudentId !== studentId);
		console.log(students);
		res.statusMessage = "Student deleted sucessfully.";
		res.sendStatus(200);
	} else {
		res.statusMessage = "Student does not exist";
		res.sendStatus(404);
	}
});