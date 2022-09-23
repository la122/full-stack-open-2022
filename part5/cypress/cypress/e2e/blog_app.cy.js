describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Shows login form', function () {
    cy.contains('login')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.get('#notification')
        .should('contain', 'logged in as mluukkai')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('#notification')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('a new blog can be created', function () {
      cy.contains('new blog').click()
      cy.get('#title-input').type('a blog created by cypress')
      cy.get('#author-input').type('cypress')
      cy.get('#url-input').type('www.cypress.io')
      cy.get('#create-button').click()
      cy.contains('a blog created by cypress')
    })

    describe('When there is a blog', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'a blog created by cypress',
          author: 'cypress',
          url: 'www.cypress.io'
        })
      })

      it('user can like a blog', function () {
        cy.contains('view').click()
        cy.get('#like-button').click()
        cy.contains('1')
      })

      it('user can delete his blog', function () {
        cy.contains('view').click()
        cy.contains('delete').click()
        cy.contains('removed blog')
      })

      it('other users cannot delete the blog', function () {
        const user = {
          name: 'Not Matti Luukkainen',
          username: 'notmluukkai',
          password: 'salainen'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user)
        cy.login({ username: 'notmluukkai', password: 'salainen' })
        cy.contains('view').click()
        cy.get('html').should('not.contain', 'delete')
      })
    })

    it('blogs are ordered according to likes', function () {
      cy.createBlog({
        title: 'The title with the least likes',
        author: 'cypress',
        url: 'www.cypress.io'
      })

      cy.createBlog({
        title: 'The title with the most likes',
        author: 'cypress',
        url: 'www.cypress.io'
      })

      cy.createBlog({
        title: 'The title with the second most likes',
        author: 'cypress',
        url: 'www.cypress.io'
      })

      cy.contains('the most likes').contains('view').click()
      cy.get('#like-button').click()
      cy.contains('hide').click()

      cy.contains('the second most likes').contains('view').click()
      cy.get('#like-button').click()
      cy.contains('hide').click()

      cy.contains('the most likes').contains('view').click()
      cy.get('#like-button').click()
      cy.contains('hide').click()

      cy.get('.blog').eq(0).should('contain', 'The title with the most likes')
      cy.get('.blog')
        .eq(1)
        .should('contain', 'The title with the second most likes')
    })
  })
})
