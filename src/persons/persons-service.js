const PersonsService = {
  getById(knex, id) {
    return knex("person").select("id", "name").where({ id });
  },
};

module.exports = PersonsService;
