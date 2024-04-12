# Orbit Skills Admin Panel

`Orbit Skills Admin Panel` is a webapp created specifically to manage all the data of users, courses, and settings for `Orbit Skills Web Application` and `Orbit Skill Mobile Application`.

## Technologies Used

- node @16.15.0
- react @17.0.2
- next @12.0.7

## Installation

In order to run `Orbit Skills Admin Panel` on your local machine,
all you need to do is follow the installation steps below

- Install node.js (Go to [official website](https://nodejs.org/en/) for the help)
- Install git (Go to [git install instructions](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) for the help)
- Clone the repository: `git clone https://git.knovator.in/knovators/lms-admin-panel.git`
- In project folder, execute: `npm install` or `yarn install`
- To start project on local server in development mode, execute: `npm run dev` or `yarn dev`
- Open http://localhost:5689 in browser

## Features

- Learner : manage users registered in system using web app and mobile app
- Partners : manage creators of courses
- Category : manage course categories
- Courses : manage courses
- Widget : manage widgets
- Page : manage content of homepage displayed at learner panel
- Order : View/Export details of orders
- Transaction : View/Export details of transactions done from system
- Reviews : Manage reviews added by end users
- Notification Management : Manage Push Notification to be sent
- Roles and Permissions : Manage access of components for user's logged in to admin panel
- Master : Manage masters data
  - Submasters - Manage Submasters data
  - Country - Manage country data
  - State - Manage State data
  - City - Manage city data
  - Zipcode - Manage zipcode data

## Folder Structure

Here is a brief explanation of the template folder structure and some of its main files usage:

```
└── api                         # Contains backend api call settings
    └── index.js
    └── list.js
└── components                  # Contains all jsx files
   └── [folder_name].js
       └── [file_name].js
└── hooks                       # Contains all js files
    └── [folder_name].js
       └── [file_name].js
└── icons                       # Contains all icons
    └── [icon_name].jsx
└── lib                         # Contains all config files of session
    └── [file_name].js
└── locales                     # Contains all json files of Internationalization
    └── [language_name].json
└── pages                       # Contains all JavaScript files
    └── api                     # Contains all api route files
        └── [route_name].js
    └── app.jsx
    └── [page_name].jsx
└── public                      # Contains all static files
    └── images                  # Contains all static images
        └── [image_name].png
└── schema                      # Contains all validation files
    └── [file_name].js
└── shared                      # Contains all the files/folder used multiple time across all pages
    └── [folder_name].js
        └── [file_name].js
└── styles                      # Contains all css files
    └── [file_name].css
└── utils                       # Contains all constant declaration files
    └── [file_name].js
└── widgets                     # Contains all custom widgets
    └── [file_name].jsx
└── .env.development            # Development server config
└── .babelrc                    # Babel ES6 Transpiler
└── .eslintrc.js                # JavaScript Linting
└── .gitattributes              # Git Attributes
└── .gitignore                  # Ignored files in Git
└── jsconfig.json               # Configuration file to assist your text editor
└── i18.json                    # Internationalization config files
└── package.json                # Package metadata
└── README.md                   # Manual file
└── tailwind.config.js          # Tailwind css config file
└── yarn.lock                   # Yarn metadata
```

## Contributions

Contributions are always welcome!

To contribute to the project, please keep these things in mind:

- Environment branches used: development, main, master. Master pointing to production, main pointing to staging & development pointing to development.
- Project uses git-flow style branching strategy. Base branch for Git-flow is master. Working branch is development.
- Use smaller commits, and write descriptive commit messages.
- Fix all possible Lint errors before merging feature branch into any environment.
