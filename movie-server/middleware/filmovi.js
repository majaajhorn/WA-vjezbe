// middleware/filmovi.js

let filmovi = [
    {
        "id": 4222334,
        "title": "The Shawshank Redemption",
        "year": 1994,
        "genre": "Drama",
        "director": "Frank Darabont"
    },
    {
        "id": 5211223,
        "title": "The Godfather",
        "year": 1972,
        "genre": "Crime",
        "director": "Francis Ford Coppola"
    },
    {
        "id": 4123123,
        "title": "The Dark Knight",
        "year": 2008,
        "genre": "Action",
        "director": "Christopher Nolan"
    }
];

const pronadiFilm = (req, res, next) => {
    const id_route_param = parseInt(req.params.id);
    console.log('Tražim film s IDem: ', id_route_param);
    
    const film = filmovi.find(film => film.id === id_route_param);

    if (film) {
        console.log('Film je pronađen u middlewareu:', film);
        req.film = film;
        next(); // u sljedeci middleware
    } else {
        res.status(404).json({ message: 'Film nije pronađen' });
    }
};

const filmPostoji = (req, res, next) => {
    const { id } = req.body;
    const film_postoji = filmovi.find(film => film.id === id);

    if (film_postoji) {
        return res.status(404).json({ message: `Film s ID-jem ${id} već postoji.` });
    }
    next();
}

// izvoz middleware funckija
export { filmovi, pronadiFilm, filmPostoji };