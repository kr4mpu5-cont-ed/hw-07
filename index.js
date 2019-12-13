const inquirer = require('inquirer');
const axios = require('axios');
const pdf = require('html-pdf');

class DoMyHomework {
  constructor() {
    this.githubUserName = null;
    this.color = null;
  }

  promptUser() {
    return inquirer
      .prompt([
        {
          message: 'What is your user name?',
          name: 'githubUserName'
        },
        {
            message: 'Background color?',
            name: 'color'
        }
      ])
      .then(({ githubUserName, color }) => {
        this.githubUserName = githubUserName;
        this.color = color;
        this.makeApiRequest();
      });
  }

  makeApiRequest() {
    return Promise.all([
      axios.get(`https://api.github.com/users/${this.githubUserName}`),
      axios.get(`https://api.github.com/users/${this.githubUserName}/starred`)
    ]).then(
      ([
        {
          data: {
            avatar_url,
            location,
            name,
            blog,
            bio,
            public_repos,
            followers,
            following
          }
        },
        {
          data: { length }
        }
      ]) => {
        this.avatar_url = avatar_url;
        this.location = location;
        this.name = name;
        this.blog = blog;
        this.bio = bio;
        this.public_repos = public_repos;
        this.followers = followers;
        this.following = following;
        this.stars = length;
        console.log(this);
        this.createHtml();
      }
    );
  }

//   <html>
//   <body>
//   <div>name: ${this.name}</div>
//   <div>bio: ${this.bio}</div>
//   </body>
//   </html>

  createHtml() {
    this.html = `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        <link rel="stylesheet" href="assets/styles/style.css" />
        <title>Developer Profile Generator</title>
      </head>
      <body>
    
            <div class="container">
    
                <div style="background-color: ${this.color};">
                    <img src="${this.avatar_url}" alt="GitHub Avatar" />
                    Hello.
                    My name is ${this.name}.
                    ${this.location}, ${this.githubUserName}+github url, ${this.blog}
                </div>
    
                <div>${this.bio}</div>
    
                <div class="row row-cols-1 row-cols-md-2">
                        <div class="col mb-4">
                          <div class="card" style="background-color: ${this.color};">
                            <div class="card-body">
                              <h5 class="card-title">Public Repositories</h5>
                              <p class="card-text">${this.public_repos}</p>
                            </div>
                          </div>
                        </div>
                        <div class="col mb-4">
                          <div class="card" style="background-color: ${this.color};">
                            <div class="card-body">
                              <h5 class="card-title">Followers</h5>
                              <p class="card-text">${this.followers}</p>
                            </div>
                          </div>
                        </div>
                        <div class="col mb-4">
                          <div class="card" style="background-color: ${this.color};">
                            <div class="card-body">
                              <h5 class="card-title">GitHub Stars</h5>
                              <p class="card-text">${this.stars}</p>
                            </div>
                          </div>
                        </div>
                        <div class="col mb-4">
                          <div class="card" style="background-color: ${this.color};">
                            <div class="card-body">
                              <h5 class="card-title">Following</h5>
                              <p class="card-text">${this.following}</p>
                            </div>
                          </div>
                        </div>
                      </div>
    
            </div>
    
        <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
      </body>
    </html>    
    `;
    console.log(this);
    this.createPdf();
  }

  createPdf() {
    pdf.create(this.html).toFile('./dev-profile.pdf', function(err, res) {
      if (err) return console.log(err);
      console.log(res);
    });
  }
}

var newHomework = new DoMyHomework();
newHomework.promptUser();
