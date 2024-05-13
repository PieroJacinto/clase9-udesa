const db = require('../database/models'); //Requerimos la conexión a la base de datos y todos los modelos.
const op = db.Sequelize.Op

const movieController = {
    show: function (req, res) {
        let id = req.params.id;

        db.Movie.findByPk(id)
            .then(data => {
                return res.render('movie', { movie: data });
            })
            .catch(error => {
                console.log(error);
            })

    },
    new: function (req, res) {
        //últimas 5 películas ordenadas según su fecha de estreno. Cada título de película deberá ser un hipervínculo para ver el detalle de la misma.
        db.Movie.findAll({
            order: [
                ['release_date', 'DESC']
            ],
            limit: 5,
        })
            .then(data => {
                return res.render('new', { movies: data })
            })
            .catch(error => {
                console.log(error);
            })
    },
    recomended: function (req, res) {
        // Deberá mostrar las películas cuyo rating sea mayor o igual a 8. Cada título de película deberá ser un hipervínculo para ver el detalle de la misma.

        db.Movie.findAll({
            where: [
                { rating: { [op.gte]: 8 } }
            ],
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(data => {
                return res.render('new', { movies: data, title: 'Recomendadas' })
            })
            .catch(error => {
                console.log(error);
            })
    },
    search: function (req, res) {
        let infoABuscar = req.query.search; //obtengo la info de la querystring.

        db.Movie.findAll({
            //SELECT * FROM movies
            //WHERE title LIKE "%potter%"
            where: [
                { title: { [op.like]: '%' + infoABuscar + '%' } }
            ]
        })
            .then(data => {
                return res.render('index', { movies: data });
            })
            .catch(error => {
                console.log(error);
            })
    },
    create: function (req, res) {
        //Mostrar formulario de carga de películas
        db.Genre.findAll()
            .then(data => {
                return res.render('movieNew', { genres: data });
            })
            .catch(error => {
                console.log(error);
            })
    },
    store: function (req, res) {
        //Método para guardar nueva película.
        //1) Obtener datos del formulario
        let data = req.body;

        //2)Crear pelicula nueva.
        let movie = {
            title: data.title,
            rating: data.rating,
            awards: data.awards,
            release_date: data.release_date,
            length: data.length,
            genre_id: data.genre_id
        }
        //3)Guardar película
        db.Movie.create(movie)
            .then((movieCreada) => {
                //4)Redirección
                return res.redirect('/');
            })
            .catch(error => {
                console.log(error);
            })
    },
    editMovie: function ( req, res ) {
        const id = req.params.id
        db.Movie.findByPk(id)
        .then(function (movie) {
            if (!movie) {                
                return res.status(404).send("Película no encontrada");
            }            
            db.Genre.findAll()
                .then(function (genres) {                   
                    res.render('updateMovie', { movie: movie, genres: genres });
                })
                .catch(function (error) {                    
                    console.error("Error al obtener los géneros:", error);
                    res.status(500).send("Error interno del servidor");
                });
        })
        .catch(function (error) {
            // Manejar errores de consulta de la película
            console.error("Error al obtener la película:", error);
            res.status(500).send("Error interno del servidor");
        });
            
    },
    update: function (req, res) {
        let id = req.params.id
        let form = req.body
        console.log("form: ", form);
        let filtro = {
            where: { id: id }
        };

        db.Movie.update(form, filtro)
            .then((result) => {
                return res.redirect("/movies/detail/" + id);
            }).catch((err) => {
                return console.log(err);
            });
    },
    destroy: function (req, res) {
        let movieABorrar = req.params.id;

        db.Movie.destroy({
            where: [
                { id: movieABorrar }
            ]
        })
            .then(() => {
                return res.redirect('/');
            })
            .catch(error => {
                console.log(error);
            })
    }


}

module.exports = movieController