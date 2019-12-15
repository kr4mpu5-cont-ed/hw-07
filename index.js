const inquirer = require('inquirer');
const axios = require('axios');
const pdf = require('html-pdf');
const options = {
  format: 'Tabloid',
  orientation: 'Portrait',
};


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
            html_url,
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
        this.location = (location ? "<i class='fas fa-location-arrow'></i> <a href='https://maps.google.com/maps/place/" + location + "'>" + location + "</a>" : '');
        this.name = name;
        this.blog = (blog ? "<i class='fas fa-rss'></i> <a href='" + blog + "'>" + blog + "</a>" : '');
        this.bio = bio;
        this.html_url = (html_url ? "<i class='fab fa-github'></i> <a href='" + html_url + "'>" + this.githubUserName + "</a>" : '');
        this.public_repos = public_repos;
        this.followers = followers;
        this.following = following;
        this.stars = length;
        this.createHtml();
      }
    );
  }

  createHtml() {
    this.html = `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous" />
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous" />
      <link rel="stylesheet" href="assets/styles/style.css" type="text/css" />
      <link rel="stylesheet" href="assets/styles/print.css" type="text/css" media="print" />
      <title>Developer Profile Generator</title>
    </head>
    
    <body class="darkmode">
    
      <div class="container mt-3 pt-2 pb-2" style="background-color: lightgrey">
        <div class="container" style="background-color: white;">
    
          <div class="row">
            <div class="col text-center">
                <div class="jumbotron mt-2 divbg" style="z-index: 10;">
                  <!-- <img class="img-avatar" src="${this.avatar_url}" alt="GitHub Avatar" /><br /> -->
                  <img class="img-avatar" src="https://avatars3.githubusercontent.com/u/55921965?s=460&v=4" alt="GitHub Avatar" />
                  <br />
                  <br />
                  <h3>Hello.</h3>
                  <h3>My name is ${this.name}.</h3>
                  <p>${this.location} ${this.html_url} ${this.blog}</p>
                </div>
            </div>
          </div>
          <div class="row">
            <div class="col text-center">
              <div><h3>${this.bio}</h3></div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm text-center">
              <div class="card divbg" style="background-color: ${this.color};">
                <div class="card-body">
                  <h3 class="card-title">Public Repositories</h3>
                  <p class="card-text">${this.public_repos}</p>
                </div>
              </div>
            </div>
            <div class="col-sm text-center">
              <div class="card divbg" style="background-color: ${this.color};">
                <div class="card-body">
                  <h3 class="card-title">Followers</h3>
                  <p class="card-text">${this.followers}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm text-center">
              <div class="card divbg" style="background-color: ${this.color};">
                <div class="card-body">
                  <h3 class="card-title">GitHub Stars</h3>
                  <p class="card-text">${this.stars}</p>
                </div>
              </div>
            </div>
            <div class="col-sm text-center">
              <div class="card divbg" style="background-color: ${this.color};">
                <div class="card-body">
                  <h3 class="card-title">Following</h3>
                  <p class="card-text">${this.following}</p>
                </div>
              </div>
            </div>
          </div>
    
        </div>
      </div>
    
      <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous">
      </script>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous">
      </script>
    </body>
    
    </html>
    `;
    this.createPdf();
  }

  createPdf() {
    pdf.create(this.html, options).toFile('./dev-profile.pdf', function(err, res) {
      if (err) return console.log(err);
    });
  }
}

var newHomework = new DoMyHomework();
newHomework.promptUser();
