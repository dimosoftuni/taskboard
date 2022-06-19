function setup(app, data) {
  app.get('/api', function(req, res) {
    let routes = app._router.stack
      .filter(r => r.route && r.route.path.startsWith('/api'))
    .map(rt => ({
      route: rt.route.path,
      method: rt.route.stack[0].method
    }));
    res.send(routes);
  });

  app.get('/api/tasks', function(req, res) {
    let result = data.getTasks();
    res.send(result);
  });

  app.get('/api/tasks/:id', function(req, res) {
    let result = data.findTaskById(req.params.id);
    if (result.errMsg)
      res.status(404).send(result);
    else
      res.send(result);
  });

  app.get('/api/tasks/search/:keyword', function(req, res) {
    let result = data.findTasksByKeyword(req.params.keyword);
    if (result.errMsg)
      res.status(404).send(result);
    else
      res.send(result);
  });

  app.get('/api/tasks/board/:boardName', function(req, res) {
    let result = data.findTasksByBoard(req.params.boardName);
    if (result.errMsg)
      res.status(404).send(result);
    else
      res.send(result);
  });

  app.post('/api/tasks', function(req, res) {
    let result = data.addTask(
      req.body.title, req.body.description, req.body.board);
    if (result.errMsg)
      res.status(400).send(result);
    else
      res.status(201).send(result);
  });
  
  app.patch('/api/tasks/:id', function(req, res) {
    let result = data.editTask(req.params.id,
      req.body.title, req.body.description, req.body.board);
    if (result.errMsg)
      res.status(400).send(result);
    else
      res.status(201).send(result);
  });

  app.delete('/api/tasks/:id', function(req, res) {
    let result = data.deleteTaskById(req.params.id);
    if (result.errMsg)
      res.status(404).send(result);
    else
      res.send(result);
  });

  app.get('/api/boards', function(req, res) {
    let result = data.getBoards();
    res.send(result);
  });
}

module.exports = { setup };
