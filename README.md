
---

# API de Gerenciamento de Decks de Magic: The Gathering

Esta API foi desenvolvida para ajudar os alunos a aprenderem a utilizar recursos mais avançados do NestJS, adicionando complexidade ao projeto.

---

Desenvolvido por:  
Henrique Manganoti Pereira  
Rafael Yuzo Fuzii  
Enzo D'Andrey Lavieri Yarid  
Daniel Cardoso Martins

---

Para garantir o funcionamento adequado da API, certifique-se de que a versão 14 ou superior do Node.js esteja instalada.  
Após isso, instale todos os pacotes necessários executando o comando `npm i` no console.  
Quando a instalação for concluída, execute `npm run start` para iniciar a API.

---

## Rotas

### Cartas:
- **GET:** `/cards` - Retorna todas as cartas do banco de dados.

### Deck:
- **POST:** `/deck` - Salva o deck no banco de dados.
- **POST:** `/deck/import` - Salva o deck no banco de dados de acordo com o formato e as regras definidas pelo projeto.
- **GET:** `/deck/random` - Gera e salva um deck aleatório no banco de dados.
- **GET:** `/deck/admin/all` - Retorna todos os decks salvos, desde que o administrador esteja logado.
- **GET:** `/deck/my-decks` - Retorna todos os decks salvos na conta de um usuário comum.

### Usuários:
- **POST:** `/users/register` - Cadastra um novo usuário no banco de dados.
- **GET:** `/users` - Retorna todos os usuários cadastrados no banco de dados.

### Autenticação:
- **POST:** `/auth/register` - Cadastra um novo usuário com nome de usuário e senha.
- **POST:** `/auth/login` - Verifica se o nome de usuário e a senha estão corretos e realiza o login.

--- 
