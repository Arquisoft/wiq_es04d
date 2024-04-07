Feature: Login a existing user

Scenario: The user is registered in the site
  Given A registered user, fill the data
  When Presses submit
  Then The user is redirected