const PersonsService = {
  getById(knex, id) {
    return knex("person").select("id", "name").where({ id });
  },
  getByName(knex, name) {
    return knex("person").select("id", "name").where({ name }).first();
  },
  insertPerson(knex, person) {
    return knex("person")
      .insert(person)
      .returning("*")
      .then((rows) => rows[0]);
  },
};

module.exports = PersonsService;
