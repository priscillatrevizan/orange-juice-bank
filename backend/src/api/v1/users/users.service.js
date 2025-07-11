const createUser = ({ name, email, password }) => {
  // Mock: futuramente vamos salvar no banco
  return {
    id: Date.now(),
    name,
    email,
    createdAt: new Date()
  };
};

module.exports = { createUser };