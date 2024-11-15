class Proizvod {
    constructor(id, naziv, cijena, velicine, opis, slike, dostupne_boje, karakteristike) {
        this.id = id;
        this.naziv = naziv;
        this.cijena = cijena;
        this.velicine = velicine;
        this.opis = opis;
        this.slike = slike;
        this.dostupne_boje = dostupne_boje;
        this.karakteristike = karakteristike;
    }
}

const proizvodi = [
    new Proizvod(1, 'Obična crna majica', 100, ['XS', 'S', 'M', 'L'], 'majica na kratke rukave', ['https://lumer-shop.eu/wp-content/uploads/2019/09/muska-crna-710x800.jpg', 'https://i00.eu/img/726/1024x1024/43ue8kon/18493.jpg'], ['bijela', 'siva'], '100% pamuk, obična crna majica'),
    new Proizvod(2, "Levi's 501 traperice", 110, ['S', 'M', 'L'], 'duge hlače, skupe', ['https://lsco.scene7.com/is/image/lsco/005010114-detail1-pdp-ld?fmt=jpeg&qlt=70&resMode=sharp2&fit=crop,1&op_usm=0.6,0.6,8&wid=2000&hei=1840'], ['plave'], 'klasične traperice'),
    new Proizvod(3, 'Zimska kapa', 40, ['onesize'],'dobra za zimu', ['https://static.reserved.com/media/catalog/product/cache/1200/a4e40ebdc3e371adff845072e1c73f37/8/1/8187O-MLC-010-1-565071_3.jpg'], ['crna', 'siva'], 'bit će super za zimu, izgledat ćeš kul'),
    new Proizvod(4, 'Čarape Adidas', 20, ['34-36', '37-39', '40-42'], 'čarape', ['https://www.sportvision.hr/files/images/slike_proizvoda/media/DZ9/DZ9393/images/DZ9393.jpg'], ['crna', 'siva', 'plava'], 'pamučne čarape'),
    new Proizvod(5, 'Tenisice Nike', 200, ['38', '39', '40', '41', '42', '43', '44', '45'], 'obične patike za dvoranu', ['https://www.sportvision.hr/files/thumbs/files/images/slike_proizvoda/media/DH9/DH9393-002/images/thumbs_800/DH9393-002_800_800px.jpg.webp'], ['crna','crvena'], 'prigodne za sva godisnja doba')
];

export { proizvodi, Proizvod };
