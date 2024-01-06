"use strict";

app.get('/protected', function (req, res) {
  if (req.session.loggedIn) {
    // User is authenticated, perform actions here
    res.send('Protected resource accessed');
  } else {
    res.status(401).send('Unauthorized');
  }
});