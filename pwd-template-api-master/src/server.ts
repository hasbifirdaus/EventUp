import express, {
  Application,
  Request,
  RequestHandler,
  Response,
} from "express";
import bodyParser from "body-parser";
import crypto from "crypto";

const port = 8000;
const app: Application = express();

app.use(express.json());

//setup body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//CRUD OPERATIONS
const users: Array<{ id: string; name: string }> = [];

//GET: all users
app.get("/users", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "User retrieved successfully",
    data: users,
  });
});

//GET:single user
//URL: /users/:id/:name -> /users/1/lollipop
//Params:id (string)
//Query : none -> /users/1?name=John
//Method: GET
//Description : Retrieve a user by id
app.get("/users/:id", (req: Request, res: Response) => {
  const userId = req.params.id;
  const user = users.find((user) => user.id === userId);

  //check if user exists
  if (!user) {
    res.status(404).json({
      success: false,
      message: "User not found",
      data: {},
    });
  }

  res.status(200).json({
    success: true,
    message: "User retrieved successfully",
    data: user,
  });
});

//POST:create a new user
app.post("/users", (req: Request, res: Response) => {
  console.log(req.body);

  users.push({
    id: crypto.randomUUID(),
    name: req.body.name,
  });

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: users[users.length - 1],
  });
});

//PUT/PATCH: update a user
app.patch("/users/:id", (req: Request, res: Response) => {
  const userId = req.params.id;
  const userIndex = users.findIndex((user) => user.id === userId);

  //Check if user exists
  if (userIndex === -1) {
    res.status(404).json({
      success: false,
      message: "User not found",
      data: {},
    });
  }

  //Update user
  if (!req.body.name || req.body.name === "") {
    res.status(400).json({
      success: false,
      message: "Name is required to update user",
      data: {},
    });
  }

  users[userIndex].name = req.body.name || users[userIndex].name;

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: users[userIndex],
  });
});

//DELETE: delete a user
app.delete("/user/:id", (req: Request, res: Response) => {
  const userId = req.params.id;
  const userIndex = users.findIndex((user) => user.id === userId);

  //Check if user exists
  if (userIndex === -1) {
    res.status(404).json({
      success: false,
      message: "User not found",
      data: {},
    });
  }

  //Remove user
  users.splice(userIndex, 1);
  res.status(200).json({
    success: true,
    message: "User deleted successfully",
    data: {},
  });
});

//running app
app.listen(port, () => {
  console.log(`[🔥API] Running in http://localhost:${port}/`);
});
