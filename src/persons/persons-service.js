const PersonsService = {
  getById(knex, id) {
    return knex("person").select("id", "name").where({ id });
  },
  getByName(knex, name) {
    return knex("person").select("id", "name").where({ name }).first();
  },
};

module.exports = PersonsService;
