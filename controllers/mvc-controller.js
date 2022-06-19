function setup(app, data) {
  app.get('/', function(req, res) {
    let tasks = data.getTasks();
    let boards = data.getBoards().map(b => ({
      boardName: b.name, 
      tasks: tasks.filter(t => t.board.id == b.id)
    }));
    let model = { tasks, boards };
    res.render('home', model);
  });

  app.get('/boards', function(req, res) {
    let tasks = data.getTasks();
    let boards = data.getBoards().map(b => ({
      boardName: b.name, 
      tasks: tasks.filter(t => t.board.id == b.id)
    }));
    let model = { tasks, boards };
    res.render('boards', model);
  });

  app.get('/tasks/view/:id', function(req, res) {
    let task = data.findTaskById(req.params.id);
    if (task.errMsg) {
      model = {errText: 'Task Not Found', 
        errDetails: task.errMsg};
      res.render('error', model);
    }
    else { 
      let model = { task, date2text };
	    res.render('task-details', model);
    }
  });

  app.get('/tasks/search', function(req, res) {
    model = { keyword: "" };
    if (req.query.keyword) {
      model.keyword = req.query.keyword;
      let tasks = data.findTasksByKeyword(req.query.keyword);
      model.tasks = tasks;
    }
    res.render('search-tasks', model);
  });

  app.get('/tasks/create', function(req, res) {
    let model = {
      title: "", description: "",
      boards: data.getBoards()
    };
    res.render('create-task', model);
  });

  app.post('/tasks/create', function(req, res) {
    let result = data.addTask(
      req.body.title, req.body.description,
      req.body.boardName);
    if (result.errMsg) {
      let model = {
        title: req.body.title,
        description: req.body.description,
        boards: data.getBoards(),
        boardName: req.body.boardName,
        errMsg: result.errMsg
      };
      return res.render('create-task', model);
    } else {
      res.redirect('/boards');
    }
  });

  app.get('/tasks/edit/:id', function(req, res) {
    let task = data.findTaskById(req.params.id);
    if (task.errMsg) {
      model = {errText: 'Task Not Found', 
        errDetails: task.errMsg};
      res.render('error', model);
    }
    else {
      let model = {
        title: task.title,
        description: task.description,
        boards: data.getBoards(),
        boardName: task.board.name,
      };
      res.render('edit-task', model);
    }
  });

  app.post('/tasks/edit/:id', function(req, res) {
    let result = data.editTask(req.params.id,
      req.body.title, req.body.description,
      req.body.boardName);
    if (result.errMsg) {
      let model = {
        title: req.body.title,
        description: req.body.description,
        boards: data.getBoards(),
        boardName: req.body.boardName,
        errMsg: result.errMsg
      };
      return res.render('edit-task', model);
    } else {
      res.redirect('/boards');
    }
  });

  function date2text(inputDate) {
    let date = inputDate.toISOString().split('.')[0];
    date = date.replace('T', ' ');
    return date;
  }
}

module.exports = { setup };
