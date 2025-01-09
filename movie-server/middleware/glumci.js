// middleware/glumci.js

let glumci = [
    {
        "id": 123,
        "name": "Morgan Freeman",
        "birthYear": 1937,
        "movies": [4222334]
    },
    {
        "id": 234,
        "name": "Marlon Brando",
        "birthYear": 1924,
        "movies": [5211223]
    },
    {
        "id": 345,
        "name": "Al Pacino",
        "birthYear": 1940,
        "movies": [5211223]
    }
];

const pronadiGlumca = (req, res, next) => {
    const id_route_param = parseInt(req.params.id);
    const glumac = glumci.find(glumac => glumac.id === id_route_param);

    if (glumac) {
        console.log('Glumac je pronađen u middlewareu:', glumac);
        req.glumac = glumac;
        next(); // u sljedeci middleware
    } else {
        res.status(404).json({ message: 'Glumac nije pronađen' });
    }
};

const glumacPostoji = (req, res, next) => {
    const { id } = req.body;
    const glumac_postoji = glumci.find(glumac => glumac.id === id);

    if (glumac_postoji) {
        return res.status(404).json({ message: `Glumac s ID-jem ${id} već postoji.` });
    }
    next();
}

export { glumci, pronadiGlumca, glumacPostoji };
