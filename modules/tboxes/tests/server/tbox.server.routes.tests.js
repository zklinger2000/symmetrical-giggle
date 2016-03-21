'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Tbox = mongoose.model('Tbox'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  tbox;

/**
 * Tbox routes tests
 */
describe('Tbox CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new tbox
    user.save(function () {
      tbox = {
        title: 'Tbox Title',
        content: 'Tbox Content'
      };

      done();
    });
  });

  it('should be able to save an tbox if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new tbox
        agent.post('/api/tboxes')
          .send(tbox)
          .expect(200)
          .end(function (tboxSaveErr, tboxSaveRes) {
            // Handle tbox save error
            if (tboxSaveErr) {
              return done(tboxSaveErr);
            }

            // Get a list of tboxes
            agent.get('/api/tboxes')
              .end(function (tboxesGetErr, tboxesGetRes) {
                // Handle tbox save error
                if (tboxesGetErr) {
                  return done(tboxesGetErr);
                }

                // Get tboxes list
                var tboxes = tboxesGetRes.body;

                // Set assertions
                (tboxes[0].user._id).should.equal(userId);
                (tboxes[0].title).should.match('Tbox Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an tbox if not logged in', function (done) {
    agent.post('/api/tboxes')
      .send(tbox)
      .expect(403)
      .end(function (tboxSaveErr, tboxSaveRes) {
        // Call the assertion callback
        done(tboxSaveErr);
      });
  });

  it('should not be able to save an tbox if no title is provided', function (done) {
    // Invalidate title field
    tbox.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new tbox
        agent.post('/api/tboxes')
          .send(tbox)
          .expect(400)
          .end(function (tboxSaveErr, tboxSaveRes) {
            // Set message assertion
            (tboxSaveRes.body.message).should.match('Title cannot be blank');

            // Handle tbox save error
            done(tboxSaveErr);
          });
      });
  });

  it('should be able to update an tbox if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new tbox
        agent.post('/api/tboxes')
          .send(tbox)
          .expect(200)
          .end(function (tboxSaveErr, tboxSaveRes) {
            // Handle tbox save error
            if (tboxSaveErr) {
              return done(tboxSaveErr);
            }

            // Update tbox title
            tbox.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing tbox
            agent.put('/api/tboxes/' + tboxSaveRes.body._id)
              .send(tbox)
              .expect(200)
              .end(function (tboxUpdateErr, tboxUpdateRes) {
                // Handle tbox update error
                if (tboxUpdateErr) {
                  return done(tboxUpdateErr);
                }

                // Set assertions
                (tboxUpdateRes.body._id).should.equal(tboxSaveRes.body._id);
                (tboxUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of tboxes if not signed in', function (done) {
    // Create new tbox model instance
    var tboxObj = new Tbox(tbox);

    // Save the tbox
    tboxObj.save(function () {
      // Request tboxes
      request(app).get('/api/tboxes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single tbox if not signed in', function (done) {
    // Create new tbox model instance
    var tboxObj = new Tbox(tbox);

    // Save the tbox
    tboxObj.save(function () {
      request(app).get('/api/tboxes/' + tboxObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', tbox.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single tbox with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/tboxes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Tbox is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single tbox which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent tbox
    request(app).get('/api/tboxes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No tbox with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an tbox if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new tbox
        agent.post('/api/tboxes')
          .send(tbox)
          .expect(200)
          .end(function (tboxSaveErr, tboxSaveRes) {
            // Handle tbox save error
            if (tboxSaveErr) {
              return done(tboxSaveErr);
            }

            // Delete an existing tbox
            agent.delete('/api/tboxes/' + tboxSaveRes.body._id)
              .send(tbox)
              .expect(200)
              .end(function (tboxDeleteErr, tboxDeleteRes) {
                // Handle tbox error error
                if (tboxDeleteErr) {
                  return done(tboxDeleteErr);
                }

                // Set assertions
                (tboxDeleteRes.body._id).should.equal(tboxSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an tbox if not signed in', function (done) {
    // Set tbox user
    tbox.user = user;

    // Create new tbox model instance
    var tboxObj = new Tbox(tbox);

    // Save the tbox
    tboxObj.save(function () {
      // Try deleting tbox
      request(app).delete('/api/tboxes/' + tboxObj._id)
        .expect(403)
        .end(function (tboxDeleteErr, tboxDeleteRes) {
          // Set message assertion
          (tboxDeleteRes.body.message).should.match('User is not authorized');

          // Handle tbox error error
          done(tboxDeleteErr);
        });

    });
  });

  it('should be able to get a single tbox that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new tbox
          agent.post('/api/tboxes')
            .send(tbox)
            .expect(200)
            .end(function (tboxSaveErr, tboxSaveRes) {
              // Handle tbox save error
              if (tboxSaveErr) {
                return done(tboxSaveErr);
              }

              // Set assertions on new tbox
              (tboxSaveRes.body.title).should.equal(tbox.title);
              should.exist(tboxSaveRes.body.user);
              should.equal(tboxSaveRes.body.user._id, orphanId);

              // force the tbox to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the tbox
                    agent.get('/api/tboxes/' + tboxSaveRes.body._id)
                      .expect(200)
                      .end(function (tboxInfoErr, tboxInfoRes) {
                        // Handle tbox error
                        if (tboxInfoErr) {
                          return done(tboxInfoErr);
                        }

                        // Set assertions
                        (tboxInfoRes.body._id).should.equal(tboxSaveRes.body._id);
                        (tboxInfoRes.body.title).should.equal(tbox.title);
                        should.equal(tboxInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single tbox if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new tbox model instance
    tbox.user = user;
    var tboxObj = new Tbox(tbox);

    // Save the tbox
    tboxObj.save(function () {
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = user.id;

          // Save a new tbox
          agent.post('/api/tboxes')
            .send(tbox)
            .expect(200)
            .end(function (tboxSaveErr, tboxSaveRes) {
              // Handle tbox save error
              if (tboxSaveErr) {
                return done(tboxSaveErr);
              }

              // Get the tbox
              agent.get('/api/tboxes/' + tboxSaveRes.body._id)
                .expect(200)
                .end(function (tboxInfoErr, tboxInfoRes) {
                  // Handle tbox error
                  if (tboxInfoErr) {
                    return done(tboxInfoErr);
                  }

                  // Set assertions
                  (tboxInfoRes.body._id).should.equal(tboxSaveRes.body._id);
                  (tboxInfoRes.body.title).should.equal(tbox.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (tboxInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single tbox if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new tbox model instance
    var tboxObj = new Tbox(tbox);

    // Save the tbox
    tboxObj.save(function () {
      request(app).get('/api/tboxes/' + tboxObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', tbox.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single tbox, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      username: 'temp',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create temporary user
    var _user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _user.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Tbox
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = user._id;

          // Save a new tbox
          agent.post('/api/tboxes')
            .send(tbox)
            .expect(200)
            .end(function (tboxSaveErr, tboxSaveRes) {
              // Handle tbox save error
              if (tboxSaveErr) {
                return done(tboxSaveErr);
              }

              // Set assertions on new tbox
              (tboxSaveRes.body.title).should.equal(tbox.title);
              should.exist(tboxSaveRes.body.user);
              should.equal(tboxSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the tbox
                  agent.get('/api/tboxes/' + tboxSaveRes.body._id)
                    .expect(200)
                    .end(function (tboxInfoErr, tboxInfoRes) {
                      // Handle tbox error
                      if (tboxInfoErr) {
                        return done(tboxInfoErr);
                      }

                      // Set assertions
                      (tboxInfoRes.body._id).should.equal(tboxSaveRes.body._id);
                      (tboxInfoRes.body.title).should.equal(tbox.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (tboxInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Tbox.remove().exec(done);
    });
  });
});
