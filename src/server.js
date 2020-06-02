import { Server, Model, Factory, hasMany, belongsTo, Serializer } from 'miragejs';
import faker from 'faker/locale/pl';

export function makeServer({ environment = 'test' }) {
    return new Server({
        environment,

        serializers: {
            application: Serializer.extend({
                embed: true,
                root: false
            }),
            offer: Serializer.extend({
                embed: true,
                root: false,
                include: ['seller', 'location']
            })
        },

        models: {
            category: Model.extend({
                offers: hasMany()
            }),
            offer: Model.extend({
                category: belongsTo(),
                seller: belongsTo(),
                location: belongsTo()
            }),
            seller: Model.extend({
                offer: belongsTo()
            }),
            location: Model.extend({
                offer: belongsTo()
            })
        },

        factories: {
            category: Factory.extend({
                name(i) {
                    const categoryNames = ['Motoryzacja', 'Nieruchomości', 'Praca', 'Dom i Ogród', 'Elektronika', 'Moda', 'Rolnictwo', 'Zwierzęta'];
                    return categoryNames[i % categoryNames.length];
                }
            }),
            offer: Factory.extend({
                name(i) {
                    return faker.commerce.productName();
                },
                description() {
                    return faker.lorem.paragraphs(3);
                },
                added_at() {
                    return faker.date.recent(60).toLocaleDateString();
                },
                price() {
                    return faker.commerce.price(100, 10000, 2, 'PLN ');
                },
                city(i) {
                    let cities = ['Warszawa', 'Kraków', 'Wrocław', 'Lublin', 'Gdańsk', 'Łódź', 'Koszalin', 'Zakopane'];
                    return cities[i % cities.length];
                },
                thumbnail_url(i) {
                    return `https://picsum.photos/id/${i*10}/200/300`;
                }
            }),
            seller: Factory.extend({
                name() {
                    return `${faker.name.firstName()} ${faker.name.lastName()}`;
                },
                phone() {
                    return faker.phone.phoneNumber();
                }
            }),
            location: Factory.extend({
                longitude() {
                    return faker.address.longitude();
                },
                latitude() {
                    return faker.address.latitude();
                }
            })
        },

        routes() {
            this.namespace = 'api';

            this.get('/categories');

            this.get('/categories/:id/offers', (schema, request) => {
                let category = schema.categories.find(request.params.id)

                return category.offers;
            });

            this.get('/offers/:id', (schema, request) => {
                let id = request.params.id

                return schema.offers.find(id)
            });
        },

        seeds(server) {
            server.createList('seller', 10);
            server.createList('category', 8).forEach((category) => {
                server.createList('offer', 20, { category, location: server.create('location') }).forEach(offer => {
                    const sellers = server.schema.sellers.all().models;
                    const randomSeller = sellers[offer.id % sellers.length];
                    offer.update('seller', randomSeller);
                })
            });
        }
    })
}