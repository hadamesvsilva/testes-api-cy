/// <reference types="cypress" />
import contrato from '../contracts/produtos.contract'
var faker = require('faker');

describe('Testes da Funcionalidade Usuários', () => {
     let token
     before(() => {
          cy.token('fulanomoreira@qa.com', 'teste').then(tkn => { token = tkn })
     });

     it('Deve validar contrato de usuários', () => {
          cy.request('usuarios').then(response =>{
               return contrato.validateAsync(response.body)
          })
     });

     it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios'
          }).then((response) => {
               expect(response.body.usuarios[0].nome).to.equal('novo usuario 87353792')
               expect(response.status).to.equal(200)
               expect(response.body).to.have.property('usuarios')
               expect(response.duration).to.be.lessThan(15)
          })
     });

     it('Deve cadastrar um usuário com sucesso', () => {
          let usuarios = `novo usuario ${Math.floor(Math.random() * 100000000)}`
          let emailFaker = faker.internet.email()
          let senhaFaker = faker.internet.password()

          cy.request({
               method: 'POST',
               url: 'usuarios',
               body: {
                    "nome": usuarios,
                    "email": emailFaker,
                    "password": senhaFaker,
                    "administrador": "true"
               },
               headers: { authorization: token }
          }).then((response) => {
               expect(response.status).to.equal(201)
               expect(response.body.message).to.equal('Cadastro realizado com sucesso')
          })
     });

     it.only('Deve validar um usuário com email inválido', () => {
          cy.cadastrarUsuarios('novo usuario 62121564', 'novouser.com.br', "pOe8S040JWJOKar", "true")
               .then((response) => {
                    expect(response.body.email).to.equal("email deve ser um email válido")
                    expect(response.status).to.equal(400)
               })
     });

     it.only('Deve validar um usuário com email repetido', () => {
          cy.cadastrarUsuarios('novo usuario 62121564', 'Granville62@gmail.com', "pOe8S040JWJOKar", "true")
               .then((response) => {
                    expect(response.status).to.equal(400)
                    expect(response.body.message).to.equal('Este email já está sendo usado')
               })
     });


     it('Deve editar um usuário previamente cadastrado', () => {
          let nomeFaker = faker.name.firstName()
          let emailFaker = faker.internet.email()
          let senhaFaker = faker.internet.password()
          cy.request('usuarios').then(response => {
               let id = response.body.usuarios[10]._id
               cy.request({
                    method: 'PUT',
                    url: `usuarios/${id}`,
                    body:
                    {
                         "nome": nomeFaker,
                         "email": emailFaker,
                         "password": senhaFaker,
                         "administrador": "true"
                    }
               }).then(response => {
                    expect(response.body.message).to.equal('Registro alterado com sucesso')
               })
          })
     });

     it('Deve editar um usuário cadastrado previamente', () => {
          let usuarios = `novo usuario ${Math.floor(Math.random() * 100000000)}`
          let emailFaker = faker.internet.email()
          let senhaFaker = faker.internet.password()
          let emailFaker1 = faker.internet.email()
          let senhaFaker2 = faker.internet.password()
          cy.cadastrarUsuarios(usuarios, emailFaker, senhaFaker, "true")
               .then(response => {
                    let id = response.body._id

                    cy.request({
                         method: 'PUT',
                         url: `usuarios/${id}`,
                         body:
                         {
                              "nome": usuarios,
                              "email": emailFaker1,
                              "password": senhaFaker2,
                              "administrador": "true"
                         }
                    }).then(response => {
                         expect(response.body.message).to.equal('Registro alterado com sucesso')
                    })
               })

     });


     it('Deve deletar um usuário previamente cadastrado', () => {
          let usuarios = `novo usuario ${Math.floor(Math.random() * 100000000)}`
          let emailFaker = faker.internet.email()
          let senhaFaker = faker.internet.password()
          cy.cadastrarUsuarios(usuarios, emailFaker, senhaFaker, "true")
               .then(response => {
                    let id = response.body._id
                    cy.request({
                         method: 'DELETE',
                         url: `usuarios/${id}`,
                    }).then(response => {
                         expect(response.body.message).to.equal('Registro excluído com sucesso')
                         expect(response.status).to.equal(200)
                    })
               })

     });

});
