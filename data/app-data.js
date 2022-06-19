let boards = [];
let tasks = [];

function seedSampleData() {
  boards.length = 0;
  boards.push(
    {id: 1001, name: "Open"}, 
    {id: 1002, name: "In Progress"},
    {id: 1003, name: "Done"}
  );

  tasks.length = 0;
  addTask("Project skeleton",
    "Create project folders, services, controllers and views",
    "Done");
  addTask("Home page",
    "Create the [Home] page and list tasks count by board",
    "Done");
  addTask("View task board",
    "Create the [Task Board] page and list all tasks by board",
    "In Progress");
  addTask("Create tasks",
    "Implement [Create Task] page for adding new tasks",
    "Open");
  addTask("Edit tasks",
    "Implement [Edit Tasks] page for editing existing tasks",
    "Open");
  addTask("Improve CSS styles",
    "Implement better styling for all public pages",
    "Open");
}

function getTasks() {
	return tasks;
}

function findTaskById(id) {
  let results = tasks.filter(t => t.id == id);
  if (results.length == 1)
    return results[0];
  else
    return {errMsg: `Cannot find task by id: ${id}`}
}

function findTasksByKeyword(keyword) {
  if (isParamEmpty(keyword))
    return {errMsg: "Keyword cannot be empty!"};
  
  keyword = keyword.toLowerCase();
  let results = tasks.filter(t => 
	  JSON.stringify(t).toLowerCase().includes(keyword)
  );
  return results;
}

function findTasksByBoard(boardName) {
  let board = findBoardByName(boardName);
  if (board.errMsg)
    return board;

  let results = tasks.filter(t => t.board == board);
  return results;
}

function addTask(title, description, boardName) {
  if (isParamEmpty(title))
    return {errMsg: "Title cannot be empty!"};
  if (isParamEmpty(description))
    description = "";

  let board;
  if (boardName) {
    board = findBoardByName(boardName);
    if (board.errMsg)
      return board;
  }
  else {
    // Board name not provided => use the first board available
    board = boards[0];
  }
  
  let newId = 1; 
  if (tasks.length > 0)
    newId = 1 + tasks[tasks.length-1].id;
  let newTask = {
    id: newId,
	  title: title,
    description: description,
    board: board,
    dateCreated: new Date(),
    dateModified: new Date()
  };
  tasks.push(newTask);
  return {msg: "Task added.", task: newTask};
}

function editTask(id, title, description, boardName) {
  var existingTask = findTaskById(id);
  if (existingTask.errMsg)
    return existingTask;

  let taskNewData = {};

  if (typeof(title) != 'undefined') {
    if (isParamEmpty(title))
      return {errMsg: "Title cannot be empty!"};
    taskNewData.title = title;
  }

  if (typeof(description) != 'undefined') {
    taskNewData.description = description;
  }

  if (typeof(boardName) != 'undefined') {
    let board = findBoardByName(boardName);
    if (board.errMsg)
      return board;
    taskNewData.board = board;
  }
  
  Object.assign(existingTask, taskNewData);
  existingTask.dateModified = new Date();
  return {msg: "Task edited.", task: existingTask};
}

function deleteTaskById(id) {
  let index = tasks.findIndex(t => t.id == id);
  if (index != -1) {
    tasks.splice(index, 1);
    return {msg: `Task deleted: ${id}`};
  }
  else
    return {errMsg: `Cannot find task by id: ${id}`}
}

function getBoards() {
  return boards;
}

function findBoardByName(boardName) {
  if (boardName)
    boardName = boardName.toLowerCase();
  let matchingBoards = boards.filter(
    b => b.name.toLowerCase() == boardName);
  if (matchingBoards.length != 1)
    return {errMsg: "Invalid board: " + boardName};
  let board = matchingBoards[0];
  return board;
}

function isParamEmpty(p) {
  if (typeof(p) != 'string')
    return true;
  if (p.trim().length == 0)
    return true;
  return false;
}

module.exports = {
  seedSampleData,
  getTasks,
  findTaskById,
  findTasksByKeyword,
  findTasksByBoard,
  addTask,
  editTask,
  deleteTaskById,
  getBoards,
  findBoardByName,
};
