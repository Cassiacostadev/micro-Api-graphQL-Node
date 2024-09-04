// Importações principais do ApolloServer e funções auxiliares
import { ApolloServer, gql } from 'apollo-server';
import { randomUUID } from 'node:crypto'; // Função para gerar UUIDs únicos

/**
 * Exemplos de Under Fetching e Over Fetching
 * 
 * Under fetching: Quando a rota HTTP retorna menos dados do que o necessário.
 * Over fetching: Quando a rota HTTP retorna mais dados do que o necessário.
 */

// Definição do schema GraphQL usando a tag gql
const typeDefs = gql`
  # Definindo o tipo User com dois campos: id e name
  type User {
    id: String
    name: String
  }

  # Definindo as Queries e Mutations disponíveis na API
  type Query {
    # Query para listar todos os usuários
    users: [User]
  }

  type Mutation {
    # Mutation para criar um novo usuário
    createUser(name: String!): User
  }
`;

// Definindo a interface User para o TypeScript, representando o mesmo tipo do schema GraphQL
interface User {
  id: string;
  name: string;
}

// Array que armazenará os usuários criados em memória
const users: User[] = [];

// Criação do servidor Apollo, passando o schema (typeDefs) e os resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers: {
    // Resolvers são funções que correspondem a operações no schema
    Query: {
      // Resolver para a Query "users" que retorna todos os usuários
      users: () => {
        return users; // Retorna o array de usuários
      },
    },
    Mutation: {
      // Resolver para a Mutation "createUser", que cria um novo usuário
      createUser: (_, args) => {
        // Cria um novo objeto usuário com um ID único e o nome fornecido nos argumentos
        const user = {
          id: randomUUID(), // Gera um UUID para o novo usuário
          name: args.name,
        };
        
        users.push(user); // Adiciona o novo usuário ao array
        return user; // Retorna o usuário criado
      },
    },
  },
});

// Inicialização do servidor, especificando que ele vai rodar em uma porta
server.listen().then(({ url }) => {
  console.log(`🚀 HTTP server running on ${url}`); // Loga a URL onde o servidor está rodando
});
