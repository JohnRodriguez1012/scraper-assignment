const routes = [
    require('./routes/html.js'),
    require('./routes/api.js'),
    require('./routes/standard.js')
];

module.exports = (app, db, approot) => {
    return routes.forEach((route) => {
        route(app, db, approot);
    });
};
