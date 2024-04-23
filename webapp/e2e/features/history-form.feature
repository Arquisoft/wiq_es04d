Feature: Seeing the loged user history

Scenario: The user is not loged in the site
  Given A not loged user
  When Press history
  Then Redirected to login

Scenario: The user register in the site so he can see history
  Given A unregistered user, fill the register
  When I press history
  Then I see my history